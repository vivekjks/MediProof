"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/favicon.svg" 
                alt="MediProof Logo" 
                width={32} 
                height={32}
              />
              <span className="text-xl font-bold gradient-text">MediProof</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              Prove health facts. Reveal nothing. Built on Aleo for privacy-first medical verification using zero-knowledge proofs.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Built for <span className="text-[#00d9ff]">Aleo WaveHack 2024</span>
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://github.com/mediproof"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-[#00d9ff]/20 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://twitter.com/mediproof"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-[#00d9ff]/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://discord.gg/aleo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-[#00d9ff]/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/select-role" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/dashboard/patient" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors">
                  Patient Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/doctor" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors">
                  Doctor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://aleo.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors flex items-center gap-1">
                  Aleo Network <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://developer.aleo.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors flex items-center gap-1">
                  Developer Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://leo-lang.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors flex items-center gap-1">
                  Leo Language <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://puzzle.online" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors flex items-center gap-1">
                  Puzzle Wallet <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://explorer.aleo.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#00d9ff] text-sm transition-colors flex items-center gap-1">
                  Block Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} MediProof. Built for Aleo WaveHack.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <a href="https://aleo.org" target="_blank" rel="noopener noreferrer" className="gradient-text font-semibold hover:underline">
                Aleo
              </a>
              <span>&</span>
              <span className="text-[#7c3aed] font-semibold">Zero-Knowledge Proofs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
