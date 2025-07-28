import { RequestHandler } from "express";
import { User, UsersListResponse } from "@shared/insemination";
import axios from "axios";

// Mock users data for insemination dropdowns
// This would typically come from your user database
let usersData: User[] = [];
// GET /api/utilisateur - Get all users for dropdowns
export const handleGetUsers: RequestHandler = async (req, res) => {
  usersData = [];
  const apiUrl = process.env.SERVER_API_URL;
  try {
    usersData = [];
    const token = req.body.token;
    const data = await axios.get(`${apiUrl}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    usersData = [];
    data.data.map((user) => {
      usersData.push({
        id: user._id,
        nom: user.nom_lat,
        prenom: user.prenom_lat,
        email: user.email,
        role: user.role[0],
      });
    });
    console.log(usersData.length);
    const response: UsersListResponse = {
      success: true,
      data: usersData,
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
    const user = usersData.find((u) => u.id === id);

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
    const users = usersData.filter((u) =>
      u.role.toLowerCase().includes(role.toLowerCase()),
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
