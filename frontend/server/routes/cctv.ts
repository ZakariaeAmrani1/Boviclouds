import { RequestHandler } from "express";
import {
  Camera,
  CameraListResponse,
  CreateCameraRequest,
  UpdateCameraRequest,
  CameraStats,
  BehaviorDetection,
} from "@shared/cctv";

// Mock database - in a real app, this would be a proper database
let cameras: Camera[] = [
  {
    id: "cam-1",
    name: "camera 1",
    zone: "Main Entrance",
    createdBy: "Achraf",
    status: "active",
    type: "Caméra de comportement" as any,
    isOnline: true,
    streamUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/e3d5926eba868b25fa3539c0743b7826f1625545?width=1398",
    isRecording: true,
    lastActivity: new Date(),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: "cam-2",
    name: "camera 2",
    zone: "Back Door",
    createdBy: "Achraf",
    status: "active",
    type: "Caméra d'identification" as any,
    isOnline: true,
    streamUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/0a30a7645d8b7271df6e3b207b010180a52317c9?width=658",
    isRecording: true,
    lastActivity: new Date(),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
  },
  {
    id: "cam-3",
    name: "camera 3",
    zone: "Eating Place",
    createdBy: "Achraf",
    status: "active",
    type: "Caméra de morphologie" as any,
    isOnline: false,
    streamUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/76353da281306292cb39952a5d6ab02c4bedf82b?width=658",
    isRecording: true,
    lastActivity: new Date(),
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date(),
  },
];

let behaviorDetections: BehaviorDetection[] = [
  {
    id: "behavior-1",
    cameraId: "cam-1",
    behavior: "standing",
    confidence: 0.95,
    detectedAt: new Date(),
    boundingBox: { x: 399, y: 264, width: 71, height: 133 },
  },
  {
    id: "behavior-2",
    cameraId: "cam-1",
    behavior: "eating",
    confidence: 0.87,
    detectedAt: new Date(),
    boundingBox: { x: 525, y: 264, width: 67, height: 133 },
  },
  {
    id: "behavior-3",
    cameraId: "cam-1",
    behavior: "sleeping",
    confidence: 0.92,
    detectedAt: new Date(),
    boundingBox: { x: 751, y: 342, width: 193, height: 84 },
  },
];

// Get all cameras with pagination
export const getCameras: RequestHandler = (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCameras = cameras.slice(startIndex, endIndex);

    const response: CameraListResponse = {
      cameras: paginatedCameras,
      total: cameras.length,
      page,
      limit,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching cameras:", error);
    res.status(500).json({ error: "Failed to fetch cameras" });
  }
};

// Get single camera by ID
export const getCamera: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const camera = cameras.find((c) => c.id === id);

    if (!camera) {
      return res.status(404).json({ error: "Camera not found" });
    }

    res.json(camera);
  } catch (error) {
    console.error("Error fetching camera:", error);
    res.status(500).json({ error: "Failed to fetch camera" });
  }
};

// Create new camera
export const createCamera: RequestHandler = (req, res) => {
  try {
    const data: CreateCameraRequest = req.body;

    if (!data.name || !data.zone) {
      return res
        .status(400)
        .json({ error: "Name and zone are required fields" });
    }

    const newCamera: Camera = {
      id: `cam-${Date.now()}`,
      name: data.name,
      zone: data.zone,
      createdBy: "System", // In a real app, this would come from authentication
      status: "active",
      type: data.type,
      isOnline: true,
      streamUrl: data.streamUrl,
      isRecording: false,
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    cameras.push(newCamera);
    res.status(201).json(newCamera);
  } catch (error) {
    console.error("Error creating camera:", error);
    res.status(500).json({ error: "Failed to create camera" });
  }
};

// Update camera
export const updateCamera: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const data: UpdateCameraRequest = req.body;

    const cameraIndex = cameras.findIndex((c) => c.id === id);
    if (cameraIndex === -1) {
      return res.status(404).json({ error: "Camera not found" });
    }

    const updatedCamera: Camera = {
      ...cameras[cameraIndex],
      ...data,
      updatedAt: new Date(),
    };

    cameras[cameraIndex] = updatedCamera;
    res.json(updatedCamera);
  } catch (error) {
    console.error("Error updating camera:", error);
    res.status(500).json({ error: "Failed to update camera" });
  }
};

// Delete camera
export const deleteCamera: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const cameraIndex = cameras.findIndex((c) => c.id === id);

    if (cameraIndex === -1) {
      return res.status(404).json({ error: "Camera not found" });
    }

    cameras.splice(cameraIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting camera:", error);
    res.status(500).json({ error: "Failed to delete camera" });
  }
};

