import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, RotateCcw } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

interface MapPickerProps {
  initialCoordinates?: [number, number];
  onLocationSelect: (coordinates: [number, number]) => void;
  className?: string;
}

const MapPicker: React.FC<MapPickerProps> = ({
  initialCoordinates = [-7.5898, 33.9716], // Default to Rabat, Morocco
  onLocationSelect,
  className = "",
}) => {
  const [coordinates, setCoordinates] = useState<[number, number]>(initialCoordinates);
  const [manualLat, setManualLat] = useState(initialCoordinates[1].toString());
  const [manualLng, setManualLng] = useState(initialCoordinates[0].toString());
  const [isDragging, setIsDragging] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Morocco bounds
  const MOROCCO_BOUNDS = {
    north: 35.92,
    south: 21.42,
    east: -0.99,
    west: -17.2,
  };

  const isInMorocco = (lng: number, lat: number): boolean => {
    return (
      lng >= MOROCCO_BOUNDS.west &&
      lng <= MOROCCO_BOUNDS.east &&
      lat >= MOROCCO_BOUNDS.south &&
      lat <= MOROCCO_BOUNDS.north
    );
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert pixel coordinates to lat/lng
    // This is a simplified conversion for Morocco bounds
    const lng = MOROCCO_BOUNDS.west + (x / rect.width) * (MOROCCO_BOUNDS.east - MOROCCO_BOUNDS.west);
    const lat = MOROCCO_BOUNDS.north - (y / rect.height) * (MOROCCO_BOUNDS.north - MOROCCO_BOUNDS.south);

    if (isInMorocco(lng, lat)) {
      const newCoordinates: [number, number] = [lng, lat];
      setCoordinates(newCoordinates);
      setManualLat(lat.toFixed(6));
      setManualLng(lng.toFixed(6));
      onLocationSelect(newCoordinates);
    }
  };

  const handleManualCoordinatesSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (!isNaN(lat) && !isNaN(lng) && isInMorocco(lng, lat)) {
      const newCoordinates: [number, number] = [lng, lat];
      setCoordinates(newCoordinates);
      onLocationSelect(newCoordinates);
    } else {
      alert("Veuillez entrer des coordonnées valides au Maroc");
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (isInMorocco(lng, lat)) {
            const newCoordinates: [number, number] = [lng, lat];
            setCoordinates(newCoordinates);
            setManualLat(lat.toFixed(6));
            setManualLng(lng.toFixed(6));
            onLocationSelect(newCoordinates);
          } else {
            alert("Votre position actuelle n'est pas au Maroc");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Impossible d'obtenir votre position actuelle");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
    }
  };

  const resetToCenter = () => {
    const center: [number, number] = [-7.5898, 33.9716]; // Rabat
    setCoordinates(center);
    setManualLat(center[1].toString());
    setManualLng(center[0].toString());
    onLocationSelect(center);
  };

  // Calculate marker position on the map
  const getMarkerPosition = () => {
    const [lng, lat] = coordinates;
    const x = ((lng - MOROCCO_BOUNDS.west) / (MOROCCO_BOUNDS.east - MOROCCO_BOUNDS.west)) * 100;
    const y = ((MOROCCO_BOUNDS.north - lat) / (MOROCCO_BOUNDS.north - MOROCCO_BOUNDS.south)) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const markerPosition = getMarkerPosition();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sélectionner la localisation sur la carte</Label>
        <p className="text-xs text-gray-600">
          Cliquez sur la carte pour sélectionner l'emplacement de votre exploitation au Maroc
        </p>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="relative w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-gray-300 rounded-lg cursor-crosshair overflow-hidden"
          onClick={handleMapClick}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        >
          {/* Morocco Outline Simplified */}
          <div className="absolute inset-2 bg-gradient-to-br from-amber-50 to-green-50 rounded border border-amber-200">
            {/* Geographic features representation */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-blue-200 rounded-full opacity-50" title="Tanger" />
            <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-blue-300 rounded-full opacity-50" title="Rabat" />
            <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-red-200 rounded-full opacity-50" title="Casablanca" />
            <div className="absolute bottom-1/3 left-1/2 w-6 h-6 bg-orange-200 rounded-full opacity-50" title="Marrakech" />
            <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-green-300 rounded-full opacity-50" title="Fès" />
          </div>

          {/* Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: markerPosition.x, top: markerPosition.y }}
          >
            <div className="relative">
              <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg" fill="currentColor" />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full opacity-30 animate-pulse" />
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-mono">
            {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={getCurrentLocation}
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
            title="Ma position"
          >
            <Navigation className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={resetToCenter}
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
            title="Centrer sur Rabat"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Manual Coordinates Input */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Ou saisir les coordonnées manuellement</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="latitude" className="text-xs text-gray-600">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="33.971590"
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="longitude" className="text-xs text-gray-600">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="-7.589843"
              className="text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleManualCoordinatesSubmit}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Appliquer
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Format: Latitude (21.42 à 35.92), Longitude (-17.2 à -0.99)
        </p>
      </div>

      {/* Selected Location Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Position sélectionnée</span>
        </div>
        <div className="text-sm text-green-700">
          <div>Latitude: {coordinates[1].toFixed(6)}</div>
          <div>Longitude: {coordinates[0].toFixed(6)}</div>
          <div className="text-xs mt-1 text-green-600">
            {isInMorocco(coordinates[0], coordinates[1]) 
              ? "✓ Position valide au Maroc" 
              : "⚠ Position en dehors du Maroc"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
