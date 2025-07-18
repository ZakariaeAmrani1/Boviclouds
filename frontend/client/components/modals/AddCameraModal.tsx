import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateCameraRequest } from "@shared/cctv";
import { Camera, X } from "lucide-react";

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCameraRequest) => Promise<void>;
  isLoading?: boolean;
}

const AddCameraModal: React.FC<AddCameraModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateCameraRequest>({
    name: "",
    zone: "",
    streamUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Camera name is required";
    }

    if (!formData.zone.trim()) {
      newErrors.zone = "Zone is required";
    }

    if (formData.streamUrl && !isValidUrl(formData.streamUrl)) {
      newErrors.streamUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ name: "", zone: "", streamUrl: "" });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Failed to add camera:", error);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", zone: "", streamUrl: "" });
    setErrors({});
    onClose();
  };

  const handleInputChange =
    (field: keyof CreateCameraRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            Ajouter une nouvelle caméra
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter une nouvelle
            caméra au système de surveillance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la caméra <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="ex: Camera 1"
              value={formData.name}
              onChange={handleInputChange("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone">
              Zone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zone"
              placeholder="ex: Main Entrance"
              value={formData.zone}
              onChange={handleInputChange("zone")}
              className={errors.zone ? "border-red-500" : ""}
            />
            {errors.zone && (
              <p className="text-sm text-red-500">{errors.zone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamUrl">URL du flux vidéo (optionnel)</Label>
            <Input
              id="streamUrl"
              placeholder="https://example.com/stream"
              value={formData.streamUrl}
              onChange={handleInputChange("streamUrl")}
              className={errors.streamUrl ? "border-red-500" : ""}
            />
            {errors.streamUrl && (
              <p className="text-sm text-red-500">{errors.streamUrl}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={isLoading}
            >
              {isLoading ? "Ajout..." : "Ajouter la caméra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCameraModal;
