import React, { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "./button";
import { useToast } from "../../hooks/use-toast";

interface ImageData {
  id: string;
  file: File;
  preview: string;
  name: string;
}

interface MultiImageUploadProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxFileSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  disabled = false,
  className = "",
}) => {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImageId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: `Types acceptés: ${acceptedTypes.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `Taille maximale: ${maxFileSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const createImageData = (file: File): Promise<ImageData> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: generateImageId(),
          file,
          preview: e.target?.result as string,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite atteinte",
        description: `Maximum ${maxImages} images autorisées`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;

    try {
      const newImageData = await Promise.all(
        validFiles.map(createImageData)
      );
      
      onImagesChange([...images, ...newImageData]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Images ajoutées",
        description: `${newImageData.length} image(s) ajoutée(s) avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du traitement des images",
        variant: "destructive",
      });
    }
  };

  const startCapture = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreamActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra. Vérifiez les permissions.",
        variant: "destructive",
      });
      setIsCapturing(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !streamActive) return;

    if (images.length >= maxImages) {
      toast({
        title: "Limite atteinte",
        description: `Maximum ${maxImages} images autorisées`,
        variant: "destructive",
      });
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `capture_${Date.now()}.jpg`, { 
          type: 'image/jpeg' 
        });
        
        const imageData = await createImageData(file);
        onImagesChange([...images, imageData]);
        
        toast({
          title: "Photo capturée",
          description: "Image ajoutée avec succès",
        });
      }, 'image/jpeg', 0.8);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la capture",
        variant: "destructive",
      });
    }
  };

  const stopCapture = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
    setStreamActive(false);
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
    
    toast({
      title: "Image supprimée",
      description: "L'image a été supprimée avec succès",
    });
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Controls */}
      {!isCapturing && canAddMore && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importer des images
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={startCapture}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Prendre une photo
          </Button>
        </div>
      )}

      {/* Camera Capture Interface */}
      {isCapturing && (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-w-md mx-auto rounded-lg border-2 border-boviclouds-primary"
            />
            {streamActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg bg-black bg-opacity-20 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Cadrer l'animal</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              type="button"
              onClick={capturePhoto}
              disabled={!streamActive}
              className="bg-boviclouds-primary hover:bg-boviclouds-green-dark flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Capturer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={stopCapture}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                <img
                  src={image.preview}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  disabled={disabled}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Supprimer cette image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              {/* Image name */}
              <p className="mt-1 text-xs text-gray-600 truncate" title={image.name}>
                {image.name}
              </p>
            </div>
          ))}
          
          {/* Add more button */}
          {canAddMore && !isCapturing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500">Ajouter</span>
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !isCapturing && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Aucune image ajoutée</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Importer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={startCapture}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Caméra
            </Button>
          </div>
        </div>
      )}

      {/* Status info */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{images.length} / {maxImages} images</span>
        <span>Max {maxFileSize}MB par image</span>
      </div>

      {/* Warnings */}
      {images.length >= maxImages && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700">
            Limite maximale d'images atteinte ({maxImages})
          </span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileUpload}
        className="hidden"
        multiple
        disabled={disabled}
      />

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MultiImageUpload;
export type { ImageData };
