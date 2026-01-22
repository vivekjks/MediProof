"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Stethoscope, Building2, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";


const roles = [
  {
    id: "patient",
    title: "Patient",
    icon: User,
    description: "Own your medical data and control who can verify your health facts",
    features: [
      "Create encrypted medical profile",
      "Upload medical documents to IPFS",
      "Manage consent requests",
      "Generate ZK proofs for verifiers",
    ],
    gradient: "from-[#00d9ff] to-[#7c3aed]",
    hoverBorder: "hover:border-[#00d9ff]",
  },
  {
    id: "doctor",
    title: "Doctor / Hospital",
    icon: Stethoscope,
    description: "Request and verify patient health facts without accessing raw data",
    features: [
      "Request patient verifications",
      "Receive ZK proofs",
      "No data storage liability",
      "Instant cryptographic verification",
    ],
    gradient: "from-[#7c3aed] to-[#ec4899]",
    hoverBorder: "hover:border-[#7c3aed]",
  },
  {
    id: "verifier",
    title: "Verifier / Insurance",
    icon: Building2,
    description: "Verify health requirements for employment, insurance, or compliance",
    features: [
      "Request eligibility proofs",
      "Verify medical fitness",
      "Compliance-ready verification",
      "No personal data exposure",
    ],
    gradient: "from-[#10b981] to-[#059669]",
    hoverBorder: "hover:border-[#10b981]",
  },
];

export default function SelectRolePage() {
  const router = useRouter();
  const { connected, connect, connecting, setUserType } = useWallet();

  const handleRoleSelect = (roleId: "patient" | "doctor" | "verifier") => {
    if (!connected) {
      connect().then(() => {
        setUserType(roleId);
        router.push(`/dashboard/${roleId}`);
      });
    } else {
      setUserType(roleId);
      router.push(`/dashboard/${roleId}`);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Shield className="w-4 h-4 text-[#00d9ff]" />
            <span className="text-sm text-muted-foreground">
              {connected ? "Wallet Connected" : "Connect Wallet to Continue"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Role</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select how you want to use MediProof. Each role has different features and permissions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card rounded-2xl p-8 border border-transparent ${role.hoverBorder} transition-all duration-300 card-hover`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{role.title}</h2>
              <p className="text-muted-foreground text-sm mb-6">{role.description}</p>
              
              <div className="space-y-3 mb-8">
                {role.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => handleRoleSelect(role.id as "patient" | "doctor" | "verifier")}
                disabled={connecting}
                className={`w-full bg-gradient-to-r ${role.gradient} ${role.id === "patient" ? "text-black" : "text-white"} font-semibold`}
              >
                {connecting ? (
                  "Connecting..."
                ) : connected ? (
                  <>
                    Continue as {role.title.split(" ")[0]}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Connect & Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            You can change your role anytime from your dashboard settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
