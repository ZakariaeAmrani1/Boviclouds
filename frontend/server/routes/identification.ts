import { RequestHandler } from "express";
import {
  IdentificationRecord,
  CreateIdentificationInput,
  UpdateIdentificationInput,
  IdentificationFilters,
  PaginationParams,
  PaginatedResponse,
  IdentificationStats,
  Race,
  Sexe,
  TypeAnimal,
} from "../../shared/identification";
import axios from "axios";

// Mock database - in a real app, this would be a proper database
let identifications: IdentificationRecord[] = [
  // {
  //   id: "id-1",
  //   infos_sujet: {
  //     nni: "FR2541963478",
  //     date_naissance: "2023-03-15",
  //     race: Race.CHAROLAISE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963400",
  //     date_naissance: "2020-04-10",
  //     race: Race.CHAROLAISE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963350",
  //     date_naissance: "2018-02-05",
  //     race: Race.CHAROLAISE,
  //   },
  //   pere: {
  //     nni: "FR2541963380",
  //     date_naissance: "2019-01-20",
  //     race: Race.CHAROLAISE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963320",
  //     date_naissance: "2017-05-15",
  //     race: Race.CHAROLAISE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963340",
  //     date_naissance: "2018-08-22",
  //     race: Race.CHAROLAISE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-001",
  //     exploitation_id: "exploit-001",
  //     responsable_local_id: "resp-001",
  //   },
  //   createdBy: "Jean Dupont",
  //   createdAt: "2024-03-15T10:30:00",
  //   updatedAt: "2024-03-15T10:30:00",
  // },
  // {
  //   id: "id-2",
  //   infos_sujet: {
  //     nni: "FR2541963479",
  //     date_naissance: "2023-05-20",
  //     race: Race.LIMOUSINE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963401",
  //     date_naissance: "2020-06-12",
  //     race: Race.LIMOUSINE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963351",
  //     date_naissance: "2018-03-08",
  //     race: Race.LIMOUSINE,
  //   },
  //   pere: {
  //     nni: "FR2541963381",
  //     date_naissance: "2019-02-14",
  //     race: Race.LIMOUSINE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963321",
  //     date_naissance: "2017-07-10",
  //     race: Race.LIMOUSINE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963341",
  //     date_naissance: "2018-09-25",
  //     race: Race.LIMOUSINE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-002",
  //     exploitation_id: "exploit-002",
  //     responsable_local_id: "resp-002",
  //   },
  //   createdBy: "Marie Martin",
  //   createdAt: "2024-03-14T14:15:00",
  //   updatedAt: "2024-03-14T14:15:00",
  // },
  // {
  //   id: "id-3",
  //   infos_sujet: {
  //     nni: "FR2541963480",
  //     date_naissance: "2023-07-08",
  //     race: Race.HOLSTEIN,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963402",
  //     date_naissance: "2020-08-05",
  //     race: Race.HOLSTEIN,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963352",
  //     date_naissance: "2018-04-12",
  //     race: Race.HOLSTEIN,
  //   },
  //   pere: {
  //     nni: "FR2541963382",
  //     date_naissance: "2019-03-18",
  //     race: Race.HOLSTEIN,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963322",
  //     date_naissance: "2017-09-20",
  //     race: Race.HOLSTEIN,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963342",
  //     date_naissance: "2018-11-15",
  //     race: Race.HOLSTEIN,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-003",
  //     exploitation_id: "exploit-003",
  //     responsable_local_id: "resp-003",
  //   },
  //   createdBy: "Pierre Durand",
  //   createdAt: "2024-03-13T09:45:00",
  //   updatedAt: "2024-03-13T09:45:00",
  // },
  // {
  //   id: "id-4",
  //   infos_sujet: {
  //     nni: "FR2541963481",
  //     date_naissance: "2023-09-12",
  //     race: Race.BLONDE_AQUITAINE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963403",
  //     date_naissance: "2020-10-18",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963353",
  //     date_naissance: "2018-05-25",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   pere: {
  //     nni: "FR2541963383",
  //     date_naissance: "2019-04-08",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963323",
  //     date_naissance: "2017-08-30",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963343",
  //     date_naissance: "2018-12-03",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-004",
  //     exploitation_id: "exploit-004",
  //     responsable_local_id: "resp-004",
  //   },
  //   createdBy: "Sophie Bernard",
  //   createdAt: "2024-03-12T16:20:00",
  //   updatedAt: "2024-03-12T16:20:00",
  // },
  // {
  //   id: "id-5",
  //   infos_sujet: {
  //     nni: "FR2541963482",
  //     date_naissance: "2023-11-05",
  //     race: Race.ANGUS,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963404",
  //     date_naissance: "2020-12-22",
  //     race: Race.ANGUS,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963354",
  //     date_naissance: "2018-06-14",
  //     race: Race.ANGUS,
  //   },
  //   pere: {
  //     nni: "FR2541963384",
  //     date_naissance: "2019-05-30",
  //     race: Race.ANGUS,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963324",
  //     date_naissance: "2017-09-12",
  //     race: Race.ANGUS,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963344",
  //     date_naissance: "2019-01-08",
  //     race: Race.ANGUS,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-005",
  //     exploitation_id: "exploit-005",
  //     responsable_local_id: "resp-005",
  //   },
  //   createdBy: "Michel Robert",
  //   createdAt: "2024-03-11T11:10:00",
  //   updatedAt: "2024-03-11T11:10:00",
  // },
  // {
  //   id: "id-6",
  //   infos_sujet: {
  //     nni: "FR2541963483",
  //     date_naissance: "2024-01-18",
  //     race: Race.MONTBELIARDE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963405",
  //     date_naissance: "2021-02-14",
  //     race: Race.MONTBELIARDE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963355",
  //     date_naissance: "2018-07-20",
  //     race: Race.MONTBELIARDE,
  //   },
  //   pere: {
  //     nni: "FR2541963385",
  //     date_naissance: "2019-06-15",
  //     race: Race.MONTBELIARDE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963325",
  //     date_naissance: "2017-10-28",
  //     race: Race.MONTBELIARDE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963345",
  //     date_naissance: "2019-02-20",
  //     race: Race.MONTBELIARDE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-006",
  //     exploitation_id: "exploit-006",
  //     responsable_local_id: "resp-006",
  //   },
  //   createdBy: "Anne Dubois",
  //   createdAt: "2024-03-10T08:30:00",
  //   updatedAt: "2024-03-10T08:30:00",
  // },
  // {
  //   id: "id-7",
  //   infos_sujet: {
  //     nni: "OV2541963484",
  //     date_naissance: "2023-04-22",
  //     race: Race.AUTRE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.OVIN,
  //   },
  //   infos_mere: {
  //     nni: "OV2541963406",
  //     date_naissance: "2021-03-18",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "OV2541963356",
  //     date_naissance: "2019-01-10",
  //     race: Race.AUTRE,
  //   },
  //   pere: {
  //     nni: "OV2541963386",
  //     date_naissance: "2020-02-25",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "OV2541963326",
  //     date_naissance: "2018-03-15",
  //     race: Race.AUTRE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "OV2541963346",
  //     date_naissance: "2019-04-10",
  //     race: Race.AUTRE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-007",
  //     exploitation_id: "exploit-007",
  //     responsable_local_id: "resp-007",
  //   },
  //   createdBy: "Lucie Moreau",
  //   createdAt: "2024-03-09T14:45:00",
  //   updatedAt: "2024-03-09T14:45:00",
  // },
  // {
  //   id: "id-8",
  //   infos_sujet: {
  //     nni: "CP2541963485",
  //     date_naissance: "2023-06-30",
  //     race: Race.AUTRE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.CAPRIN,
  //   },
  //   infos_mere: {
  //     nni: "CP2541963407",
  //     date_naissance: "2021-04-12",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "CP2541963357",
  //     date_naissance: "2019-02-28",
  //     race: Race.AUTRE,
  //   },
  //   pere: {
  //     nni: "CP2541963387",
  //     date_naissance: "2020-03-20",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "CP2541963327",
  //     date_naissance: "2018-04-05",
  //     race: Race.AUTRE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "CP2541963347",
  //     date_naissance: "2019-05-18",
  //     race: Race.AUTRE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-008",
  //     exploitation_id: "exploit-008",
  //     responsable_local_id: "resp-008",
  //   },
  //   createdBy: "Thomas Leroy",
  //   createdAt: "2024-03-08T12:15:00",
  //   updatedAt: "2024-03-08T12:15:00",
  // },
  // // Additional mock data
  // {
  //   id: "id-9",
  //   infos_sujet: {
  //     nni: "FR2541963486",
  //     date_naissance: "2024-02-10",
  //     race: Race.NORMANDE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963408",
  //     date_naissance: "2021-05-15",
  //     race: Race.NORMANDE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963358",
  //     date_naissance: "2019-03-20",
  //     race: Race.NORMANDE,
  //   },
  //   pere: {
  //     nni: "FR2541963388",
  //     date_naissance: "2020-04-12",
  //     race: Race.NORMANDE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963328",
  //     date_naissance: "2018-05-08",
  //     race: Race.NORMANDE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963348",
  //     date_naissance: "2019-06-25",
  //     race: Race.NORMANDE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-009",
  //     exploitation_id: "exploit-009",
  //     responsable_local_id: "resp-009",
  //   },
  //   createdBy: "François Lemaire",
  //   createdAt: "2024-03-07T09:20:00",
  //   updatedAt: "2024-03-07T09:20:00",
  // },
  // {
  //   id: "id-10",
  //   infos_sujet: {
  //     nni: "FR2541963487",
  //     date_naissance: "2024-01-22",
  //     race: Race.TARENTAISE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963409",
  //     date_naissance: "2021-06-30",
  //     race: Race.TARENTAISE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963359",
  //     date_naissance: "2019-04-15",
  //     race: Race.TARENTAISE,
  //   },
  //   pere: {
  //     nni: "FR2541963389",
  //     date_naissance: "2020-05-18",
  //     race: Race.TARENTAISE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963329",
  //     date_naissance: "2018-06-22",
  //     race: Race.TARENTAISE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963349",
  //     date_naissance: "2019-07-14",
  //     race: Race.TARENTAISE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-010",
  //     exploitation_id: "exploit-010",
  //     responsable_local_id: "resp-010",
  //   },
  //   createdBy: "Claire Rousseau",
  //   createdAt: "2024-03-06T15:45:00",
  //   updatedAt: "2024-03-06T15:45:00",
  // },
  // {
  //   id: "id-11",
  //   infos_sujet: {
  //     nni: "FR2541963488",
  //     date_naissance: "2023-12-08",
  //     race: Race.AUBRAC,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963410",
  //     date_naissance: "2021-07-20",
  //     race: Race.AUBRAC,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963360",
  //     date_naissance: "2019-05-10",
  //     race: Race.AUBRAC,
  //   },
  //   pere: {
  //     nni: "FR2541963390",
  //     date_naissance: "2020-06-05",
  //     race: Race.AUBRAC,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963330",
  //     date_naissance: "2018-07-18",
  //     race: Race.AUBRAC,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963350",
  //     date_naissance: "2019-08-12",
  //     race: Race.AUBRAC,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-011",
  //     exploitation_id: "exploit-011",
  //     responsable_local_id: "resp-011",
  //   },
  //   createdBy: "Antoine Mercier",
  //   createdAt: "2024-03-05T11:30:00",
  //   updatedAt: "2024-03-05T11:30:00",
  // },
  // {
  //   id: "id-12",
  //   infos_sujet: {
  //     nni: "FR2541963489",
  //     date_naissance: "2023-10-15",
  //     race: Race.SALERS,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963411",
  //     date_naissance: "2021-08-12",
  //     race: Race.SALERS,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963361",
  //     date_naissance: "2019-06-25",
  //     race: Race.SALERS,
  //   },
  //   pere: {
  //     nni: "FR2541963391",
  //     date_naissance: "2020-07-08",
  //     race: Race.SALERS,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963331",
  //     date_naissance: "2018-08-30",
  //     race: Race.SALERS,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963351",
  //     date_naissance: "2019-09-15",
  //     race: Race.SALERS,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-012",
  //     exploitation_id: "exploit-012",
  //     responsable_local_id: "resp-012",
  //   },
  //   createdBy: "Sylvie Garnier",
  //   createdAt: "2024-03-04T14:20:00",
  //   updatedAt: "2024-03-04T14:20:00",
  // },
  // {
  //   id: "id-13",
  //   infos_sujet: {
  //     nni: "OV2541963490",
  //     date_naissance: "2023-08-18",
  //     race: Race.AUTRE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.OVIN,
  //   },
  //   infos_mere: {
  //     nni: "OV2541963412",
  //     date_naissance: "2021-09-05",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "OV2541963362",
  //     date_naissance: "2019-07-12",
  //     race: Race.AUTRE,
  //   },
  //   pere: {
  //     nni: "OV2541963392",
  //     date_naissance: "2020-08-20",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "OV2541963332",
  //     date_naissance: "2018-09-14",
  //     race: Race.AUTRE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "OV2541963352",
  //     date_naissance: "2019-10-08",
  //     race: Race.AUTRE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-013",
  //     exploitation_id: "exploit-013",
  //     responsable_local_id: "resp-013",
  //   },
  //   createdBy: "Philippe Moreau",
  //   createdAt: "2024-03-03T16:10:00",
  //   updatedAt: "2024-03-03T16:10:00",
  // },
  // {
  //   id: "id-14",
  //   infos_sujet: {
  //     nni: "CP2541963491",
  //     date_naissance: "2023-09-25",
  //     race: Race.AUTRE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.CAPRIN,
  //   },
  //   infos_mere: {
  //     nni: "CP2541963413",
  //     date_naissance: "2021-10-18",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "CP2541963363",
  //     date_naissance: "2019-08-05",
  //     race: Race.AUTRE,
  //   },
  //   pere: {
  //     nni: "CP2541963393",
  //     date_naissance: "2020-09-12",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "CP2541963333",
  //     date_naissance: "2018-10-28",
  //     race: Race.AUTRE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "CP2541963353",
  //     date_naissance: "2019-11-20",
  //     race: Race.AUTRE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-014",
  //     exploitation_id: "exploit-014",
  //     responsable_local_id: "resp-014",
  //   },
  //   createdBy: "Isabelle Perrin",
  //   createdAt: "2024-03-02T10:45:00",
  //   updatedAt: "2024-03-02T10:45:00",
  // },
  // {
  //   id: "id-15",
  //   infos_sujet: {
  //     nni: "FR2541963492",
  //     date_naissance: "2024-03-01",
  //     race: Race.BLONDE_AQUITAINE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963414",
  //     date_naissance: "2021-11-22",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963364",
  //     date_naissance: "2019-09-18",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   pere: {
  //     nni: "FR2541963394",
  //     date_naissance: "2020-10-30",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963334",
  //     date_naissance: "2018-11-15",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963354",
  //     date_naissance: "2019-12-05",
  //     race: Race.BLONDE_AQUITAINE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-015",
  //     exploitation_id: "exploit-015",
  //     responsable_local_id: "resp-015",
  //   },
  //   createdBy: "ZAKARIAE AMRANI",
  //   createdAt: "2024-03-01T08:15:00",
  //   updatedAt: "2024-03-01T08:15:00",
  // },
  // // Additional mock records for testing
  // {
  //   id: "id-16",
  //   infos_sujet: {
  //     nni: "FR2541963493",
  //     date_naissance: "2024-02-28",
  //     race: Race.CHAROLAISE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963415",
  //     date_naissance: "2021-12-10",
  //     race: Race.CHAROLAISE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963365",
  //     date_naissance: "2019-10-22",
  //     race: Race.CHAROLAISE,
  //   },
  //   pere: {
  //     nni: "FR2541963395",
  //     date_naissance: "2020-11-15",
  //     race: Race.CHAROLAISE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963335",
  //     date_naissance: "2018-12-08",
  //     race: Race.CHAROLAISE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963355",
  //     date_naissance: "2019-12-28",
  //     race: Race.CHAROLAISE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-016",
  //     exploitation_id: "exploit-016",
  //     responsable_local_id: "resp-016",
  //   },
  //   createdBy: "Vincent Laurent",
  //   createdAt: "2024-02-28T13:30:00",
  //   updatedAt: "2024-02-28T13:30:00",
  // },
  // {
  //   id: "id-17",
  //   infos_sujet: {
  //     nni: "FR2541963494",
  //     date_naissance: "2024-02-25",
  //     race: Race.LIMOUSINE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963416",
  //     date_naissance: "2022-01-05",
  //     race: Race.LIMOUSINE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963366",
  //     date_naissance: "2019-11-14",
  //     race: Race.LIMOUSINE,
  //   },
  //   pere: {
  //     nni: "FR2541963396",
  //     date_naissance: "2020-12-03",
  //     race: Race.LIMOUSINE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963336",
  //     date_naissance: "2019-01-20",
  //     race: Race.LIMOUSINE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963356",
  //     date_naissance: "2020-01-15",
  //     race: Race.LIMOUSINE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-017",
  //     exploitation_id: "exploit-017",
  //     responsable_local_id: "resp-017",
  //   },
  //   createdBy: "Nathalie Roux",
  //   createdAt: "2024-02-25T16:45:00",
  //   updatedAt: "2024-02-25T16:45:00",
  // },
  // {
  //   id: "id-18",
  //   infos_sujet: {
  //     nni: "FR2541963495",
  //     date_naissance: "2024-02-20",
  //     race: Race.HOLSTEIN,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963417",
  //     date_naissance: "2022-02-12",
  //     race: Race.HOLSTEIN,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963367",
  //     date_naissance: "2019-12-06",
  //     race: Race.HOLSTEIN,
  //   },
  //   pere: {
  //     nni: "FR2541963397",
  //     date_naissance: "2021-01-18",
  //     race: Race.HOLSTEIN,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963337",
  //     date_naissance: "2019-02-28",
  //     race: Race.HOLSTEIN,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963357",
  //     date_naissance: "2020-02-10",
  //     race: Race.HOLSTEIN,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-018",
  //     exploitation_id: "exploit-018",
  //     responsable_local_id: "resp-018",
  //   },
  //   createdBy: "Olivier Blanc",
  //   createdAt: "2024-02-20T09:15:00",
  //   updatedAt: "2024-02-20T09:15:00",
  // },
  // {
  //   id: "id-19",
  //   infos_sujet: {
  //     nni: "OV2541963496",
  //     date_naissance: "2024-02-15",
  //     race: Race.AUTRE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.OVIN,
  //   },
  //   infos_mere: {
  //     nni: "OV2541963418",
  //     date_naissance: "2022-03-08",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "OV2541963368",
  //     date_naissance: "2020-01-12",
  //     race: Race.AUTRE,
  //   },
  //   pere: {
  //     nni: "OV2541963398",
  //     date_naissance: "2021-02-25",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "OV2541963338",
  //     date_naissance: "2019-03-15",
  //     race: Race.AUTRE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "OV2541963358",
  //     date_naissance: "2020-03-08",
  //     race: Race.AUTRE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-019",
  //     exploitation_id: "exploit-019",
  //     responsable_local_id: "resp-019",
  //   },
  //   createdBy: "Catherine Duval",
  //   createdAt: "2024-02-15T14:20:00",
  //   updatedAt: "2024-02-15T14:20:00",
  // },
  // {
  //   id: "id-20",
  //   infos_sujet: {
  //     nni: "CP2541963497",
  //     date_naissance: "2024-02-10",
  //     race: Race.AUTRE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.CAPRIN,
  //   },
  //   infos_mere: {
  //     nni: "CP2541963419",
  //     date_naissance: "2022-04-15",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "CP2541963369",
  //     date_naissance: "2020-02-18",
  //     race: Race.AUTRE,
  //   },
  //   pere: {
  //     nni: "CP2541963399",
  //     date_naissance: "2021-03-10",
  //     race: Race.AUTRE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "CP2541963339",
  //     date_naissance: "2019-04-22",
  //     race: Race.AUTRE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "CP2541963359",
  //     date_naissance: "2020-04-05",
  //     race: Race.AUTRE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-020",
  //     exploitation_id: "exploit-020",
  //     responsable_local_id: "resp-020",
  //   },
  //   createdBy: "Julien Petit",
  //   createdAt: "2024-02-10T11:40:00",
  //   updatedAt: "2024-02-10T11:40:00",
  // },
  // {
  //   id: "id-21",
  //   infos_sujet: {
  //     nni: "FR2541963498",
  //     date_naissance: "2024-02-05",
  //     race: Race.NORMANDE,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963420",
  //     date_naissance: "2022-05-20",
  //     race: Race.NORMANDE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963370",
  //     date_naissance: "2020-03-25",
  //     race: Race.NORMANDE,
  //   },
  //   pere: {
  //     nni: "FR2541963400",
  //     date_naissance: "2021-04-12",
  //     race: Race.NORMANDE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963340",
  //     date_naissance: "2019-05-30",
  //     race: Race.NORMANDE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963360",
  //     date_naissance: "2020-05-18",
  //     race: Race.NORMANDE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-021",
  //     exploitation_id: "exploit-021",
  //     responsable_local_id: "resp-021",
  //   },
  //   createdBy: "Sandrine Boyer",
  //   createdAt: "2024-02-05T08:25:00",
  //   updatedAt: "2024-02-05T08:25:00",
  // },
  // {
  //   id: "id-22",
  //   infos_sujet: {
  //     nni: "FR2541963499",
  //     date_naissance: "2024-01-30",
  //     race: Race.AUBRAC,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963421",
  //     date_naissance: "2022-06-14",
  //     race: Race.AUBRAC,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963371",
  //     date_naissance: "2020-04-30",
  //     race: Race.AUBRAC,
  //   },
  //   pere: {
  //     nni: "FR2541963401",
  //     date_naissance: "2021-05-25",
  //     race: Race.AUBRAC,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963341",
  //     date_naissance: "2019-06-15",
  //     race: Race.AUBRAC,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963361",
  //     date_naissance: "2020-06-08",
  //     race: Race.AUBRAC,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-022",
  //     exploitation_id: "exploit-022",
  //     responsable_local_id: "resp-022",
  //   },
  //   createdBy: "Fabrice Renard",
  //   createdAt: "2024-01-30T15:10:00",
  //   updatedAt: "2024-01-30T15:10:00",
  // },
  // {
  //   id: "id-23",
  //   infos_sujet: {
  //     nni: "FR2541963500",
  //     date_naissance: "2024-01-25",
  //     race: Race.SALERS,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963422",
  //     date_naissance: "2022-07-08",
  //     race: Race.SALERS,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963372",
  //     date_naissance: "2020-05-15",
  //     race: Race.SALERS,
  //   },
  //   pere: {
  //     nni: "FR2541963402",
  //     date_naissance: "2021-06-20",
  //     race: Race.SALERS,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963342",
  //     date_naissance: "2019-07-12",
  //     race: Race.SALERS,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963362",
  //     date_naissance: "2020-07-05",
  //     race: Race.SALERS,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-023",
  //     exploitation_id: "exploit-023",
  //     responsable_local_id: "resp-023",
  //   },
  //   createdBy: "Émilie Girard",
  //   createdAt: "2024-01-25T12:50:00",
  //   updatedAt: "2024-01-25T12:50:00",
  // },
  // {
  //   id: "id-24",
  //   infos_sujet: {
  //     nni: "FR2541963501",
  //     date_naissance: "2024-01-20",
  //     race: Race.TARENTAISE,
  //     sexe: Sexe.FEMELLE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963423",
  //     date_naissance: "2022-08-18",
  //     race: Race.TARENTAISE,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963373",
  //     date_naissance: "2020-06-22",
  //     race: Race.TARENTAISE,
  //   },
  //   pere: {
  //     nni: "FR2541963403",
  //     date_naissance: "2021-07-14",
  //     race: Race.TARENTAISE,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963343",
  //     date_naissance: "2019-08-25",
  //     race: Race.TARENTAISE,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963363",
  //     date_naissance: "2020-08-12",
  //     race: Race.TARENTAISE,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-024",
  //     exploitation_id: "exploit-024",
  //     responsable_local_id: "resp-024",
  //   },
  //   createdBy: "Damien Lefevre",
  //   createdAt: "2024-01-20T10:35:00",
  //   updatedAt: "2024-01-20T10:35:00",
  // },
  // {
  //   id: "id-25",
  //   infos_sujet: {
  //     nni: "FR2541963502",
  //     date_naissance: "2024-01-15",
  //     race: Race.ANGUS,
  //     sexe: Sexe.MALE,
  //     type: TypeAnimal.BOVIN,
  //   },
  //   infos_mere: {
  //     nni: "FR2541963424",
  //     date_naissance: "2022-09-12",
  //     race: Race.ANGUS,
  //   },
  //   grand_pere_maternel: {
  //     nni: "FR2541963374",
  //     date_naissance: "2020-07-18",
  //     race: Race.ANGUS,
  //   },
  //   pere: {
  //     nni: "FR2541963404",
  //     date_naissance: "2021-08-05",
  //     race: Race.ANGUS,
  //   },
  //   grand_pere_paternel: {
  //     nni: "FR2541963344",
  //     date_naissance: "2019-09-10",
  //     race: Race.ANGUS,
  //   },
  //   grand_mere_paternelle: {
  //     nni: "FR2541963364",
  //     date_naissance: "2020-09-28",
  //     race: Race.ANGUS,
  //   },
  //   complem: {
  //     eleveur_id: "eleveur-025",
  //     exploitation_id: "exploit-025",
  //     responsable_local_id: "resp-025",
  //   },
  //   createdBy: "Stéphanie Moreau",
  //   createdAt: "2024-01-15T14:15:00",
  //   updatedAt: "2024-01-15T14:15:00",
  // },
];

