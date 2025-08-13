import express from "express";
import cors from "cors";
import multer from "multer";
import { handleDemo } from "./routes/demo";
import dotenv from "dotenv";
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
  getOnlineCameras,
  assignCameraType,
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
  getIdentificationsforLactation,
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
import {
  handleGetSemences,
  handleGetSemence,
  handleCreateSemence,
  handleUpdateSemence,
  handleDeleteSemence,
  handleGetSemenceStats,
  handleExportSemences,
} from "./routes/semence";
import {
  handleGetLactations,
  handleGetLactation,
  handleCreateLactation,
  handleUpdateLactation,
  handleDeleteLactation,
  handleGetLactationStats,
  handleExportLactations,
} from "./routes/lactation";
import {
  handleGetUsers,
  handleGetUser,
  handleGetUsersByRole,
} from "./routes/utilisateur";
import {
  getExploitations,
  getExploitationById,
  createExploitation,
  updateExploitation,
  deleteExploitation,
  getExploitationStats,
  exportExploitations,
} from "./routes/exploitation";
import {
  handleGetRebouclages,
  handleGetRebouclage,
  handleCreateRebouclage,
  handleCreateRebouclageAutomatic,
  handleUpdateRebouclage,
  handleDeleteRebouclage,
  handleExportRebouclages,
  handleGetRebouclageStats,
  handleExtractNNI,
} from "./routes/rebouclage";
import { getCowDetails } from "./routes/cow-details";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

export function createServer() {
  const app = express();
  dotenv.config();

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
  app.get("/api/identifications", getIdentificationsforLactation);
  app.post("/api/identification", upload.array('images', 5), createIdentification);
  app.put("/api/identification/:id", upload.array('images', 5), updateIdentification);
  app.delete("/api/identification/:id", deleteIdentification);
  app.get("/api/identification/:id/details", getCowDetails);

  // Insemination API routes
  app.get("/api/insemination/stats", handleGetInseminationStats);
  app.get("/api/insemination/export", handleExportInseminations);
  app.get("/api/insemination/:id", handleGetInsemination);
  app.get("/api/insemination", handleGetInseminations);
  app.post("/api/insemination", handleCreateInsemination);
  app.put("/api/insemination/:id", handleUpdateInsemination);
  app.delete("/api/insemination/:id", handleDeleteInsemination);

  // Semence API routes
  app.get("/api/semence/stats", handleGetSemenceStats);
  app.get("/api/semence/export", handleExportSemences);
  app.get("/api/semence/:id", handleGetSemence);
  app.get("/api/semence", handleGetSemences);
  app.post("/api/semence", handleCreateSemence);
  app.put("/api/semence/:id", handleUpdateSemence);
  app.delete("/api/semence/:id", handleDeleteSemence);

  // Lactation API routes
  app.get("/api/lactation/stats", handleGetLactationStats);
  app.get("/api/lactation/export", handleExportLactations);
  app.get("/api/lactation/:id", handleGetLactation);
  app.get("/api/lactation", handleGetLactations);
  app.post("/api/lactation", handleCreateLactation);
  app.put("/api/lactation/:id", handleUpdateLactation);
  app.delete("/api/lactation/:id", handleDeleteLactation);

  // Utilisateur API routes
  app.get("/api/utilisateur/role/:role", handleGetUsersByRole);
  app.get("/api/utilisateur/:id", handleGetUser);
  app.post("/api/utilisateur", handleGetUsers);

  // Exploitation API routes
  app.get("/api/exploitation/stats", getExploitationStats);
  app.get("/api/exploitation/export", exportExploitations);
  app.get("/api/exploitation/:id", getExploitationById);
  app.get("/api/exploitation", getExploitations);
  app.post("/api/exploitation", createExploitation);
  app.put("/api/exploitation/:id", updateExploitation);
  app.delete("/api/exploitation/:id", deleteExploitation);

  // Rebouclage API routes
  app.get("/api/rebouclage/stats", handleGetRebouclageStats);
  app.get("/api/rebouclage/export", handleExportRebouclages);
  app.get("/api/rebouclage/:id", handleGetRebouclage);
  app.get("/api/rebouclage", handleGetRebouclages);
  app.post("/api/rebouclage", handleCreateRebouclage);
  app.post("/api/rebouclage/automatic", upload.single('image'), handleCreateRebouclageAutomatic);
  app.post("/api/rebouclage/extract-nni", upload.single('image'), handleExtractNNI);
  app.put("/api/rebouclage/:id", handleUpdateRebouclage);
  app.delete("/api/rebouclage/:id", handleDeleteRebouclage);

  return app;
}
