import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getCameras,
  getCamera,
  createCamera,
  updateCamera,
  deleteCamera,
  getCameraStats,
  getLiveFeed,
  toggleRecording,
  getBehaviorDetections,
} from "./routes/cctv";
import { getHealth } from "./routes/health";
import { getDocuments, getDocument } from "./routes/documents";
import {
  getCurrentProfile,
  updateProfile,
  updatePreferences,
  updateSecurity,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  getActivityLog,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  downloadProfileData,
  deleteAccount,
} from "./routes/profile";
import {
  getSujets,
  getSujet,
  createSujet,
  updateSujet,
  deleteSujet,
  getTraitementStats,
  exportSujetsData,
} from "./routes/traitement";
import {
  getIdentifications,
  getIdentification,
  createIdentification,
  updateIdentification,
  deleteIdentification,
  getIdentificationStats,
} from "./routes/identification";
import {
  handleGetInseminations,
  handleGetInsemination,
  handleCreateInsemination,
  handleUpdateInsemination,
  handleDeleteInsemination,
  handleGetInseminationStats,
  handleExportInseminations,
} from "./routes/insemination";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Health check route
  app.get("/api/health", getHealth);
  app.get("/health", getHealth); // Support both /health and /api/health

  // Documents API routes
  app.get("/api/documents", getDocuments);
  app.get("/api/documents/:id", getDocument);
  app.get("/documents", getDocuments); // Support both /documents and /api/documents

  // Profile API routes
  app.get("/api/profile/me", getCurrentProfile);
  app.put("/api/profile/me", updateProfile);
  app.put("/api/profile/me/preferences", updatePreferences);
  app.put("/api/profile/me/security", updateSecurity);
  app.put("/api/profile/me/password", changePassword);
  app.post("/api/profile/me/avatar", uploadAvatar);
  app.delete("/api/profile/me/avatar", deleteAvatar);
  app.get("/api/profile/me/activity", getActivityLog);
  app.post("/api/profile/me/2fa/enable", enableTwoFactor);
  app.post("/api/profile/me/2fa/verify", verifyTwoFactor);
  app.post("/api/profile/me/2fa/disable", disableTwoFactor);
  app.get("/api/profile/me/download", downloadProfileData);
  app.delete("/api/profile/me", deleteAccount);

  // CCTV API routes
  app.get("/api/cctv/cameras", getCameras);
  app.get("/api/cctv/cameras/:id", getCamera);
  app.post("/api/cctv/cameras", createCamera);
  app.put("/api/cctv/cameras/:id", updateCamera);
  app.delete("/api/cctv/cameras/:id", deleteCamera);
  app.get("/api/cctv/stats", getCameraStats);
  app.get("/api/cctv/live/:cameraId", getLiveFeed);
  app.put("/api/cctv/cameras/:cameraId/recording", toggleRecording);
  app.get("/api/cctv/behaviors", getBehaviorDetections);

  // Traitement API routes
  app.get("/api/traitement/sujets", getSujets);
  app.get("/api/traitement/sujets/:id", getSujet);
  app.post("/api/traitement/sujets", createSujet);
  app.put("/api/traitement/sujets/:id", updateSujet);
  app.delete("/api/traitement/sujets/:id", deleteSujet);
  app.get("/api/traitement/stats", getTraitementStats);
  app.get("/api/traitement/export", exportSujetsData);

  // Identification API routes
  app.get("/api/identification/stats", getIdentificationStats);
  app.get("/api/identification/:id", getIdentification);
  app.get("/api/identification", getIdentifications);
  app.post("/api/identification", createIdentification);
  app.put("/api/identification/:id", updateIdentification);
  app.delete("/api/identification/:id", deleteIdentification);

  return app;
}
