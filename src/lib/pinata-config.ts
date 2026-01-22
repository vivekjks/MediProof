import { PinataSDK } from "pinata";

let pinataInstance: PinataSDK | null = null;

export function getPinata(): PinataSDK {
  if (!pinataInstance) {
    const jwt = process.env.PINATA_JWT;
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
    
    if (!jwt) {
      throw new Error("PINATA_JWT environment variable is not set");
    }
    
    pinataInstance = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway,
    });
  }
  return pinataInstance;
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  ipfsHash: string;
  uploadedAt: number;
  size: number;
  category: "report" | "prescription" | "scan" | "certificate" | "other";
}

export interface MedicalMetadata {
  patientAddress: string;
  documentType: string;
  category: string;
  uploadTimestamp: number;
  encryptedMetadata?: string;
}

export async function uploadToPinata(
  file: File,
  metadata: MedicalMetadata
): Promise<{ ipfsHash: string; pinataUrl: string }> {
  const pinata = getPinata();
  
  const upload = await pinata.upload.file(file).addMetadata({
    name: file.name,
    keyValues: {
      patientAddress: metadata.patientAddress,
      documentType: metadata.documentType,
      category: metadata.category,
      uploadTimestamp: metadata.uploadTimestamp.toString(),
    },
  });

  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
  
  return {
    ipfsHash: upload.IpfsHash,
    pinataUrl: `https://${gateway}/ipfs/${upload.IpfsHash}`,
  };
}

export async function getFileFromPinata(ipfsHash: string): Promise<string> {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
  return `https://${gateway}/ipfs/${ipfsHash}`;
}

export function generateDocumentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}
