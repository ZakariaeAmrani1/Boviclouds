export interface Sujet {
  id: string;
  nniSujet: string;
  doc: string;
  dateNaissance: string;
  race: string;
  sexe: string;
  type: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tabType: TraitementTab;
}

export interface InseminationRecord {
  id: string;
  nniSujet: string;
  taureau: string;
  dateInsemination: string;
  veterinaire: string;
  methode: string;
  statut: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tabType: TraitementTab;
}

export interface LactationRecord {
  id: string;
  nniSujet: string;
  dateDemarrage: string;
  productionJournaliere: number;
  qualiteLait: string;
  periode: string;
  statut: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tabType: TraitementTab;
}

export interface TraitementListResponse {
  sujets: Sujet[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSujetRequest {
  nniSujet: string;
  doc: string;
  dateNaissance: string;
  race: string;
  sexe: string;
  type: string;
  tabType: TraitementTab;
}

export interface UpdateSujetRequest {
  nniSujet?: string;
  doc?: string;
  dateNaissance?: string;
  race?: string;
  sexe?: string;
  type?: string;
}

export interface CreateInseminationRequest {
  nniSujet: string;
  taureau: string;
  dateInsemination: string;
  veterinaire: string;
  methode: string;
  statut: string;
}

export interface UpdateInseminationRequest {
  nniSujet?: string;
  taureau?: string;
  dateInsemination?: string;
  veterinaire?: string;
  methode?: string;
  statut?: string;
}

export interface CreateLactationRequest {
  nniSujet: string;
  dateDemarrage: string;
  productionJournaliere: number;
  qualiteLait: string;
  periode: string;
  statut: string;
}

export interface UpdateLactationRequest {
  nniSujet?: string;
  dateDemarrage?: string;
  productionJournaliere?: number;
  qualiteLait?: string;
  periode?: string;
  statut?: string;
}

export interface TraitementStats {
  total: number;
  identification: number;
  insemination: number;
  lactation: number;
}

export interface TraitementFilter {
  search?: string;
  race?: string;
  sexe?: string;
  type?: string;
  dateNaissanceFrom?: string;
  dateNaissanceTo?: string;
}

export type TraitementTab = "identification" | "insemination" | "lactation";

export const TRAITEMENT_TABS: { id: TraitementTab; label: string }[] = [
  { id: "identification", label: "Identification" },
  { id: "insemination", label: "Insemination" },
  { id: "lactation", label: "Lactation" },
];

export const SEXE_OPTIONS = [
  { value: "male", label: "Mâle" },
  { value: "female", label: "Femelle" },
] as const;

export const RACE_OPTIONS = [
  { value: "holstein", label: "Holstein" },
  { value: "montbeliarde", label: "Montbéliarde" },
  { value: "normande", label: "Normande" },
  { value: "limousine", label: "Limousine" },
  { value: "charolaise", label: "Charolaise" },
] as const;

export const TYPE_OPTIONS = [
  { value: "vache", label: "Vache" },
  { value: "taureau", label: "Taureau" },
  { value: "veau", label: "Veau" },
  { value: "genisse", label: "Génisse" },
] as const;

export const METHODE_INSEMINATION_OPTIONS = [
  { value: "artificielle", label: "Artificielle" },
  { value: "naturelle", label: "Naturelle" },
  { value: "transfert_embryon", label: "Transfert d'embryon" },
] as const;

export const STATUT_INSEMINATION_OPTIONS = [
  { value: "en_cours", label: "En cours" },
  { value: "reussi", label: "Réussi" },
  { value: "echec", label: "Échec" },
  { value: "en_attente", label: "En attente" },
] as const;

export const QUALITE_LAIT_OPTIONS = [
  { value: "excellente", label: "Excellente" },
  { value: "bonne", label: "Bonne" },
  { value: "moyenne", label: "Moyenne" },
  { value: "faible", label: "Faible" },
] as const;

export const PERIODE_LACTATION_OPTIONS = [
  { value: "debut", label: "Début" },
  { value: "pic", label: "Pic" },
  { value: "milieu", label: "Milieu" },
  { value: "fin", label: "Fin" },
] as const;

export const STATUT_LACTATION_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "terminee", label: "Terminée" },
  { value: "suspendue", label: "Suspendue" },
] as const;

// Union type for all record types
export type TraitementRecord = Sujet | InseminationRecord | LactationRecord;
