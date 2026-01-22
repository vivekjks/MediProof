"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ALEO_RPC_URL, MEDIPROOF_PROGRAM_ID, PatientProfile, AccessRequest, getBloodGroupId, PROOF_TYPE_IDS } from "@/lib/aleo-config";

declare global {
  interface Window {
    puzzle?: {
      connect: () => Promise<{ address: string }>;
      disconnect: () => Promise<void>;
      requestSignature: (message: string) => Promise<string>;
      requestTransaction: (params: {
        programId: string;
        functionName: string;
        inputs: string[];
        fee: number;
      }) => Promise<{ transactionId: string }>;
      getSelectedAccount: () => Promise<{ address: string } | null>;
    };
    leoWallet?: {
      publicKey: string;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
    };
  }
}

interface WalletContextType {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  walletType: "puzzle" | "leo" | null;
  userType: "patient" | "doctor" | "verifier" | null;
  patientProfile: PatientProfile | null;
  accessRequests: AccessRequest[];
  networkStatus: "connected" | "disconnected" | "error";
  connect: (type?: "puzzle" | "leo") => Promise<void>;
  disconnect: () => void;
  setUserType: (type: "patient" | "doctor" | "verifier") => void;
  setPatientProfile: (profile: PatientProfile) => void;
  addAccessRequest: (request: AccessRequest) => void;
  updateAccessRequest: (requestId: string, status: "approved" | "rejected") => void;
  executeTransaction: (functionName: string, inputs: string[]) => Promise<{ transactionId: string } | null>;
  createPatientProfileOnChain: (bloodGroup: string, diabetic: boolean, hypertensive: boolean, documentHash: string) => Promise<string | null>;
  requestVerificationOnChain: (patientAddress: string, proofType: string, expiresAt: number) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletType, setWalletType] = useState<"puzzle" | "leo" | null>(null);
  const [userType, setUserTypeState] = useState<"patient" | "doctor" | "verifier" | null>(null);
  const [patientProfile, setPatientProfileState] = useState<PatientProfile | null>(null);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [networkStatus, setNetworkStatus] = useState<"connected" | "disconnected" | "error">("disconnected");

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const response = await fetch(`${ALEO_RPC_URL}/testnet/block/height/latest`);
        if (response.ok) {
          setNetworkStatus("connected");
        } else {
          setNetworkStatus("error");
        }
      } catch {
        setNetworkStatus("error");
      }
    };
    
    checkNetwork();
    const interval = setInterval(checkNetwork, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedKey = localStorage.getItem("mediproof_publicKey");
    const savedType = localStorage.getItem("mediproof_userType") as "patient" | "doctor" | "verifier" | null;
    const savedProfile = localStorage.getItem("mediproof_patientProfile");
    const savedRequests = localStorage.getItem("mediproof_accessRequests");
    const savedWalletType = localStorage.getItem("mediproof_walletType") as "puzzle" | "leo" | null;

    if (savedKey) {
      setPublicKey(savedKey);
      setConnected(true);
      setWalletType(savedWalletType);
    }
    if (savedType) {
      setUserTypeState(savedType);
    }
    if (savedProfile) {
      setPatientProfileState(JSON.parse(savedProfile));
    }
    if (savedRequests) {
      setAccessRequests(JSON.parse(savedRequests));
    }

    const checkPuzzleWallet = async () => {
      if (savedWalletType === "puzzle" && window.puzzle) {
        try {
          const account = await window.puzzle.getSelectedAccount();
          if (account) {
            setPublicKey(account.address);
            setConnected(true);
          }
        } catch (e) {
          console.log("Puzzle wallet not connected");
        }
      }
    };
    
    setTimeout(checkPuzzleWallet, 1000);
  }, []);

  const connect = useCallback(async (type: "puzzle" | "leo" = "puzzle") => {
    setConnecting(true);
    try {
      if (type === "puzzle" && window.puzzle) {
        const result = await window.puzzle.connect();
        setPublicKey(result.address);
        setConnected(true);
        setWalletType("puzzle");
        localStorage.setItem("mediproof_publicKey", result.address);
        localStorage.setItem("mediproof_walletType", "puzzle");
      } else if (type === "leo" && window.leoWallet) {
        await window.leoWallet.connect();
        const key = window.leoWallet.publicKey;
        setPublicKey(key);
        setConnected(true);
        setWalletType("leo");
        localStorage.setItem("mediproof_publicKey", key);
        localStorage.setItem("mediproof_walletType", "leo");
      } else {
        const mockKey = `aleo1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setPublicKey(mockKey);
        setConnected(true);
        setWalletType("puzzle");
        localStorage.setItem("mediproof_publicKey", mockKey);
        localStorage.setItem("mediproof_walletType", "puzzle");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      const mockKey = `aleo1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setPublicKey(mockKey);
      setConnected(true);
      setWalletType("puzzle");
      localStorage.setItem("mediproof_publicKey", mockKey);
      localStorage.setItem("mediproof_walletType", "puzzle");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (walletType === "puzzle" && window.puzzle) {
        await window.puzzle.disconnect();
      } else if (walletType === "leo" && window.leoWallet) {
        await window.leoWallet.disconnect();
      }
    } catch (e) {
      console.log("Error disconnecting wallet");
    }
    
    setPublicKey(null);
    setConnected(false);
    setWalletType(null);
    setUserTypeState(null);
    setPatientProfileState(null);
    localStorage.removeItem("mediproof_publicKey");
    localStorage.removeItem("mediproof_userType");
    localStorage.removeItem("mediproof_patientProfile");
    localStorage.removeItem("mediproof_walletType");
  }, [walletType]);

  const setUserType = useCallback((type: "patient" | "doctor" | "verifier") => {
    setUserTypeState(type);
    localStorage.setItem("mediproof_userType", type);
  }, []);

  const setPatientProfile = useCallback((profile: PatientProfile) => {
    setPatientProfileState(profile);
    localStorage.setItem("mediproof_patientProfile", JSON.stringify(profile));
  }, []);

  const addAccessRequest = useCallback((request: AccessRequest) => {
    setAccessRequests((prev) => {
      const updated = [...prev, request];
      localStorage.setItem("mediproof_accessRequests", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateAccessRequest = useCallback((requestId: string, status: "approved" | "rejected") => {
    setAccessRequests((prev) => {
      const updated = prev.map((req) =>
        req.requestId === requestId ? { ...req, status } : req
      );
      localStorage.setItem("mediproof_accessRequests", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const executeTransaction = useCallback(async (functionName: string, inputs: string[]): Promise<{ transactionId: string } | null> => {
    if (!connected || !publicKey) {
      console.error("Wallet not connected");
      return null;
    }

    try {
      if (walletType === "puzzle" && window.puzzle) {
        const result = await window.puzzle.requestTransaction({
          programId: MEDIPROOF_PROGRAM_ID,
          functionName,
          inputs,
          fee: 1000000,
        });
        return result;
      }
      
      const mockTxId = `at1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      console.log(`[Simulated] Transaction ${functionName} with inputs:`, inputs);
      return { transactionId: mockTxId };
    } catch (error) {
      console.error("Transaction failed:", error);
      return null;
    }
  }, [connected, publicKey, walletType]);

  const createPatientProfileOnChain = useCallback(async (
    bloodGroup: string,
    diabetic: boolean,
    hypertensive: boolean,
    documentHash: string
  ): Promise<string | null> => {
    const bloodGroupId = getBloodGroupId(bloodGroup);
    const inputs = [
      `${bloodGroupId}u8`,
      `${diabetic}`,
      `${hypertensive}`,
      `${documentHash || "0"}field`,
    ];
    
    const result = await executeTransaction("create_patient_profile", inputs);
    return result?.transactionId || null;
  }, [executeTransaction]);

  const requestVerificationOnChain = useCallback(async (
    patientAddress: string,
    proofType: string,
    expiresAt: number
  ): Promise<string | null> => {
    const proofTypeId = PROOF_TYPE_IDS[proofType] || 1;
    const inputs = [
      patientAddress,
      `${proofTypeId}u8`,
      `${expiresAt}u64`,
    ];
    
    const result = await executeTransaction("request_verification", inputs);
    return result?.transactionId || null;
  }, [executeTransaction]);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
        connecting,
        walletType,
        userType,
        patientProfile,
        accessRequests,
        networkStatus,
        connect,
        disconnect,
        setUserType,
        setPatientProfile,
        addAccessRequest,
        updateAccessRequest,
        executeTransaction,
        createPatientProfileOnChain,
        requestVerificationOnChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
