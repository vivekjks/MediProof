import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { WalletProvider } from "@/context/WalletContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "MediProof - Prove Health Facts. Reveal Nothing.",
    template: "%s | MediProof",
  },
  description: "Privacy-first medical verification using zero-knowledge proofs on Aleo. Own your medical data and selectively prove health facts without exposing full records.",
  keywords: ["medical privacy", "zero-knowledge proofs", "Aleo", "blockchain", "healthcare", "ZK proofs", "medical verification", "HIPAA", "privacy"],
  authors: [{ name: "MediProof Team" }],
  creator: "MediProof",
  publisher: "MediProof",
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mediproof.app",
    siteName: "MediProof",
    title: "MediProof - Prove Health Facts. Reveal Nothing.",
    description: "Privacy-first medical verification using zero-knowledge proofs on Aleo. Own your medical data.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "MediProof - Privacy-First Medical Verification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediProof - Prove Health Facts. Reveal Nothing.",
    description: "Privacy-first medical verification using zero-knowledge proofs on Aleo.",
    images: ["/og-image.svg"],
    creator: "@mediproof",
  },
  category: "Healthcare Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        <WalletProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: "#12121a",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#f0f0f5",
              },
            }}
          />
        </WalletProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