// Get camera statistics
export const getCameraStats: RequestHandler = (req, res) => {
  try {
    const stats: CameraStats = {
      total: cameras.length,
      active: cameras.filter((c) => c.status === "active").length,
      inactive: cameras.filter((c) => c.status === "inactive").length,
      recording: cameras.filter((c) => c.isRecording).length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching camera stats:", error);
    res.status(500).json({ error: "Failed to fetch camera stats" });
  }
};

// Get live feed data for a camera
export const getLiveFeed: RequestHandler = (req, res) => {
  try {
    const { cameraId } = req.params;
    const camera = cameras.find((c) => c.id === cameraId);

    if (!camera) {
      return res.status(404).json({ error: "Camera not found" });
    }

    const behaviors = behaviorDetections.filter((b) => b.cameraId === cameraId);

    const liveFeedData = {
      cameraId,
      streamUrl: camera.streamUrl || "",
      behaviors,
      lastUpdate: new Date(),
    };

    res.json(liveFeedData);
  } catch (error) {
    console.error("Error fetching live feed:", error);
    res.status(500).json({ error: "Failed to fetch live feed" });
  }
};

// Toggle camera recording
export const toggleRecording: RequestHandler = (req, res) => {
  try {
    const { cameraId } = req.params;
    const { isRecording } = req.body;

    const cameraIndex = cameras.findIndex((c) => c.id === cameraId);
    if (cameraIndex === -1) {
      return res.status(404).json({ error: "Camera not found" });
    }

    cameras[cameraIndex].isRecording = isRecording;
    cameras[cameraIndex].updatedAt = new Date();

    res.json({ success: true, isRecording });
  } catch (error) {
    console.error("Error toggling recording:", error);
    res.status(500).json({ error: "Failed to toggle recording" });
  }
};

// Get behavior detections
export const getBehaviorDetections: RequestHandler = (req, res) => {
  try {
    const { cameraId, behavior } = req.query;
    const limit = parseInt(req.query.limit as string) || 50;

    let filteredBehaviors = behaviorDetections;

    if (cameraId) {
      filteredBehaviors = filteredBehaviors.filter(
        (b) => b.cameraId === cameraId,
      );
    }

    if (behavior) {
      filteredBehaviors = filteredBehaviors.filter(
        (b) => b.behavior === behavior,
      );
    }

    const limitedBehaviors = filteredBehaviors.slice(0, limit);
    res.json(limitedBehaviors);
  } catch (error) {
    console.error("Error fetching behavior detections:", error);
    res.status(500).json({ error: "Failed to fetch behavior detections" });
  }
};

// Get online cameras (network discovery simulation)
export const getOnlineCameras: RequestHandler = (req, res) => {
  try {
    // Simulate network camera discovery
    const mockOnlineCameras = [
      {
        id: "network-cam-1",
        name: "IP Camera 192.168.1.101",
        isOnline: true,
        ipAddress: "192.168.1.101",
        streamUrl: "rtsp://192.168.1.101:554/stream1",
        lastSeen: new Date(),
      },
      {
        id: "network-cam-2",
        name: "IP Camera 192.168.1.102",
        isOnline: true,
        ipAddress: "192.168.1.102",
        streamUrl: "rtsp://192.168.1.102:554/stream1",
        lastSeen: new Date(),
      },
      {
        id: "network-cam-3",
        name: "IP Camera 192.168.1.103",
        isOnline: true,
        ipAddress: "192.168.1.103",
        streamUrl: "rtsp://192.168.1.103:554/stream1",
        lastSeen: new Date(),
      },
      {
        id: "network-cam-4",
        name: "IP Camera 192.168.1.104",
        isOnline: false,
        ipAddress: "192.168.1.104",
        streamUrl: "rtsp://192.168.1.104:554/stream1",
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    ];

    const response = {
      cameras: mockOnlineCameras,
      total: mockOnlineCameras.length,
      lastRefresh: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching online cameras:", error);
    res.status(500).json({ error: "Failed to fetch online cameras" });
  }
};

// Assign camera type
export const assignCameraType: RequestHandler = (req, res) => {
  try {
    const { cameraId } = req.params;
    const { type } = req.body;

    // Validate camera type
    const validTypes = ["Caméra de comportement", "Caméra d'identification", "Caméra de morphologie"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: "Type de caméra invalide",
        validTypes,
      });
    }

    // Find and update camera
    const cameraIndex = cameras.findIndex((c) => c.id === cameraId);
    if (cameraIndex === -1) {
      return res.status(404).json({ error: "Camera not found" });
    }

    cameras[cameraIndex].type = type as any;
    cameras[cameraIndex].updatedAt = new Date();

    res.json({
      success: true,
      message: "Type de caméra assigné avec succès",
      cameraId,
      type,
      camera: cameras[cameraIndex],
    });
  } catch (error) {
    console.error("Error assigning camera type:", error);
    res.status(500).json({ error: "Failed to assign camera type" });
  }
};
