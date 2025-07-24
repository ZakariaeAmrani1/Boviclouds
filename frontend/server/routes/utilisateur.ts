import { RequestHandler } from "express";
import { User, UsersListResponse } from "@shared/insemination";

// Mock users data for insemination dropdowns
// This would typically come from your user database
const mockUsers: User[] = [
  {
    id: "user1",
    nom: "Dubois",
    prenom: "Jean",
    email: "jean.dubois@boviclouds.com",
    role: "Inséminateur",
  },
  {
    id: "user2",
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin@boviclouds.com",
    role: "Responsable Local",
  },
  {
    id: "user3",
    nom: "Leroy",
    prenom: "Pierre",
    email: "pierre.leroy@boviclouds.com",
    role: "Inséminateur",
  },
  {
    id: "user4",
    nom: "Dupont",
    prenom: "Sophie",
    email: "sophie.dupont@boviclouds.com",
    role: "Responsable Local",
  },
  {
    id: "user5",
    nom: "Bernard",
    prenom: "Paul",
    email: "paul.bernard@boviclouds.com",
    role: "Vétérinaire",
  },
  {
    id: "user6",
    nom: "Moreau",
    prenom: "Claire",
    email: "claire.moreau@boviclouds.com",
    role: "Technicien",
  },
  {
    id: "user7",
    nom: "Robert",
    prenom: "Michel",
    email: "michel.robert@boviclouds.com",
    role: "Inséminateur",
  },
  {
    id: "user8",
    nom: "Petit",
    prenom: "Anne",
    email: "anne.petit@boviclouds.com",
    role: "Responsable Local",
  },
];

// GET /api/utilisateur - Get all users for dropdowns
export const handleGetUsers: RequestHandler = (req, res) => {
  try {
    const response: UsersListResponse = {
      success: true,
      data: mockUsers,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
};

// GET /api/utilisateur/:id - Get a single user by ID
export const handleGetUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
    });
  }
};

// GET /api/utilisateur/role/:role - Get users by role
export const handleGetUsersByRole: RequestHandler = (req, res) => {
  try {
    const { role } = req.params;
    const users = mockUsers.filter(u => 
      u.role.toLowerCase().includes(role.toLowerCase())
    );

    const response: UsersListResponse = {
      success: true,
      data: users,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting users by role:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs par rôle",
    });
  }
};
