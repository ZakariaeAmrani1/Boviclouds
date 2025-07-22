import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, UpdateCameraRequest } from "@shared/cctv";
import { Edit } from "lucide-react";

interface EditCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateCameraRequest) => Promise<void>;
  camera: Camera | null;
  isLoading?: boolean;
}

const EditCameraModal: React.FC<EditCameraModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  camera,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateCameraRequest>({
    name: "",
    zone: "",
    status: "active",
    streamUrl: "",
    isRecording: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name,
        zone: camera.zone,
        status: camera.status,
        streamUrl: camera.streamUrl || "",
        isRecording: camera.isRecording,
      });
    }
  }, [camera]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Camera name is required";
    }

    if (!formData.zone?.trim()) {
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

    if (!camera || !validateForm()) {
      return;
    }

    try {
      await onSubmit(camera.id, formData);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Failed to update camera:", error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange =
    (field: keyof UpdateCameraRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    };

  const handleSelectChange =
    (field: keyof UpdateCameraRequest) => (value: string) => {
      setFormData({ ...formData, [field]: value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    };

  const handleCheckboxChange =
    (field: keyof UpdateCameraRequest) => (checked: boolean) => {
      setFormData({ ...formData, [field]: checked });
    };

  if (!camera) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-emerald-600" />
            Modifier la caméra
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de la caméra "{camera.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nom de la caméra <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
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
            <Label htmlFor="edit-zone">
              Zone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-zone"
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
            <Label htmlFor="edit-status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={handleSelectChange("status")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-streamUrl">URL du flux vidéo</Label>
            <Input
              id="edit-streamUrl"
              placeholder="https://example.com/stream"
              value={formData.streamUrl}
              onChange={handleInputChange("streamUrl")}
              className={errors.streamUrl ? "border-red-500" : ""}
            />
            {errors.streamUrl && (
              <p className="text-sm text-red-500">{errors.streamUrl}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-recording"
              checked={formData.isRecording}
              onChange={(e) =>
                handleCheckboxChange("isRecording")(e.target.checked)
              }
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <Label htmlFor="edit-recording" className="text-sm font-medium">
              Enregistrement activé
            </Label>
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
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCameraModal;
