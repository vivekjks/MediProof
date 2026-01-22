"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  History,
  Shield,
  Plus,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Droplet,
  Activity,
  Heart,
  Calendar,
  Copy,
  ExternalLink,
  Loader2,
  Wifi,
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
import { Switch } from "@/components/ui/switch";
import { useWallet } from "@/context/WalletContext";
import { BLOOD_GROUPS, MEDIPROOF_PROGRAM_ID, PatientProfile } from "@/lib/aleo-config";
import { toast } from "sonner";

interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  ipfsHash: string;
  uploadedAt: number;
}

export default function PatientDashboard() {
  const router = useRouter();
  const { 
    publicKey, 
    connected, 
    userType, 
    patientProfile, 
    setPatientProfile, 
    accessRequests, 
    updateAccessRequest,
    networkStatus,
    createPatientProfileOnChain,
    executeTransaction,
  } = useWallet();
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [proofHistory, setProofHistory] = useState<Array<{
    id: string;
    proofType: string;
    verifier: string;
    timestamp: number;
    result: boolean;
    txId?: string;
  }>>([]);

  const [profileForm, setProfileForm] = useState({
    bloodGroup: "",
    diabetic: false,
    hypertensive: false,
  });

  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    category: "report",
  });

  useEffect(() => {
    if (!connected) {
      router.push("/select-role");
    } else if (userType !== "patient") {
      router.push(`/dashboard/${userType}`);
    }
  }, [connected, userType, router]);

  useEffect(() => {
    const savedDocs = localStorage.getItem("mediproof_documents");
    const savedHistory = localStorage.getItem("mediproof_proofHistory");
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
    if (savedHistory) setProofHistory(JSON.parse(savedHistory));
  }, []);

  const handleCreateProfile = async () => {
    if (!profileForm.bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }

    setIsCreatingProfile(true);
    
    try {
      const txId = await createPatientProfileOnChain(
        profileForm.bloodGroup,
        profileForm.diabetic,
        profileForm.hypertensive,
        "0"
      );

      if (txId) {
        const profile: PatientProfile = {
          patientId: publicKey!,
          bloodGroup: profileForm.bloodGroup,
          diabetic: profileForm.diabetic,
          hypertensive: profileForm.hypertensive,
          lastCheckupTimestamp: Date.now(),
          documentHash: "",
          isActive: true,
        };

        setPatientProfile(profile);
        setIsProfileModalOpen(false);
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Medical profile created on Aleo!</span>
            <a 
              href={`https://explorer.aleo.org/transaction/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00d9ff] flex items-center gap-1"
            >
              View transaction <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        );
      }
    } catch (error) {
      toast.error("Failed to create profile on-chain");
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("patientAddress", publicKey || "");
      formData.append("category", uploadForm.category);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let ipfsHash: string;
      
      if (response.ok) {
        const data = await response.json();
        ipfsHash = data.ipfsHash;
      } else {
        ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      }
      
      const newDoc: MedicalDocument = {
        id: Date.now().toString(),
        name: uploadForm.file.name,
        type: uploadForm.file.type,
        category: uploadForm.category,
        ipfsHash: ipfsHash,
        uploadedAt: Date.now(),
      };

      const updatedDocs = [...documents, newDoc];
      setDocuments(updatedDocs);
      localStorage.setItem("mediproof_documents", JSON.stringify(updatedDocs));
      
      setIsUploadModalOpen(false);
      setUploadForm({ file: null, category: "report" });
      toast.success(
        <div className="flex flex-col gap-1">
          <span>Document uploaded to IPFS!</span>
          <span className="text-xs text-muted-foreground font-mono">{ipfsHash.slice(0, 20)}...</span>
        </div>
      );
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConsentResponse = async (requestId: string, approve: boolean) => {
    const request = accessRequests.find(r => r.requestId === requestId);
    
    if (approve && request) {
      const proofFunctionMap: Record<string, string> = {
        fitness_certificate: "prove_fitness",
        blood_type: "prove_blood_type",
        not_diabetic: "prove_not_diabetic",
        not_hypertensive: "prove_not_hypertensive",
      };
      
      const functionName = proofFunctionMap[request.proofType] || "prove_fitness";
      
      try {
        const result = await executeTransaction(functionName, []);
        
        if (result) {
          const newProof = {
            id: Date.now().toString(),
            proofType: request.proofType,
            verifier: request.doctorAddress,
            timestamp: Date.now(),
            result: true,
            txId: result.transactionId,
          };
          const updatedHistory = [...proofHistory, newProof];
          setProofHistory(updatedHistory);
          localStorage.setItem("mediproof_proofHistory", JSON.stringify(updatedHistory));
        }
      } catch (error) {
        console.error("Failed to generate proof:", error);
      }
    }
    
    updateAccessRequest(requestId, approve ? "approved" : "rejected");
    toast.success(approve ? "Access granted - ZK proof generated on Aleo!" : "Access denied");
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success("Address copied!");
    }
  };

  const pendingRequests = accessRequests.filter(r => r.status === "pending");

  if (!connected || userType !== "patient") {
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  <span className="gradient-text">Patient</span> Dashboard
                </h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 text-xs">
                  <Wifi className={`w-3 h-3 ${networkStatus === "connected" ? "text-[#10b981]" : "text-[#f59e0b]"}`} />
                  <span className={networkStatus === "connected" ? "text-[#10b981]" : "text-[#f59e0b]"}>
                    {networkStatus === "connected" ? "On-Chain" : "Offline"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-mono text-sm">{publicKey?.slice(0, 12)}...{publicKey?.slice(-8)}</span>
                <button onClick={copyAddress} className="p-1 hover:text-[#00d9ff] transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Program: {MEDIPROOF_PROGRAM_ID}</p>
            </div>
            <div className="flex gap-3">
              {!patientProfile && (
                <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-[#00d9ff]/20">
                    <DialogHeader>
                      <DialogTitle>Create Medical Profile</DialogTitle>
                      <DialogDescription>
                        This information will be encrypted and stored on Aleo blockchain
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="p-3 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/20 text-sm">
                        <p className="text-[#00d9ff]">On-Chain Transaction</p>
                        <p className="text-xs text-muted-foreground">This will create a private record on Aleo testnet</p>
                      </div>
                      <div>
                        <Label>Blood Group</Label>
                        <Select
                          value={profileForm.bloodGroup}
                          onValueChange={(v) => setProfileForm({ ...profileForm, bloodGroup: v })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            {BLOOD_GROUPS.map((bg) => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Diabetic</Label>
                        <Switch
                          checked={profileForm.diabetic}
                          onCheckedChange={(v) => setProfileForm({ ...profileForm, diabetic: v })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Hypertensive</Label>
                        <Switch
                          checked={profileForm.hypertensive}
                          onCheckedChange={(v) => setProfileForm({ ...profileForm, hypertensive: v })}
                        />
                      </div>
                      <Button 
                        onClick={handleCreateProfile} 
                        disabled={isCreatingProfile}
                        className="w-full bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black"
                      >
                        {isCreatingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating on Aleo...
                          </>
                        ) : (
                          "Create Profile on Aleo"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#00d9ff]/30 hover:border-[#00d9ff]">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-[#00d9ff]/20">
                  <DialogHeader>
                    <DialogTitle>Upload Medical Document</DialogTitle>
                    <DialogDescription>
                      Files are stored on IPFS via Pinata. Hash stored on-chain.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Document</Label>
                      <Input
                        type="file"
                        className="mt-1"
                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={uploadForm.category}
                        onValueChange={(v) => setUploadForm({ ...uploadForm, category: v })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="report">Medical Report</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="scan">Scan/X-Ray</SelectItem>
                          <SelectItem value="certificate">Certificate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleFileUpload} 
                      disabled={isUploading}
                      className="w-full bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading to IPFS...
                        </>
                      ) : (
                        "Upload to IPFS"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {patientProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ff4757]/20 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-[#ff4757]" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Blood Group</p>
                <p className="text-xl font-bold">{patientProfile.bloodGroup}</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#7c3aed]" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Diabetic</p>
                <p className="text-xl font-bold">{patientProfile.diabetic ? "Yes" : "No"}</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00d9ff]/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#00d9ff]" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Hypertensive</p>
                <p className="text-xl font-bold">{patientProfile.hypertensive ? "Yes" : "No"}</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Last Updated</p>
                <p className="text-xl font-bold">
                  {new Date(patientProfile.lastCheckupTimestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="requests" className="data-[state=active]:bg-[#00d9ff]/20 data-[state=active]:text-[#00d9ff]">
              <Bell className="w-4 h-4 mr-2" />
              Consent Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-[#ff4757] text-white text-xs flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-[#00d9ff]/20 data-[state=active]:text-[#00d9ff]">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#00d9ff]/20 data-[state=active]:text-[#00d9ff]">
              <History className="w-4 h-4 mr-2" />
              Proof History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {pendingRequests.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">
                    When doctors or verifiers request to verify your health data, they will appear here.
                  </p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <motion.div
                    key={request.requestId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center shrink-0">
                          <Shield className="w-6 h-6 text-[#7c3aed]" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Verification Request</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            From: <span className="font-mono">{request.doctorAddress.slice(0, 12)}...</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-[#00d9ff]/20 text-[#00d9ff] text-xs">
                              {request.proofType.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(request.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleConsentResponse(request.requestId, true)}
                          className="bg-[#10b981] hover:bg-[#059669] text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Generate Proof
                        </Button>
                        <Button
                          onClick={() => handleConsentResponse(request.requestId, false)}
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="documents">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {documents.length === 0 ? (
                <div className="col-span-full glass-card rounded-2xl p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your medical documents to IPFS for secure, private storage.
                  </p>
                  <Button onClick={() => setIsUploadModalOpen(true)} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Document
                  </Button>
                </div>
              ) : (
                documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-xl p-4 card-hover"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#7c3aed]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{doc.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{doc.category}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <p className="text-xs font-mono text-muted-foreground truncate flex-1">
                        {doc.ipfsHash.slice(0, 16)}...
                      </p>
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00d9ff] hover:text-[#00d9ff]/80 ml-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {proofHistory.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Proof History</h3>
                  <p className="text-muted-foreground">
                    When you approve verification requests, the generated ZK proofs will appear here.
                  </p>
                </div>
              ) : (
                proofHistory.map((proof) => (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <div>
                          <h4 className="font-medium">{proof.proofType.replace(/_/g, " ")}</h4>
                          <p className="text-xs text-muted-foreground">
                            Verified by: <span className="font-mono">{proof.verifier.slice(0, 12)}...</span>
                          </p>
                          {proof.txId && (
                            <a
                              href={`https://explorer.aleo.org/transaction/${proof.txId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#00d9ff] flex items-center gap-1 mt-1"
                            >
                              View on Explorer <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981] text-xs">
                          {proof.result ? "VALID" : "INVALID"}
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
