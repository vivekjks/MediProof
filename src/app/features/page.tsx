"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  Zap,
  Clock,
  Globe,
  Users,
  Database,
  Key,
  Fingerprint,
  Bell,
  History,
  Settings,
  CheckCircle2,
} from "lucide-react";

const coreFeatures = [
  {
    icon: Shield,
    title: "Patient Data Ownership",
    description: "You own your medical data. It's encrypted with your keys and stored on your terms.",
    gradient: "from-[#00d9ff] to-[#0099cc]",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All medical metadata is encrypted on Aleo. Only you can decrypt and share it.",
    gradient: "from-[#7c3aed] to-[#5b21b6]",
  },
  {
    icon: Eye,
    title: "Selective Disclosure",
    description: "Choose exactly what to prove. Share blood type without revealing other conditions.",
    gradient: "from-[#ec4899] to-[#be185d]",
  },
  {
    icon: FileCheck,
    title: "Verifiable Proofs",
    description: "Zero-knowledge proofs that anyone can verify without seeing the underlying data.",
    gradient: "from-[#10b981] to-[#059669]",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description: "ZK proofs are generated and verified in seconds, not hours or days.",
    gradient: "from-[#f59e0b] to-[#d97706]",
  },
  {
    icon: Clock,
    title: "Time-Limited Access",
    description: "Grant temporary access that automatically expires. No need to remember to revoke.",
    gradient: "from-[#06b6d4] to-[#0891b2]",
  },
];

const technicalFeatures = [
  {
    icon: Database,
    title: "IPFS Document Storage",
    description: "Medical documents stored on IPFS via Pinata. Only hashes stored on-chain for integrity verification.",
  },
  {
    icon: Key,
    title: "Aleo Encrypted State",
    description: "Patient profiles, medical attributes, and consent rules stored as encrypted state on Aleo.",
  },
  {
    icon: Fingerprint,
    title: "Leo Smart Contracts",
    description: "Privacy-preserving smart contracts written in Leo that generate and verify ZK proofs.",
  },
  {
    icon: Globe,
    title: "Cross-Platform Access",
    description: "Access your medical proofs from any device. Your data follows you, not your hospital.",
  },
];

const userFeatures = {
  patients: [
    { icon: Users, title: "Profile Management", description: "Create and manage your encrypted medical profile" },
    { icon: FileCheck, title: "Document Upload", description: "Securely upload medical records to IPFS" },
    { icon: Bell, title: "Consent Requests", description: "Review and respond to access requests" },
    { icon: History, title: "Access History", description: "See who has verified your data and when" },
    { icon: Settings, title: "Privacy Controls", description: "Fine-grained control over what's shareable" },
  ],
  doctors: [
    { icon: Users, title: "Patient Search", description: "Find patients by Aleo address" },
    { icon: Eye, title: "Request Proofs", description: "Request specific health verifications" },
    { icon: FileCheck, title: "Verify Proofs", description: "Cryptographically verify patient claims" },
    { icon: History, title: "Request History", description: "Track all your verification requests" },
  ],
  verifiers: [
    { icon: Shield, title: "Compliance Verification", description: "Verify health requirements for employment" },
    { icon: FileCheck, title: "Insurance Eligibility", description: "Check medical fitness without full disclosure" },
    { icon: History, title: "Audit Trail", description: "Maintain verifiable records of all checks" },
  ],
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen mesh-gradient py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for privacy-preserving medical verification
          </p>
        </motion.div>

        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-center">
              Core <span className="gradient-text">Privacy Features</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-center">
              Technical <span className="gradient-text-accent">Infrastructure</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d9ff]/20 to-[#7c3aed]/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-[#00d9ff]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-center">
              Features by <span className="gradient-text">User Type</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#7c3aed] flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Patient Dashboard</h3>
              </div>
              <div className="space-y-4">
                {userFeatures.patients.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00d9ff]/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-4 h-4 text-[#00d9ff]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-muted-foreground text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Doctor Dashboard</h3>
              </div>
              <div className="space-y-4">
                {userFeatures.doctors.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-4 h-4 text-[#7c3aed]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-muted-foreground text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Verifier Dashboard</h3>
              </div>
              <div className="space-y-4">
                {userFeatures.verifiers.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-muted-foreground text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Why <span className="gradient-text">Aleo</span> Makes This Possible
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Encrypted State</h4>
                    <p className="text-muted-foreground text-sm">Unlike other blockchains, Aleo keeps your data encrypted by default</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Zero-Knowledge Proofs</h4>
                    <p className="text-muted-foreground text-sm">Native ZK proof generation and verification built into the protocol</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Selective Disclosure</h4>
                    <p className="text-muted-foreground text-sm">Prove specific facts about your data without revealing everything</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Off-chain Execution</h4>
                    <p className="text-muted-foreground text-sm">Compute privately, verify publicly - best of both worlds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Leo Language</h4>
                    <p className="text-muted-foreground text-sm">Developer-friendly language for writing private smart contracts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Compliance Ready</h4>
                    <p className="text-muted-foreground text-sm">Meet regulatory requirements through selective disclosure</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
