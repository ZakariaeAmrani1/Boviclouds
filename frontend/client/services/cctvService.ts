import {
  Camera,
  CameraListResponse,
  CreateCameraRequest,
  UpdateCameraRequest,
  CameraStats,
  LiveFeedData,
  BehaviorDetection,
  OnlineCamera,
  OnlineCamerasResponse,
  CameraType,
} from "@shared/cctv";
import axios from "axios";

class CCTVService {
  private baseUrl = "/api/cctv";

  async getCameras(page = 1, limit = 10): Promise<CameraListResponse> {
    const response = await fetch(
      `${this.baseUrl}/cameras?page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch cameras");
    }
    return response.json();
  }

  async updateCameraType(index: string, type: string) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL1;
      const response = await axios.put(`${apiUrl}camera/${index}/type`, {
        type: type,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getCamera(id: string): Promise<Camera> {
    const response = await fetch(`${this.baseUrl}/cameras/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch camera");
    }
    return response.json();
  }

  async createCamera(data: CreateCameraRequest): Promise<Camera> {
    const response = await fetch(`${this.baseUrl}/cameras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create camera");
    }
    return response.json();
  }

  async updateCamera(id: string, data: UpdateCameraRequest): Promise<Camera> {
    const response = await fetch(`${this.baseUrl}/cameras/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update camera");
    }
    return response.json();
  }

  async deleteCamera(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/cameras/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete camera");
    }
  }

  async getCameraStats(): Promise<CameraStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch camera stats");
    }
    return response.json();
  }

  async getLiveFeed(cameraId: string): Promise<LiveFeedData> {
    const response = await fetch(`${this.baseUrl}/live/${cameraId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch live feed");
    }
    return response.json();
  }

  async toggleRecording(cameraId: string, isRecording: boolean): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/cameras/${cameraId}/recording`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRecording }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to toggle recording");
    }
  }

  async getBehaviorDetections(
    cameraId?: string,
    behavior?: string,
    limit = 50,
  ): Promise<BehaviorDetection[]> {
    const params = new URLSearchParams();
    if (cameraId) params.append("cameraId", cameraId);
    if (behavior) params.append("behavior", behavior);
    params.append("limit", limit.toString());

    const response = await fetch(`${this.baseUrl}/behaviors?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch behavior detections");
    }
    return response.json();
  }

  async downloadRecording(cameraId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/cameras/${cameraId}/recording/download`,
    );
    if (!response.ok) {
      throw new Error("Failed to download recording");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `camera_${cameraId}_recording_${new Date().toISOString().split("T")[0]}.mp4`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async exportCameraData(
    format: "csv" | "json" | "pdf" = "csv",
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/export?format=${format}`);
    if (!response.ok) {
      throw new Error("Failed to export camera data");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cameras_export_${new Date().toISOString().split("T")[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async getOnlineCameras(): Promise<OnlineCamerasResponse> {
    const response = await fetch(`${this.baseUrl}/online-cameras`);
    if (!response.ok) {
      throw new Error("Failed to fetch online cameras");
    }
    return response.json();
  }

  async assignCameraType(cameraId: string, type: CameraType): Promise<void> {
    const response = await fetch(`${this.baseUrl}/cameras/${cameraId}/type`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });
    if (!response.ok) {
      throw new Error("Failed to assign camera type");
    }
  }

  async refreshCameraList(): Promise<CameraListResponse> {
    // Force a fresh fetch by adding a cache-busting parameter
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${this.baseUrl}/cameras?refresh=${timestamp}`,
    );
    if (!response.ok) {
      throw new Error("Failed to refresh cameras");
    }
    return response.json();
  }

  async validateCameraConnection(
    streamUrl: string,
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/validate-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to validate stream");
      }

      return response.json();
    } catch (error) {
      return {
        isValid: false,
        error: "Unable to validate stream connection",
      };
    }
  }

  // Mock data for demonstration purposes
  async getMockCameras(): Promise<Camera[]> {
    const cameras = [];
    try {
      const apiUrl = import.meta.env.VITE_API_URL1;
      const response = await axios.get(`${apiUrl}cameras`);
      const data = response.data;
      data.map((camera) => {
        cameras.push({
          id: "cam-" + camera.index,
          index: camera.index,
          name: "camera " + camera.index,
          zone: "Main Entrance",
          createdBy: "Achraf",
          status: "active",
          type:
            camera.type === "comportement"
              ? CameraType.BEHAVIOR
              : camera.type === "identification"
                ? CameraType.IDENTIFICATION
                : CameraType.MORPHOLOGY,
          isOnline: true,
          streamUrl: `${apiUrl}video/${camera.index}`,
          webRTCUrl: `${apiUrl}webrtc/${camera.index}`,
          isRecording: true,
          lastActivity: new Date(),
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date(),
        });
      });
      return cameras;
    } catch (error) {
      console.log(error);
    }
  }

  getMockOnlineCameras(): OnlineCamera[] {
    return [
      {
        id: "online-cam-1",
        name: "Network Camera 01",
        isOnline: true,
        ipAddress: "192.168.1.101",
        streamUrl: "rtsp://192.168.1.101:554/stream",
        lastSeen: new Date(),
      },
      {
        id: "online-cam-2",
        name: "Network Camera 02",
        isOnline: true,
        ipAddress: "192.168.1.102",
        streamUrl: "rtsp://192.168.1.102:554/stream",
        lastSeen: new Date(),
      },
      {
        id: "online-cam-3",
        name: "Network Camera 03",
        isOnline: true,
        ipAddress: "192.168.1.103",
        streamUrl: "rtsp://192.168.1.103:554/stream",
        lastSeen: new Date(),
      },
      {
        id: "online-cam-4",
        name: "Network Camera 04",
        isOnline: false,
        ipAddress: "192.168.1.104",
        streamUrl: "rtsp://192.168.1.104:554/stream",
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    ];
  }

  getMockBehaviorDetections(): BehaviorDetection[] {
    return [
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
  }
}

export const cctvService = new CCTVService();
