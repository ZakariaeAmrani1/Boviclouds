import React, { useState, useRef } from "react";
import { Camera, Upload, CheckCircle, RefreshCw, Image, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Camera as CameraType } from "@shared/cctv";
import CameraCapture from "./CameraCapture";

type CaptureMode = "camera" | "upload";

interface ImageCaptureOptionsProps {
  camera?: CameraType;
  onCapture: (imageData: string) => void;
  onFileUpload: (file: File) => void;
  capturing?: boolean;
  captured?: boolean;
  title: string;
  description: string;
  defaultMode?: CaptureMode;
  allowModeSwitch?: boolean;
}

const ImageCaptureOptions: React.FC<ImageCaptureOptionsProps> = ({
  camera,
  onCapture,
  onFileUpload,
  capturing = false,
  captured = false,
  title,
  description,
  defaultMode = "camera",
  allowModeSwitch = true,
}) => {
  const [activeMode, setActiveMode] = useState<CaptureMode>(defaultMode);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale: 10MB');
        return;
      }

      setUploadedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Convert to base64 for onCapture callback
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onCapture(result);
      };
      reader.readAsDataURL(file);
      
      // Also call onFileUpload with the file
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearUpload = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUploadSection = () => (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!uploadedFile ? (
        <div
          className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-boviclouds-primary transition-colors cursor-pointer"
          onClick={handleUploadClick}
        >
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Cliquez pour sélectionner une image
            </p>
            <p className="text-xs text-gray-500">
              Formats supportés: JPG, PNG, GIF (max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div
            className="relative bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <img
              src={previewUrl || ''}
              alt="Image sélectionnée"
              className="w-full h-full object-cover"
            />
            
            {/* Success overlay */}
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Image sélectionnée
              </div>
            </div>
            
            {/* Clear button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearUpload();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* File info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Sélectionnée</Badge>
          </div>
          
          {/* Change file button */}
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Changer l'image
          </Button>
        </div>
      )}
    </div>
  );

  if (!allowModeSwitch) {
    // If mode switching is not allowed, render the appropriate mode directly
    if (activeMode === "upload") {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="w-5 h-5" />
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600">{description}</p>
          </CardHeader>
          <CardContent>
            {renderUploadSection()}
          </CardContent>
        </Card>
      );
    } else {
      // Camera mode
      return camera ? (
        <CameraCapture
          camera={camera}
          onCapture={onCapture}
          capturing={capturing}
          captured={captured}
          title={title}
          description={description}
        />
      ) : (
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <Camera className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-red-600">Caméra non disponible</p>
        </div>
      );
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {activeMode === "camera" ? (
            <Camera className="w-5 h-5" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as CaptureMode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Caméra en direct
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importer une image
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="mt-4">
            {camera ? (
              <CameraCapture
                camera={camera}
                onCapture={onCapture}
                capturing={capturing}
                captured={captured && activeMode === "camera"}
                title=""
                description=""
              />
            ) : (
              <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                <Camera className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-red-600">
                  Aucune caméra disponible. Utilisez l'option d'import d'image.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            {renderUploadSection()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImageCaptureOptions;
