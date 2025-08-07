import { useState, useEffect } from "react";
import { ExploitationService } from "../services/exploitationService";
import { UtilisateurService } from "../services/utilisateurService";
import { ExploitationRecord } from "@shared/exploitation";
import { UtilisateurRecord, UtilisateurRole } from "@shared/utilisateur";

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

export const useExploitations = () => {
  const [exploitations, setExploitations] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExploitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ExploitationService.getAll({}, { page: 1, limit: 100 });
      const options: Option[] = response.data.map((exploitation: ExploitationRecord) => ({
        value: exploitation.id,
        label: exploitation.nom,
        sublabel: `${exploitation.localisation} - ${exploitation.type_exploitation}`,
      }));
      setExploitations(options);
    } catch (err) {
      setError("Erreur lors du chargement des exploitations");
      console.error("Error fetching exploitations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploitations();
  }, []);

  return { exploitations, loading, error, refresh: fetchExploitations };
};

export const useEleveurs = () => {
  const [eleveurs, setEleveurs] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEleveurs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Filter for users with ELEVEUR role
      const response = await UtilisateurService.getAll({}, { page: 1, limit: 100 });
      const options: Option[] = response.data
        .filter((user: UtilisateurRecord) => user.role === UtilisateurRole.ELEVEUR || user.role === UtilisateurRole.ADMIN)
        .map((user: UtilisateurRecord) => ({
          value: user.id,
          label: `${user.prenom} ${user.nom}`,
          sublabel: user.email || user.telephone,
        }));
      setEleveurs(options);
    } catch (err) {
      setError("Erreur lors du chargement des éleveurs");
      console.error("Error fetching eleveurs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEleveurs();
  }, []);

  return { eleveurs, loading, error, refresh: fetchEleveurs };
};

export const useResponsablesLocaux = () => {
  const [responsables, setResponsables] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResponsables = async () => {
    setLoading(true);
    setError(null);
    try {
      // Filter for users with RESPONSABLE_LOCAL role
      const response = await UtilisateurService.getAll({}, { page: 1, limit: 100 });
      const options: Option[] = response.data
        .filter((user: UtilisateurRecord) => 
          user.role === UtilisateurRole.RESPONSABLE_LOCAL || 
          user.role === UtilisateurRole.ADMIN
        )
        .map((user: UtilisateurRecord) => ({
          value: user.id,
          label: `${user.prenom} ${user.nom}`,
          sublabel: user.email || user.telephone,
        }));
      setResponsables(options);
    } catch (err) {
      setError("Erreur lors du chargement des responsables locaux");
      console.error("Error fetching responsables locaux:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponsables();
  }, []);

  return { responsables, loading, error, refresh: fetchResponsables };
};
