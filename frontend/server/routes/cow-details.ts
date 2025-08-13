import { RequestHandler } from "express";
import { DetailedCowResponse } from "@shared/cow-details";

// Mock detailed cow data for demonstration
const mockDetailedCowData = {
  _id: "640a1b5c8f1e2a3b4c5d6e7f",
  infos_sujet: {
    nni: "FR1234567890",
    date_naissance: "2021-03-15",
    race: "Holstein",
    sexe: "Femelle",
    photos: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    type: "Bovin"
  },
  infos_mere: {
    nni: "FR0987654321",
    date_naissance: "2018-05-20",
    race: "Holstein"
  },
  grand_pere_maternel: {
    nni: "FR1111222233",
    nom: "Grand-père Maternel",
    date_naissance: "2015-08-10",
    race: "Holstein"
  },
  pere: {
    nni: "FR4444555566",
    nom: "Père Exemple",
    date_naissance: "2017-12-03",
    race: "Holstein"
  },
  grand_pere_paternel: {
    nni: "FR7777888899",
    nom: "Grand-père Paternel",
    date_naissance: "2014-09-25",
    race: "Holstein"
  },
  grand_mere_paternelle: {
    nni: "FR0000111122",
    date_naissance: "2016-07-18",
    race: "Holstein"
  },
  complem: {
    eleveur_id: "eleveur_001",
    exploitation_id: "exploitation_001",
    responsable_local_id: "responsable_001"
  },
  detections_morphologiques: [
    {
      _id: "detection_001",
      timestamp: "2021-04-15T10:30:00Z",
      image_url: "/placeholder.svg",
      source_detection: "Caméra automatique",
      donnees_morphologiques: {
        hauteur_au_garrot: {
          valeur: 95,
          unite: "cm",
          confiance: 0.89,
          etat: "stable",
          notes: "Première mesure"
        },
        largeur_du_corps: {
          valeur: 45,
          unite: "cm",
          confiance: 0.85,
          etat: "stable",
          notes: "Première mesure"
        },
        longueur_du_corps: {
          valeur: 120,
          unite: "cm",
          confiance: 0.91,
          etat: "stable",
          notes: "Première mesure"
        }
      }
    },
    {
      _id: "detection_002",
      timestamp: "2021-08-20T14:45:00Z",
      image_url: "/placeholder.svg",
      source_detection: "Mesure manuelle",
      donnees_morphologiques: {
        hauteur_au_garrot: {
          valeur: 102,
          unite: "cm",
          confiance: 0.95,
          etat: "croissance",
          notes: "Croissance normale"
        },
        largeur_du_corps: {
          valeur: 48,
          unite: "cm",
          confiance: 0.92,
          etat: "croissance",
          notes: "Croissance normale"
        },
        longueur_du_corps: {
          valeur: 128,
          unite: "cm",
          confiance: 0.94,
          etat: "croissance",
          notes: "Croissance normale"
        }
      }
    },
    {
      _id: "detection_003",
      timestamp: "2022-01-10T09:15:00Z",
      image_url: "/placeholder.svg",
      source_detection: "Caméra automatique",
      donnees_morphologiques: {
        hauteur_au_garrot: {
          valeur: 108,
          unite: "cm",
          confiance: 0.87,
          etat: "mature",
          notes: "Taille adulte atteinte"
        },
        largeur_du_corps: {
          valeur: 52,
          unite: "cm",
          confiance: 0.89,
          etat: "mature",
          notes: "Développement complet"
        },
        longueur_du_corps: {
          valeur: 135,
          unite: "cm",
          confiance: 0.93,
          etat: "mature",
          notes: "Morphologie adulte"
        }
      }
    },
    {
      _id: "detection_004",
      timestamp: "2022-07-25T16:20:00Z",
      image_url: "/placeholder.svg",
      source_detection: "Inspection vétérinaire",
      donnees_morphologiques: {
        hauteur_au_garrot: {
          valeur: 112,
          unite: "cm",
          confiance: 0.98,
          etat: "stable",
          notes: "Mesure de contrôle"
        },
        largeur_du_corps: {
          valeur: 54,
          unite: "cm",
          confiance: 0.96,
          etat: "stable",
          notes: "Bon développement"
        },
        longueur_du_corps: {
          valeur: 138,
          unite: "cm",
          confiance: 0.97,
          etat: "stable",
          notes: "Excellent état général"
        }
      }
    },
    {
      _id: "detection_005",
      timestamp: "2023-03-12T11:30:00Z",
      image_url: "/placeholder.svg",
      source_detection: "Caméra automatique",
      donnees_morphologiques: {
        hauteur_au_garrot: {
          valeur: 115,
          unite: "cm",
          confiance: 0.91,
          etat: "stable",
          notes: "Dernière mesure"
        },
        largeur_du_corps: {
          valeur: 56,
          unite: "cm",
          confiance: 0.88,
          etat: "stable",
          notes: "Maintien de la forme"
        },
        longueur_du_corps: {
          valeur: 142,
          unite: "cm",
          confiance: 0.95,
          etat: "stable",
          notes: "Stabilité morphologique"
        }
      }
    }
  ]
};

export const getCowDetails: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // In a real implementation, you would fetch from the database:
    // const cowDetails = await CowModel.findById(id).populate('detections_morphologiques');
    
    // For now, return mock data if the ID matches
    if (id && id.length > 0) {
      const response: DetailedCowResponse = {
        success: true,
        data: {
          ...mockDetailedCowData,
          _id: id
        }
      };
      
      res.json(response);
    } else {
      res.status(404).json({
        success: false,
        message: "Animal non trouvé"
      });
    }
  } catch (error) {
    console.error("Error fetching cow details:", error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur"
    });
  }
};
