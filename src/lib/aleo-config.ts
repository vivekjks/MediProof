export const ALEO_RPC_URL = process.env.NEXT_PUBLIC_ALEO_RPC_URL || "https://api.explorer.provable.com/v2";

export const ALEO_NETWORK = process.env.NEXT_PUBLIC_ALEO_NETWORK || "testnet";

export const MEDIPROOF_PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || "mediproof_9126.aleo";

export const PUZZLE_WALLET_URL = process.env.NEXT_PUBLIC_PUZZLE_WALLET_URL || "https://puzzle.online";

export const ALEO_CONFIG = {
  rpcUrl: ALEO_RPC_URL,
  network: ALEO_NETWORK,
  programId: MEDIPROOF_PROGRAM_ID,
  puzzleWalletUrl: PUZZLE_WALLET_URL,
};

export interface PatientProfile {
  patientId: string;
  bloodGroup: string;
  diabetic: boolean;
  hypertensive: boolean;
  lastCheckupTimestamp: number;
  documentHash: string;
  isActive: boolean;
}

export interface AccessRequest {
  requestId: string;
  doctorAddress: string;
  patientAddress: string;
  proofType: string;
  status: "pending" | "approved" | "rejected";
  timestamp: number;
  expiresAt: number;
}

export interface ZKProof {
  proofId: string;
  proofType: string;
  result: boolean;
  timestamp: number;
  verifierAddress: string;
}

export const PROOF_TYPES = {
  FITNESS_CERTIFICATE: "fitness_certificate",
  COVID_NEGATIVE: "covid_negative",
  BLOOD_SUGAR_NORMAL: "blood_sugar_normal",
  NO_INFECTIOUS_DISEASE: "no_infectious_disease",
  VACCINATION_STATUS: "vaccination_status",
  BLOOD_TYPE: "blood_type",
  NOT_DIABETIC: "not_diabetic",
  NOT_HYPERTENSIVE: "not_hypertensive",
};

export const PROOF_TYPE_IDS: Record<string, number> = {
  fitness_certificate: 1,
  blood_type: 2,
  not_diabetic: 3,
  not_hypertensive: 4,
};

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const BLOOD_GROUP_IDS: Record<string, number> = {
  "A+": 0,
  "A-": 1,
  "B+": 2,
  "B-": 3,
  "AB+": 4,
  "AB-": 5,
  "O+": 6,
  "O-": 7,
};

export function getBloodGroupFromId(id: number): string {
  return BLOOD_GROUPS[id] || "Unknown";
}

export function getBloodGroupId(bloodGroup: string): number {
  return BLOOD_GROUP_IDS[bloodGroup] ?? 0;
}
