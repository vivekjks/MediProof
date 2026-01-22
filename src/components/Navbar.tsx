"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Wallet, LogOut, User, Stethoscope, Building2, Puzzle } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { MEDIPROOF_PROGRAM_ID } from "@/lib/aleo-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/features", label: "Features" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { publicKey, connected, connecting, userType, walletType, networkStatus, connect, disconnect } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getDashboardLink = () => {
    switch (userType) {
      case "patient":
        return "/dashboard/patient";
      case "doctor":
        return "/dashboard/doctor";
      case "verifier":
        return "/dashboard/verifier";
      default:
        return "/select-role";
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Image 
                src="/favicon.svg" 
                alt="MediProof Logo" 
                width={32} 
                height={32}
                className="transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#00d9ff] blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="text-xl font-bold gradient-text">MediProof</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#00d9ff]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00d9ff] to-[#7c3aed]"
                  />
                )}
              </Link>
            ))}
          </div>

            <div className="hidden md:flex items-center gap-3">
              {connected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-[#00d9ff]/30 hover:border-[#00d9ff]">
                    {walletType === "puzzle" ? (
                      <Puzzle className="w-4 h-4 text-[#7c3aed]" />
                    ) : (
                      <Wallet className="w-4 h-4 text-[#00d9ff]" />
                    )}
                    <span className="font-mono text-sm">{truncateAddress(publicKey!)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 glass-card border-[#00d9ff]/20">
                  <div className="px-2 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">Connected via {walletType === "puzzle" ? "Puzzle" : "Leo"} Wallet</p>
                    <p className="text-xs font-mono text-[#00d9ff] truncate">{publicKey}</p>
                    <p className="text-xs text-muted-foreground mt-1">Program: {MEDIPROOF_PROGRAM_ID}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center gap-2 cursor-pointer">
                      {userType === "patient" && <User className="w-4 h-4" />}
                      {userType === "doctor" && <Stethoscope className="w-4 h-4" />}
                      {userType === "verifier" && <Building2 className="w-4 h-4" />}
                      {!userType && <User className="w-4 h-4" />}
                      {userType ? `${userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard` : "Select Role"}
                    </Link>
                  </DropdownMenuItem>
                  {!userType && (
                    <DropdownMenuItem asChild>
                      <Link href="/select-role" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        Select Role
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={disconnect} className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => connect("puzzle")}
                disabled={connecting}
                className="btn-glow bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black font-semibold hover:opacity-90"
              >
                {connecting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                    />
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4" />
                    Connect Puzzle
                  </span>
                )}
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass-card border-t border-border"
        >
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-2 ${
                  pathname === link.href
                    ? "text-[#00d9ff]"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              {connected ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    <p>Connected: {walletType === "puzzle" ? "Puzzle" : "Leo"} Wallet</p>
                    <p className="font-mono truncate">{publicKey}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      disconnect();
                      setMobileMenuOpen(false);
                    }}
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    connect("puzzle");
                    setMobileMenuOpen(false);
                  }}
                  disabled={connecting}
                  className="w-full btn-glow bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-black font-semibold"
                >
                  {connecting ? "Connecting..." : "Connect Puzzle Wallet"}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
