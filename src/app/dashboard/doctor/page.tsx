"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileCheck,
  History,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  User,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWallet } from "@/context/WalletContext";
import { PROOF_TYPES, AccessRequest } from "@/lib/aleo-config";
import { toast } from "sonner";

export default function DoctorDashboard() {
  const router = useRouter();
  const { publicKey, connected, userType, addAccessRequest, accessRequests } = useWallet();
  
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    patientAddress: "",
    proofType: "",
  });
  const [verifiedProofs, setVerifiedProofs] = useState<Array<{
    id: string;
    patientAddress: string;
    proofType: string;
    result: boolean;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    if (!connected) {
      router.push("/select-role");
    } else if (userType !== "doctor") {
      router.push(`/dashboard/${userType}`);
    }
  }, [connected, userType, router]);

  useEffect(() => {
    const savedProofs = localStorage.getItem("mediproof_doctorVerifiedProofs");
    if (savedProofs) setVerifiedProofs(JSON.parse(savedProofs));
  }, []);

  const handleSendRequest = () => {
    if (!requestForm.patientAddress || !requestForm.proofType) {
      toast.error("Please fill all fields");
      return;
    }

    const newRequest: AccessRequest = {
      requestId: Date.now().toString(),
      doctorAddress: publicKey!,
      patientAddress: requestForm.patientAddress,
      proofType: requestForm.proofType,
      status: "pending",
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    addAccessRequest(newRequest);
    setIsRequestModalOpen(false);
    setRequestForm({ patientAddress: "", proofType: "" });
    toast.success("Verification request sent to patient!");
  };

  const simulateProofVerification = (patientAddress: string) => {
    const newProof = {
      id: Date.now().toString(),
      patientAddress,
      proofType: "fitness_certificate",
      result: Math.random() > 0.2,
      timestamp: Date.now(),
    };
    
    const updatedProofs = [...verifiedProofs, newProof];
    setVerifiedProofs(updatedProofs);
    localStorage.setItem("mediproof_doctorVerifiedProofs", JSON.stringify(updatedProofs));
    toast.success(newProof.result ? "Proof verified - Patient is fit!" : "Proof verification failed");
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success("Address copied!");
    }
  };

  const myRequests = accessRequests.filter(r => r.doctorAddress === publicKey);
  const pendingRequests = myRequests.filter(r => r.status === "pending");
  const approvedRequests = myRequests.filter(r => r.status === "approved");
  const rejectedRequests = myRequests.filter(r => r.status === "rejected");

  if (!connected || userType !== "doctor") {
    return null;
  }

  return (
    <div className="min-h-screen mesh-gradient py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="gradient-text-accent">Doctor</span> Dashboard
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-mono text-sm">{publicKey?.slice(0, 12)}...{publicKey?.slice(-8)}</span>
                <button onClick={copyAddress} className="p-1 hover:text-[#7c3aed] transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  Request Verification
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-[#7c3aed]/20">
                <DialogHeader>
                  <DialogTitle>Request Patient Verification</DialogTitle>
                  <DialogDescription>
                    Send a verification request to a patient. They will generate a ZK proof.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Patient Aleo Address</Label>
                    <Input
                      placeholder="aleo1..."
                      value={requestForm.patientAddress}
                      onChange={(e) => setRequestForm({ ...requestForm, patientAddress: e.target.value })}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label>Proof Type</Label>
                    <Select
                      value={requestForm.proofType}
                      onValueChange={(v) => setRequestForm({ ...requestForm, proofType: v })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select proof type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROOF_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSendRequest} className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white">
                    Send Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Approved</p>
              <p className="text-2xl font-bold">{approvedRequests.length}</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ef4444]/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Rejected</p>
              <p className="text-2xl font-bold">{rejectedRequests.length}</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="requests" className="data-[state=active]:bg-[#7c3aed]/20 data-[state=active]:text-[#7c3aed]">
              <Send className="w-4 h-4 mr-2" />
              My Requests
            </TabsTrigger>
            <TabsTrigger value="verify" className="data-[state=active]:bg-[#7c3aed]/20 data-[state=active]:text-[#7c3aed]">
              <FileCheck className="w-4 h-4 mr-2" />
              Verify Proof
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#7c3aed]/20 data-[state=active]:text-[#7c3aed]">
              <History className="w-4 h-4 mr-2" />
              Verification History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {myRequests.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Send className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Send verification requests to patients to get started.
                  </p>
                  <Button onClick={() => setIsRequestModalOpen(true)} className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send First Request
                  </Button>
                </div>
              ) : (
                myRequests.map((request) => (
                  <motion.div
                    key={request.requestId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00d9ff]/20 flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-[#00d9ff]" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Patient Verification</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            To: <span className="font-mono">{request.patientAddress.slice(0, 12)}...</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-[#7c3aed]/20 text-[#7c3aed] text-xs">
                              {request.proofType.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(request.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {request.status === "pending" && (
                          <span className="px-3 py-1.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Pending
                          </span>
                        )}
                        {request.status === "approved" && (
                          <span className="px-3 py-1.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Approved
                          </span>
                        )}
                        {request.status === "rejected" && (
                          <span className="px-3 py-1.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-sm flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="verify">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-6 text-center">Verify ZK Proof</h3>
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label>Patient Address or Proof ID</Label>
                  <Input placeholder="Enter patient address or proof ID" className="mt-1 font-mono" />
                </div>
                <Button 
                  onClick={() => simulateProofVerification("aleo1demo...")}
                  className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Proof on Aleo
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  This will verify the ZK proof on the Aleo blockchain without revealing any patient data.
                </p>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {verifiedProofs.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Verifications Yet</h3>
                  <p className="text-muted-foreground">
                    Your verified proofs will appear here after patients approve your requests.
                  </p>
                </div>
              ) : (
                verifiedProofs.map((proof) => (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${proof.result ? "bg-[#10b981]/20" : "bg-[#ef4444]/20"} flex items-center justify-center`}>
                          {proof.result ? (
                            <CheckCircle className="w-5 h-5 text-[#10b981]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#ef4444]" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{proof.proofType.replace(/_/g, " ")}</h4>
                          <p className="text-xs text-muted-foreground">
                            Patient: <span className="font-mono">{proof.patientAddress.slice(0, 12)}...</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded ${proof.result ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#ef4444]/20 text-[#ef4444]"} text-xs`}>
                          {proof.result ? "VERIFIED" : "FAILED"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(proof.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
