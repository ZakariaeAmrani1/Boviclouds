export enum CameraType {
  BEHAVIOR = "Caméra de comportement",
  IDENTIFICATION = "Caméra d'identification",
  MORPHOLOGY = "Caméra de morphologie"
}

export interface Camera {
  id: string;
  name: string;
  zone: string;
  createdBy: string;
  status: "active" | "inactive" | "maintenance";
  type?: CameraType;
  isOnline: boolean;
  streamUrl?: string;
  isRecording: boolean;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CameraListResponse {
  cameras: Camera[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCameraRequest {
  name: string;
  zone: string;
  type?: CameraType;
  streamUrl?: string;
}

export interface UpdateCameraRequest {
  name?: string;
  zone?: string;
  type?: CameraType;
  status?: "active" | "inactive" | "maintenance";
  streamUrl?: string;
  isRecording?: boolean;
}

export interface CameraStats {
  total: number;
  active: number;
  inactive: number;
  recording: number;
}

export interface BehaviorDetection {
  id: string;
  cameraId: string;
  behavior: "standing" | "eating" | "sleeping" | "moving";
  confidence: number;
  detectedAt: Date;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface LiveFeedData {
  cameraId: string;
  streamUrl: string;
  behaviors: BehaviorDetection[];
  lastUpdate: Date;
}

export const CAMERA_STATUS_COLORS = {
  active: "#21DB69",
  inactive: "#6B7280",
  maintenance: "#F97316",
} as const;

export const BEHAVIOR_COLORS = {
  standing: "#21DB69",
  eating: "#F97316",
  sleeping: "#3D42DF",
  moving: "#8B5CF6",
} as const;
