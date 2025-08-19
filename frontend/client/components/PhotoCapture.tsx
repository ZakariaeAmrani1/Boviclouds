import React, { useState, useRef, useCallback } from "react";
import { Camera, Upload, CheckCircle, RefreshCw, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";

interface PhotoCaptureProps {
  onCapture: (imageData: string) => void;
  title: string;
  description: string;
  captured?: boolean;
  capturing?: boolean;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onCapture,
  title,
  description,
  captured = false,
  capturing = false,
  maxFileSize = 10,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<"camera" | "upload">("camera");

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment", // Use back camera if available
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraStream(stream);
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(
        "Impossible d'accéder à la caméra. Vérifiez les permissions de votre navigateur."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setCameraActive(false);
    }
  }, [cameraStream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image data
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(imageData);
    
    // Stop camera after capture
    stopCamera();
  }, [onCapture, stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setFileError(
        `Format non supporté. Formats acceptés: ${acceptedFormats
          .map((format) => format.split("/")[1].toUpperCase())
          .join(", ")}`
      );
      return;
    }

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setFileError(`La taille du fichier ne doit pas dépasser ${maxFileSize}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImage(imageData);
      onCapture(imageData);
    };
    reader.readAsDataURL(file);
  }, [acceptedFormats, maxFileSize, onCapture]);

  const resetUpload = useCallback(() => {
    setUploadedImage(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Cleanup camera stream on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className="w-5 h-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as "camera" | "upload")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Caméra
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="space-y-4">
              {/* Camera Feed */}
              <div
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                    
                    {captured && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Photo capturée
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p>Caméra non démarrée</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Error */}
              {cameraError && (
                <Alert variant="destructive">
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              )}

              {/* Camera Controls */}
              <div className="flex gap-2">
                {!cameraActive ? (
                  <Button
                    onClick={startCamera}
                    disabled={capturing}
                    className="flex-1 bg-boviclouds-primary hover:bg-boviclouds-primary/90"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Démarrer la caméra
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={capturePhoto}
                      disabled={capturing || captured}
                      className="flex-1 bg-boviclouds-primary hover:bg-boviclouds-primary/90"
                    >
                      {capturing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Capture en cours...
                        </>
                      ) : captured ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Photo capturée
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Prendre la photo
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      disabled={capturing}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Arrêter
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-boviclouds-primary transition-colors cursor-pointer"
                onClick={() => !captured && fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img
                      src={uploadedImage}
                      alt="Image uploadée"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    {captured && (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Image importée avec succès</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Cliquez pour importer une image
                      </p>
                      <p className="text-sm text-gray-500">
                        ou glissez-déposez votre fichier ici
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Formats acceptés: {acceptedFormats
                        .map((format) => format.split("/")[1].toUpperCase())
                        .join(", ")} • Max {maxFileSize}MB
                    </p>
                  </div>
                )}
              </div>

              {/* File Error */}
              {fileError && (
                <Alert variant="destructive">
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(",")}
                onChange={handleFileUpload}
                className="hidden"
                disabled={captured}
              />

              {/* Reset Button */}
              {uploadedImage && (
                <Button
                  onClick={resetUpload}
                  variant="outline"
                  className="w-full"
                  disabled={capturing}
                >
                  <X className="w-4 h-4 mr-2" />
                  Changer l'image
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default PhotoCapture;