// Helper function to generate unique ID
const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to apply filters
const applyFilters = (
  data: IdentificationRecord[],
  filters: IdentificationFilters,
): IdentificationRecord[] => {
  return data.filter((record) => {
    if (
      filters.nni &&
      !record.infos_sujet.nni.toLowerCase().includes(filters.nni.toLowerCase())
    ) {
      return false;
    }
    if (filters.race && record.infos_sujet.race !== filters.race) {
      return false;
    }
    if (filters.sexe && record.infos_sujet.sexe !== filters.sexe) {
      return false;
    }
    if (filters.type && record.infos_sujet.type !== filters.type) {
      return false;
    }
    if (
      filters.eleveur_id &&
      record.complem.eleveur_id !== filters.eleveur_id
    ) {
      return false;
    }
    if (
      filters.exploitation_id &&
      record.complem.exploitation_id !== filters.exploitation_id
    ) {
      return false;
    }
    if (
      filters.responsable_local_id &&
      record.complem.responsable_local_id !== filters.responsable_local_id
    ) {
      return false;
    }
    if (
      filters.createdBy &&
      !record.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())
    ) {
      return false;
    }
    if (filters.dateCreation) {
      const recordDate = new Date(record.createdAt).toDateString();
      const filterDate = new Date(filters.dateCreation).toDateString();
      if (recordDate !== filterDate) {
        return false;
      }
    }
    return true;
  });
};

