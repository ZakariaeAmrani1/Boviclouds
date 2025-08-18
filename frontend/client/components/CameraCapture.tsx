import React, { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Camera as CameraType } from "@shared/cctv";

interface CameraCaptureProps {
  camera: CameraType;
  onCapture: (imageData: string) => void;
  capturing?: boolean;
  captured?: boolean;
  title: string;
  description: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  camera,
  onCapture,
  capturing = false,
  captured = false,
  title,
  description,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imgRef.current && camera.streamUrl) {
      console.log(camera.streamUrl);
      imgRef.current.src = camera.streamUrl;
      setStreamActive(true);
    }
  }, [camera.streamUrl]);

  const captureImage = () => {
    // if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || video.offsetWidth;
    canvas.height = video.videoHeight || video.offsetHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image data
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(imageData);
  };

  const captureImageFromImg = () => {
    const img = imgRef.current; // reference to your <img>
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!img || !context) return;

    // Set canvas dimensions to match the image
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    // Draw the current image to the canvas
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image data
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(imageData);
  };

  const handleVideoError = () => {
    setError("Erreur de connexion à la caméra");
    setStreamActive(false);
  };

  const handleVideoLoad = () => {
    setError(null);
    setStreamActive(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="w-5 h-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Info */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${camera.isOnline ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="font-medium">{camera.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">{camera.type}</Badge>
            <Badge variant={camera.isOnline ? "default" : "secondary"}>
              {camera.isOnline ? "En ligne" : "Hors ligne"}
            </Badge>
          </div>
        </div>

        {/* Camera Feed */}
        <div
          className="relative bg-black rounded-lg overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {camera.isOnline ? (
            <>
              {/* <video
                src={camera.streamUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
              /> */}
              <img
                ref={imgRef}
                crossOrigin="anonymous"
                src={camera.streamUrl}
                alt={`Camera ${camera.name}`}
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
                className="w-full h-full object-cover"
              />

              {/* Capture Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                {captured && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Image capturée
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Status */}
              {!streamActive && !error && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Connexion à la caméra...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center">
                    <p className="font-medium">Erreur de connexion</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p>Caméra hors ligne</p>
              </div>
            </div>
          )}
        </div>

        {/* Capture Button */}
        <Button
          onClick={captureImageFromImg}
          disabled={!camera.isOnline || !streamActive || capturing || captured}
          className="w-full bg-boviclouds-primary hover:bg-boviclouds-primary/90"
        >
          {capturing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Capture en cours...
            </>
          ) : captured ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Image capturée
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Capturer l'image
            </>
          )}
        </Button>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
