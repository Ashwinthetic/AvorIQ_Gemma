import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import { RouteGuard } from "../components/RouteGuard";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AvorIQ | AI Scholarship Companion for Indian Students",
  description: "AvorIQ helps Indian students from Class 6 to Graduation discover scholarships they actually qualify for before deadlines pass.",
  keywords: ["Scholarships", "Indian Students", "AI Education", "Class 6 to Graduation", "Scholarship Eligibility"],
  authors: [{ name: "AvorIQ Team" }],
  openGraph: {
    title: "AvorIQ - Find Scholarships Meant For You",
    description: "Discover matching Indian scholarships, check eligibility, track deadlines, and receive AI-driven support.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen flex flex-col bg-background text-foreground antialiased relative font-sans`}>
        <AuthProvider>
          <ChatProvider>
            <RouteGuard>
              {/* ── Rich Background Layers ── */}
              <div className="mesh-bg" />
              <div className="vignette-bg" />
              <div className="noise-bg" />
              
              {/* Floating geometric parallax shapes */}
              <div className="parallax-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
                <div className="shape shape-4" />
                <div className="shape shape-5" />
                <div className="glow-orb-red" />
                <div className="glow-orb-yellow" />
              </div>
              
              <Navbar />

              <main className="flex-1 flex flex-col justify-start relative bg-background z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {children}
              </main>

              <Footer />
            </RouteGuard>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
