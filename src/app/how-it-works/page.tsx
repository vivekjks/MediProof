"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  FileUp,
  Bell,
  CheckCircle,
  Shield,
  Search,
  FileCheck,
  ArrowRight,
  Database,
  Lock,
  Eye,
  Fingerprint,
} from "lucide-react";

const patientSteps = [
  {
    step: 1,
    icon: Wallet,
    title: "Connect Aleo Wallet",
    description: "Connect your Leo wallet to create your encrypted medical profile on the Aleo blockchain.",
    color: "#00d9ff",
  },
  {
    step: 2,
    icon: FileUp,
    title: "Upload Medical Records",
    description: "Upload your medical documents to IPFS. Only the hash is stored on-chain, keeping your files private.",
    color: "#7c3aed",
  },
  {
    step: 3,
    icon: Bell,
    title: "Receive Access Requests",
    description: "When a doctor or verifier needs to verify something, you'll receive a consent request.",
    color: "#ec4899",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Grant Selective Access",
    description: "Approve requests with specific proof types. The verifier only sees YES/NO, never your raw data.",
    color: "#10b981",
  },
];

const doctorSteps = [
  {
    step: 1,
    icon: Wallet,
    title: "Register as Doctor",
    description: "Connect your wallet and register as a verified medical institution or practitioner.",
    color: "#00d9ff",
  },
  {
    step: 2,
    icon: Search,
    title: "Request Verification",
    description: "Search for a patient by their Aleo address and request the specific proof you need.",
    color: "#7c3aed",
  },
  {
    step: 3,
    icon: Shield,
    title: "Patient Approves",
    description: "The patient receives your request and decides whether to grant access.",
    color: "#ec4899",
  },
  {
    step: 4,
    icon: FileCheck,
    title: "Verify ZK Proof",
    description: "Receive a cryptographic proof that verifies the health fact without exposing data.",
    color: "#10b981",
  },
];

const technicalFlow = [
  {
    icon: Database,
    title: "Off-Chain Storage",
    description: "Medical documents stored on IPFS/Pinata",
    details: "Large files never touch the blockchain",
  },
  {
    icon: Lock,
    title: "On-Chain Encryption",
    description: "Metadata encrypted on Aleo",
    details: "Blood type, conditions, test results as encrypted state",
  },
  {
    icon: Eye,
    title: "ZK Proof Generation",
    description: "Leo program generates proof",
    details: "Proves fact without revealing data",
  },
  {
    icon: Fingerprint,
    title: "Public Verification",
    description: "Anyone can verify the proof",
    details: "Cryptographic guarantee of truth",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen mesh-gradient py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How <span className="gradient-text">MediProof</span> Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A step-by-step guide to privacy-preserving medical verification
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
              <span className="gradient-text">Patient</span> Flow
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Take control of your medical data in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {patientSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 relative"
              >
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {step.step}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < patientSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
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
              <span className="gradient-text-accent">Doctor</span> Flow
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Verify patient health facts without storing sensitive data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 relative"
              >
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {step.step}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < doctorSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
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
              Technical <span className="gradient-text">Architecture</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Understanding where data lives and how privacy is maintained
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {technicalFlow.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#00d9ff]/20 to-[#7c3aed]/20 flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-[#00d9ff]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-foreground text-sm mb-2">{item.description}</p>
                <p className="text-muted-foreground text-xs">{item.details}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-6 text-center">Data Storage Model</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Data Type</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Storage Location</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Medical Documents (PDF, scans)</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-[#7c3aed]/20 text-[#7c3aed] text-sm">Off-chain (IPFS)</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Large files, private storage</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Medical Metadata (age, conditions)</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-[#00d9ff]/20 text-[#00d9ff] text-sm">Aleo (Encrypted)</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Privacy-preserving state</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Access Permissions</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-[#00d9ff]/20 text-[#00d9ff] text-sm">Aleo Smart Contract</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Trustless consent management</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Verification Proofs</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981] text-sm">Aleo ZK Proofs</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Publicly verifiable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-center">
              Example <span className="gradient-text">ZK Proofs</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              What patients can prove without revealing their actual data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                proof: '"I tested COVID negative in the last 30 days"',
                hidden: "Full test report, hospital name, exact date",
              },
              {
                proof: '"My blood sugar is below 126 mg/dL"',
                hidden: "Exact value, medical history, doctor notes",
              },
              {
                proof: '"I have no infectious diseases"',
                hidden: "Complete medical records, past conditions",
              },
              {
                proof: '"I am medically fit for employment"',
                hidden: "Specific health conditions, medications",
              },
              {
                proof: '"My blood type is O+"',
                hidden: "Other blood test results, medical history",
              },
              {
                proof: '"I am fully vaccinated"',
                hidden: "Vaccination dates, locations, batch numbers",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#10b981]/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  </div>
                  <p className="text-foreground font-medium">{item.proof}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    <span className="text-destructive font-medium">Hidden:</span> {item.hidden}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
