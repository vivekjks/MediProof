"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  Database,
  Key,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Lock,
    title: "Encrypted by Default",
    description: "All medical data is encrypted on Aleo's blockchain. Only you control who sees what.",
    gradient: "from-[#00d9ff] to-[#0099cc]",
  },
  {
    icon: Eye,
    title: "Selective Disclosure",
    description: "Prove specific health facts without revealing your complete medical history.",
    gradient: "from-[#7c3aed] to-[#5b21b6]",
  },
  {
    icon: FileCheck,
    title: "Verifiable Proofs",
    description: "Cryptographic proofs that can be verified by anyone without exposing raw data.",
    gradient: "from-[#ec4899] to-[#be185d]",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description: "Zero-knowledge proofs are generated and verified in seconds, not hours.",
    gradient: "from-[#10b981] to-[#059669]",
  },
];

const useCases = [
  "Prove COVID vaccination without showing medical records",
  "Verify fitness for employment without exposing health history",
  "Confirm blood type for emergencies privately",
  "Share test results with doctors selectively",
  "Insurance eligibility without full disclosure",
];

const stats = [
  { value: "100%", label: "Private" },
  { value: "0", label: "Data Exposed" },
  { value: "∞", label: "Control" },
];

export default function HomePage() {
  const { connected, connect, connecting, userType } = useWallet();

  return (
    <div className="min-h-screen mesh-gradient">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d9ff]/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7c3aed]/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-sm text-muted-foreground">Built on Aleo for WaveHack</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="gradient-text">Prove Health Facts.</span>
              <br />
              <span className="text-foreground">Reveal Nothing.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
            >
              The first privacy-preserving medical verification system. 
              Own your data. Control your privacy. Powered by zero-knowledge proofs.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {connected ? (
                <Link href={userType ? `/dashboard/${userType}` : "/select-role"}>
                  <Button
                    size="lg"
                    className="btn-glow bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black font-semibold text-lg px-8 py-6"
                  >
                    {userType ? "Go to Dashboard" : "Get Started"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={connect}
                  disabled={connecting}
                  size="lg"
                  className="btn-glow bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black font-semibold text-lg px-8 py-6"
                >
                  {connecting ? "Connecting..." : "Connect Wallet"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#00d9ff]/30 hover:border-[#00d9ff] text-lg px-8 py-6"
                >
                  Learn How It Works
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-16 flex justify-center gap-12 md:gap-20"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-[#00d9ff] animate-bounce" />
          </div>
        </motion.div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">MediProof</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Traditional systems expose your data. Blockchains make it worse. 
              MediProof gives you control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
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
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7c3aed]/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                The <span className="gradient-text-accent">Problem</span> with 
                Medical Data Today
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Hospitals store your medical data in centralized databases. 
                  This data gets leaked, sold, and accessed without your consent.
                </p>
                <p>
                  Traditional blockchains make it worse by putting everything 
                  publicly visible forever.
                </p>
                <p className="text-foreground font-medium">
                  You don&apos;t own your data. You don&apos;t control who sees it.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 gradient-text">
                The MediProof Solution
              </h3>
              <div className="space-y-4">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                    <span className="text-foreground">{useCase}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How <span className="gradient-text">Zero-Knowledge</span> Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Prove facts about your data without revealing the data itself
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#00d9ff] to-[#0099cc] flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Store Encrypted</h3>
              <p className="text-muted-foreground">
                Your medical metadata is stored encrypted on Aleo. 
                Only you can decrypt it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center mb-6">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Generate Proof</h3>
              <p className="text-muted-foreground">
                When verification is needed, a ZK proof is generated 
                that proves specific facts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mb-6">
                <Fingerprint className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Verify Privately</h3>
              <p className="text-muted-foreground">
                Verifiers confirm the proof is valid. 
                They never see your actual data.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              For <span className="gradient-text">Everyone</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#7c3aed] flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Patients</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Own your medical data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Control who sees what
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Grant time-limited access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Revoke consent anytime
                </li>
              </ul>
              <Link href="/select-role">
                <Button className="w-full mt-6 bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black">
                  Join as Patient
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-8 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Doctors</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Request specific verifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Get cryptographic proofs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  No liability for data storage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Instant verification
                </li>
              </ul>
              <Link href="/select-role">
                <Button className="w-full mt-6 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white">
                  Join as Doctor
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verifiers</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Insurance companies
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Employers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Labs & research
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Compliant verification
                </li>
              </ul>
              <Link href="/select-role">
                <Button className="w-full mt-6 bg-gradient-to-r from-[#10b981] to-[#059669] text-white">
                  Join as Verifier
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/10 via-transparent to-[#7c3aed]/10" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Take Control of Your 
                <span className="gradient-text"> Medical Privacy</span>?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join the future of healthcare privacy. 
                Your data, your rules, powered by zero-knowledge cryptography.
              </p>
              
              {connected ? (
                <Link href={userType ? `/dashboard/${userType}` : "/select-role"}>
                  <Button
                    size="lg"
                    className="btn-glow bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black font-semibold text-lg px-12 py-6"
                  >
                    {userType ? "Open Dashboard" : "Choose Your Role"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={connect}
                  disabled={connecting}
                  size="lg"
                  className="btn-glow bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black font-semibold text-lg px-12 py-6"
                >
                  {connecting ? "Connecting..." : "Connect Wallet to Start"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
