"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  History,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  User,
  Shield,
  Briefcase,
  ClipboardCheck,
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
import { AccessRequest } from "@/lib/aleo-config";
import { toast } from "sonner";

const VERIFIER_PROOF_TYPES = {
  EMPLOYMENT_FITNESS: "employment_fitness",
  INSURANCE_ELIGIBILITY: "insurance_eligibility",
  NO_COMMUNICABLE_DISEASE: "no_communicable_disease",
  GENERAL_HEALTH_CHECK: "general_health_check",
};

export default function VerifierDashboard() {
  const router = useRouter();
  const { publicKey, connected, userType, addAccessRequest, accessRequests } = useWallet();
  
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    patientAddress: "",
    proofType: "",
    purpose: "",
  });
  const [verificationRecords, setVerificationRecords] = useState<Array<{
    id: string;
    patientAddress: string;
    proofType: string;
    purpose: string;
    result: boolean;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    if (!connected) {
      router.push("/select-role");
    } else if (userType !== "verifier") {
      router.push(`/dashboard/${userType}`);
    }
  }, [connected, userType, router]);

  useEffect(() => {
    const savedRecords = localStorage.getItem("mediproof_verifierRecords");
    if (savedRecords) setVerificationRecords(JSON.parse(savedRecords));
  }, []);

  const handleSendRequest = () => {
    if (!requestForm.patientAddress || !requestForm.proofType) {
      toast.error("Please fill all required fields");
      return;
    }

    const newRequest: AccessRequest = {
      requestId: Date.now().toString(),
      doctorAddress: publicKey!,
      patientAddress: requestForm.patientAddress,
      proofType: requestForm.proofType,
      status: "pending",
      timestamp: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    addAccessRequest(newRequest);
    setIsRequestModalOpen(false);
    setRequestForm({ patientAddress: "", proofType: "", purpose: "" });
    toast.success("Verification request sent!");
  };

  const simulateVerification = () => {
    const newRecord = {
      id: Date.now().toString(),
      patientAddress: `aleo1${Math.random().toString(36).substring(2, 10)}...`,
      proofType: "employment_fitness",
      purpose: "Pre-employment health check",
      result: Math.random() > 0.1,
      timestamp: Date.now(),
    };
    
    const updatedRecords = [...verificationRecords, newRecord];
    setVerificationRecords(updatedRecords);
    localStorage.setItem("mediproof_verifierRecords", JSON.stringify(updatedRecords));
    toast.success(newRecord.result ? "Verification successful - Candidate is eligible!" : "Verification failed");
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success("Address copied!");
    }
  };

  const myRequests = accessRequests.filter(r => r.doctorAddress === publicKey);
  const successfulVerifications = verificationRecords.filter(r => r.result).length;
  const totalVerifications = verificationRecords.length;

  if (!connected || userType !== "verifier") {
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
                <span className="text-[#10b981]">Verifier</span> Dashboard
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-mono text-sm">{publicKey?.slice(0, 12)}...{publicKey?.slice(-8)}</span>
                <button onClick={copyAddress} className="p-1 hover:text-[#10b981] transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Request Verification
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-[#10b981]/20">
                <DialogHeader>
                  <DialogTitle>Request Eligibility Verification</DialogTitle>
                  <DialogDescription>
                    Request a ZK proof from a candidate to verify their eligibility.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Candidate Aleo Address</Label>
                    <Input
                      placeholder="aleo1..."
                      value={requestForm.patientAddress}
                      onChange={(e) => setRequestForm({ ...requestForm, patientAddress: e.target.value })}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label>Verification Type</Label>
                    <Select
                      value={requestForm.proofType}
                      onValueChange={(v) => setRequestForm({ ...requestForm, proofType: v })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select verification type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(VERIFIER_PROOF_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Purpose (Optional)</Label>
                    <Input
                      placeholder="e.g., Pre-employment health check"
                      value={requestForm.purpose}
                      onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSendRequest} className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white">
                    Send Verification Request
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
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Successful</p>
              <p className="text-2xl font-bold">{successfulVerifications}</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Verifications</p>
              <p className="text-2xl font-bold">{totalVerifications}</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00d9ff]/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#00d9ff]" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Success Rate</p>
              <p className="text-2xl font-bold">
                {totalVerifications > 0 ? Math.round((successfulVerifications / totalVerifications) * 100) : 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="verify" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="verify" className="data-[state=active]:bg-[#10b981]/20 data-[state=active]:text-[#10b981]">
              <Shield className="w-4 h-4 mr-2" />
              Verify Eligibility
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-[#10b981]/20 data-[state=active]:text-[#10b981]">
              <Send className="w-4 h-4 mr-2" />
              My Requests
            </TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-[#10b981]/20 data-[state=active]:text-[#10b981]">
              <History className="w-4 h-4 mr-2" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verify">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-6 text-center">Verify Candidate Eligibility</h3>
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label>Candidate Address or Proof ID</Label>
                  <Input placeholder="Enter candidate address or proof ID" className="mt-1 font-mono" />
                </div>
                <div>
                  <Label>Verification Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VERIFIER_PROOF_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={simulateVerification}
                  className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Verify on Aleo Blockchain
                </Button>
                <div className="p-4 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20">
                  <p className="text-center text-sm text-[#10b981]">
                    <Shield className="w-4 h-4 inline mr-2" />
                    ZK Verification ensures no personal data is exposed
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

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
                    Send verification requests to candidates to verify their eligibility.
                  </p>
                  <Button onClick={() => setIsRequestModalOpen(true)} className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white">
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
                          <h3 className="font-semibold mb-1">Eligibility Check</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Candidate: <span className="font-mono">{request.patientAddress.slice(0, 12)}...</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981] text-xs">
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
                            Awaiting Response
                          </span>
                        )}
                        {request.status === "approved" && (
                          <span className="px-3 py-1.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Eligible
                          </span>
                        )}
                        {request.status === "rejected" && (
                          <span className="px-3 py-1.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-sm flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Declined
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="records">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 inline mr-2 text-[#10b981]" />
                  All verification records are ZK-based and contain no personal data
                </p>
              </div>
              {verificationRecords.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Records Yet</h3>
                  <p className="text-muted-foreground">
                    Your verification audit trail will appear here.
                  </p>
                </div>
              ) : (
                verificationRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${record.result ? "bg-[#10b981]/20" : "bg-[#ef4444]/20"} flex items-center justify-center`}>
                          {record.result ? (
                            <CheckCircle className="w-5 h-5 text-[#10b981]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#ef4444]" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{record.proofType.replace(/_/g, " ")}</h4>
                          <p className="text-xs text-muted-foreground">{record.purpose || "General verification"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded ${record.result ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#ef4444]/20 text-[#ef4444]"} text-xs`}>
                          {record.result ? "ELIGIBLE" : "NOT ELIGIBLE"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(record.timestamp).toLocaleString()}
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