// Helper function to apply pagination
const applyPagination = <T>(
  data: T[],
  pagination: PaginationParams,
): PaginatedResponse<T> => {
  const total = data.length;
  const totalPages = Math.ceil(total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages,
  };
};

export const getIdentificationsforLactation: RequestHandler = async (
  req,
  res,
) => {
  const resp = [];
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const apiUrl = process.env.SERVER_API_URL;
    const { token } = req.query;
    const response = await axios.get(`${apiUrl}identifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    response.data.map((data) => {
      resp.push({
        id: data._id,
        nni: data.infos_sujet.nni,
        nom: data.infos_sujet.type,
        race: data.infos_sujet.race,
      });
    });

    const filters: IdentificationFilters = {
      nni: req.query.nni as string,
      race: req.query.race as Race,
      sexe: req.query.sexe as Sexe,
      type: req.query.type as TypeAnimal,
      eleveur_id: req.query.eleveur_id as string,
      exploitation_id: req.query.exploitation_id as string,
      responsable_local_id: req.query.responsable_local_id as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof IdentificationFilters] === undefined) {
        delete filters[key as keyof IdentificationFilters];
      }
    });

    const filteredData = applyFilters(resp, filters);
    const paginatedResult = applyPagination(filteredData, { page, limit });

    res.json({
      success: true,
      data: resp,
    });
  } catch (error) {
    console.error("Error fetching identifications:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des identifications",
    });
  }
};

// Get all identifications with pagination and filtering
export const getIdentifications: RequestHandler = async (req, res) => {
  identifications = [];
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const apiUrl = process.env.SERVER_API_URL;
    const { token } = req.query;
    const response = await axios.get(`${apiUrl}identifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    response.data.map((data) => {
      identifications.push({
        id: data.id,
        infos_sujet: {
          nni: data.infos_sujet.nni,
          date_naissance: data.infos_sujet.date_naissance,
          race: Race.ANGUS,
          sexe: data.infos_sujet.race === "MALE" ? Sexe.MALE : Sexe.FEMELLE,
          type:
            data.infos_sujet.type === "BOVIN"
              ? TypeAnimal.BOVIN
              : data.infos_sujet.type === "CARPIN"
                ? TypeAnimal.CAPRIN
                : TypeAnimal.OVIN,
        },
        infos_mere: {
          nni: data.infos_mere.nni,
          date_naissance: data.infos_mere.date_naissance,
          race: Race.ANGUS,
        },
        grand_pere_maternel: {
          nni: data.grand_pere_maternel.nni,
          date_naissance: data.grand_pere_maternel.date_naissance,
          race: Race.ANGUS,
        },
        pere: {
          nni: data.pere.nni,
          date_naissance: data.pere.date_naissance,
          race: Race.ANGUS,
        },
        grand_pere_paternel: {
          nni: data.grand_pere_paternel.nni,
          date_naissance: data.grand_pere_paternel.date_naissance,
          race: Race.ANGUS,
        },
        grand_mere_paternelle: {
          nni: data.grand_mere_paternelle.nni,
          date_naissance: data.grand_mere_paternelle.date_naissance,
          race: Race.ANGUS,
        },
        complem: {
          eleveur_id: data.complem.eleveur_id,
          exploitation_id: data.complem.exploitation_id,
          responsable_local_id: data.complem.responsable_local_id,
        },
        createdBy: "Stéphanie Moreau",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    const filters: IdentificationFilters = {
      nni: req.query.nni as string,
      race: req.query.race as Race,
      sexe: req.query.sexe as Sexe,
      type: req.query.type as TypeAnimal,
      eleveur_id: req.query.eleveur_id as string,
      exploitation_id: req.query.exploitation_id as string,
      responsable_local_id: req.query.responsable_local_id as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof IdentificationFilters] === undefined) {
        delete filters[key as keyof IdentificationFilters];
      }
    });

    const filteredData = applyFilters(identifications, filters);
    const paginatedResult = applyPagination(filteredData, { page, limit });

    res.json({
      success: true,
      data: paginatedResult,
    });
  } catch (error) {
    console.error("Error fetching identifications:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des identifications",
    });
  }
};

