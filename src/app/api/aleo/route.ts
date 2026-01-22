import { NextRequest, NextResponse } from "next/server";
import { ALEO_RPC_URL, MEDIPROOF_PROGRAM_ID } from "@/lib/aleo-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "create_profile":
        return handleCreateProfile(data);
      case "request_access":
        return handleRequestAccess(data);
      case "grant_access":
        return handleGrantAccess(data);
      case "generate_proof":
        return handleGenerateProof(data);
      case "verify_proof":
        return handleVerifyProof(data);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Aleo API error:", error);
    return NextResponse.json(
      { error: "Failed to process Aleo request" },
      { status: 500 }
    );
  }
}

async function handleCreateProfile(data: {
  patientAddress: string;
  bloodGroup: string;
  diabetic: boolean;
  hypertensive: boolean;
  documentHash: string;
}) {
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  return NextResponse.json({
    success: true,
    message: "Profile created on Aleo (simulated)",
    transactionId: txId,
    programId: MEDIPROOF_PROGRAM_ID,
    function: "create_patient_profile",
    inputs: {
      patient: data.patientAddress,
      blood_group: data.bloodGroup,
      diabetic: data.diabetic,
      hypertensive: data.hypertensive,
      document_hash: data.documentHash,
    },
  });
}

async function handleRequestAccess(data: {
  doctorAddress: string;
  patientAddress: string;
  proofType: string;
  duration: number;
}) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  return NextResponse.json({
    success: true,
    message: "Access request created (simulated)",
    requestId,
    programId: MEDIPROOF_PROGRAM_ID,
    function: "request_verification",
    inputs: {
      requester: data.doctorAddress,
      patient: data.patientAddress,
      proof_type: data.proofType,
      expires_at: Date.now() + data.duration,
    },
  });
}

async function handleGrantAccess(data: {
  patientAddress: string;
  requestId: string;
  approved: boolean;
}) {
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  return NextResponse.json({
    success: true,
    message: data.approved ? "Access granted (simulated)" : "Access denied (simulated)",
    transactionId: txId,
    programId: MEDIPROOF_PROGRAM_ID,
    function: data.approved ? "approve_request" : "reject_request",
    inputs: {
      patient: data.patientAddress,
      request_id: data.requestId,
    },
  });
}

async function handleGenerateProof(data: {
  patientAddress: string;
  proofType: string;
  requestId: string;
}) {
  const proofId = `proof_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  const mockProofResult = Math.random() > 0.1;
  
  return NextResponse.json({
    success: true,
    message: "ZK Proof generated (simulated)",
    proofId,
    proofType: data.proofType,
    result: mockProofResult,
    programId: MEDIPROOF_PROGRAM_ID,
    function: `prove_${data.proofType}`,
    zkProof: {
      a: ["0x" + Math.random().toString(16).substring(2, 66)],
      b: [
        ["0x" + Math.random().toString(16).substring(2, 66)],
        ["0x" + Math.random().toString(16).substring(2, 66)],
      ],
      c: ["0x" + Math.random().toString(16).substring(2, 66)],
    },
    publicInputs: {
      patient_commitment: "0x" + Math.random().toString(16).substring(2, 66),
      proof_type: data.proofType,
      result: mockProofResult,
      timestamp: Date.now(),
    },
  });
}

async function handleVerifyProof(data: {
  proofId: string;
  verifierAddress: string;
}) {
  const isValid = Math.random() > 0.1;
  
  return NextResponse.json({
    success: true,
    message: isValid ? "Proof is valid" : "Proof is invalid",
    proofId: data.proofId,
    isValid,
    verifiedAt: Date.now(),
    verifier: data.verifierAddress,
    programId: MEDIPROOF_PROGRAM_ID,
    function: "verify_proof",
  });
}

export async function GET() {
  try {
    const response = await fetch(`${ALEO_RPC_URL}/testnet3/latest/height`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch from Aleo RPC");
    }
    
    const height = await response.text();
    
    return NextResponse.json({
      status: "connected",
      network: "testnet",
      rpcUrl: ALEO_RPC_URL,
      programId: MEDIPROOF_PROGRAM_ID,
      latestBlock: parseInt(height) || "unknown",
    });
  } catch {
    return NextResponse.json({
      status: "simulated",
      network: "testnet",
      rpcUrl: ALEO_RPC_URL,
      programId: MEDIPROOF_PROGRAM_ID,
      message: "Running in simulation mode",
    });
  }
}