// Get single identification by ID
export const getIdentification: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const identification = identifications.find((i) => i.id === id);

    if (!identification) {
      return res.status(404).json({
        success: false,
        message: "Identification non trouvée",
      });
    }

    res.json({
      success: true,
      data: identification,
    });
  } catch (error) {
    console.error("Error fetching identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'identification",
    });
  }
};

// Create new identification
export const createIdentification: RequestHandler = async (req, res) => {
  try {
    let data: CreateIdentificationInput & { token?: string };
    let images: Express.Multer.File[] = [];

    // Check if request contains FormData (with images)
    if (req.is('multipart/form-data')) {
      // Parse JSON data from the 'data' field
      if (req.body.data) {
        data = JSON.parse(req.body.data);
      } else {
        return res.status(400).json({
          success: false,
          message: "Données manquantes dans la requête FormData",
        });
      }

      // Get uploaded images
      if (req.files && Array.isArray(req.files)) {
        images = req.files;
      } else if (req.files && 'images' in req.files) {
        images = req.files.images as Express.Multer.File[];
      }
    } else {
      // Regular JSON request
      data = req.body;
    }

    // Basic validation
    if (!data.infos_sujet?.nni || !data.createdBy) {
      return res.status(400).json({
        success: false,
        message: "Le NNI du sujet et le créateur sont requis",
      });
    }

    // Forward to the actual backend API
    const apiUrl = process.env.SERVER_API_URL;
    const { token } = data;

    try {
      let response;

      if (images.length > 0) {
        // Create FormData for the backend request
        const FormData = require('form-data');
        const formData = new FormData();

        // Add JSON data
        formData.append('data', JSON.stringify({
          infos_sujet: data.infos_sujet,
          infos_mere: data.infos_mere,
          grand_pere_maternel: data.grand_pere_maternel,
          pere: data.pere,
          grand_pere_paternel: data.grand_pere_paternel,
          grand_mere_paternelle: data.grand_mere_paternelle,
          complem: data.complem,
          createdBy: data.createdBy,
        }));

        // Add images
        images.forEach((image, index) => {
          formData.append('images', image.buffer, image.originalname);
        });

        response = await axios.post(`${apiUrl}identifications`, formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Regular JSON request
        response = await axios.post(`${apiUrl}identifications`, {
          infos_sujet: data.infos_sujet,
          infos_mere: data.infos_mere,
          grand_pere_maternel: data.grand_pere_maternel,
          pere: data.pere,
          grand_pere_paternel: data.grand_pere_paternel,
          grand_mere_paternelle: data.grand_mere_paternelle,
          complem: data.complem,
          createdBy: data.createdBy,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      res.status(201).json({
        success: true,
        data: response.data,
        message: "Identification créée avec succès",
      });
    } catch (apiError: any) {
      console.error("Error calling backend API:", apiError.response?.data || apiError.message);
      res.status(apiError.response?.status || 500).json({
        success: false,
        message: apiError.response?.data?.message || "Erreur lors de la création de l'identification",
      });
    }
  } catch (error) {
    console.error("Error creating identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'identification",
    });
  }
};

// Update identification
export const updateIdentification: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    let data: UpdateIdentificationInput & { token?: string };
    let images: Express.Multer.File[] = [];

    // Check if request contains FormData (with images)
    if (req.is('multipart/form-data')) {
      // Parse JSON data from the 'data' field
      if (req.body.data) {
        data = JSON.parse(req.body.data);
      } else {
        return res.status(400).json({
          success: false,
          message: "Données manquantes dans la requête FormData",
        });
      }

      // Get uploaded images
      if (req.files && Array.isArray(req.files)) {
        images = req.files;
      } else if (req.files && 'images' in req.files) {
        images = req.files.images as Express.Multer.File[];
      }
    } else {
      // Regular JSON request
      data = req.body;
    }

    // Forward to the actual backend API
    const apiUrl = process.env.SERVER_API_URL;
    const { token } = data;

    try {
      let response;

      if (images.length > 0) {
        // Create FormData for the backend request
        const FormData = require('form-data');
        const formData = new FormData();

        // Add JSON data
        const updateData: UpdateIdentificationInput = {};
        if (data.infos_sujet) updateData.infos_sujet = data.infos_sujet;
        if (data.infos_mere) updateData.infos_mere = data.infos_mere;
        if (data.grand_pere_maternel) updateData.grand_pere_maternel = data.grand_pere_maternel;
        if (data.pere) updateData.pere = data.pere;
        if (data.grand_pere_paternel) updateData.grand_pere_paternel = data.grand_pere_paternel;
        if (data.grand_mere_paternelle) updateData.grand_mere_paternelle = data.grand_mere_paternelle;
        if (data.complem) updateData.complem = data.complem;

        formData.append('data', JSON.stringify(updateData));

        // Add images
        images.forEach((image, index) => {
          formData.append('images', image.buffer, image.originalname);
        });

        response = await axios.put(`${apiUrl}identifications/${id}`, formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Regular JSON request
        const updateData: UpdateIdentificationInput = {};
        if (data.infos_sujet) updateData.infos_sujet = data.infos_sujet;
        if (data.infos_mere) updateData.infos_mere = data.infos_mere;
        if (data.grand_pere_maternel) updateData.grand_pere_maternel = data.grand_pere_maternel;
        if (data.pere) updateData.pere = data.pere;
        if (data.grand_pere_paternel) updateData.grand_pere_paternel = data.grand_pere_paternel;
        if (data.grand_mere_paternelle) updateData.grand_mere_paternelle = data.grand_mere_paternelle;
        if (data.complem) updateData.complem = data.complem;

        response = await axios.put(`${apiUrl}identifications/${id}`, updateData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      res.json({
        success: true,
        data: response.data,
        message: "Identification mise à jour avec succès",
      });
    } catch (apiError: any) {
      console.error("Error calling backend API:", apiError.response?.data || apiError.message);
      res.status(apiError.response?.status || 500).json({
        success: false,
        message: apiError.response?.data?.message || "Erreur lors de la mise à jour de l'identification",
      });
    }
  } catch (error) {
    console.error("Error updating identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'identification",
    });
  }
};

// Delete identification
export const deleteIdentification: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const identificationIndex = identifications.findIndex((i) => i.id === id);

    if (identificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Identification non trouvée",
      });
    }

    identifications.splice(identificationIndex, 1);

    res.json({
      success: true,
      message: "Identification supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'identification",
    });
  }
};

// Get identification statistics
export const getIdentificationStats: RequestHandler = (req, res) => {
  try {
    const stats: IdentificationStats = {
      total: identifications.length,
      bovins: identifications.filter(
        (i) => i.infos_sujet.type === TypeAnimal.BOVIN,
      ).length,
      ovins: identifications.filter(
        (i) => i.infos_sujet.type === TypeAnimal.OVIN,
      ).length,
      caprins: identifications.filter(
        (i) => i.infos_sujet.type === TypeAnimal.CAPRIN,
      ).length,
      maleCount: identifications.filter((i) => i.infos_sujet.sexe === Sexe.MALE)
        .length,
      femelleCount: identifications.filter(
        (i) => i.infos_sujet.sexe === Sexe.FEMELLE,
      ).length,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching identification stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};
