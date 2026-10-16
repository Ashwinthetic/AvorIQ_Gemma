"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { siteContent } from "../data/siteContent";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const isLandingPage = pathname === "/";

  // Track scroll for transparent → solid navbar transition on landing
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when profile modal is open
  useEffect(() => {
    if (showProfileModal) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showProfileModal]);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  // Filtered nav links: only show when user is logged in
  const visibleLinks = user
    ? siteContent.navLinks.filter((link) => link.href !== "/")
    : [];

  if (pathname?.startsWith("/chat")) {
    return null;
  }

  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLandingPage && !scrolled
          ? "bg-transparent border-b border-white/5"
          : "bg-background/95 backdrop-blur-md border-b-2 border-foreground/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 group"
          >
            {/* SVG logo inline for clarity at any size */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-9 h-9 shrink-0"
            >
              <polygon
                points="32,6 6,58 22,58 28,44 36,44 42,58 58,58"
                fill="#D92A2A"
              />
              <polygon points="32,22 26,40 38,40" fill="#0A0A0A" />
              <circle cx="50" cy="14" r="10" fill="#EAB308" />
              <circle cx="50" cy="14" r="4" fill="#0A0A0A" />
            </svg>
            <span className="text-foreground font-black text-xl uppercase tracking-wider select-none">
              AVOR<span className="text-bauhaus-red">IQ</span>
            </span>
          </Link>

          {/* ── Desktop Nav (only when logged in) ── */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {visibleLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${
                    isActive(link.href)
                      ? "text-bauhaus-red border-bauhaus-red"
                      : "text-slate-400 border-transparent hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/chat">
                  <button className="px-5 py-2 bg-foreground text-background text-[11px] font-black uppercase tracking-widest border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all cursor-pointer">
                    AI Chat
                  </button>
                </Link>

                {/* Profile Button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-foreground/30 bg-surface-2 text-foreground hover:border-foreground transition-all cursor-pointer text-[11px] font-black uppercase tracking-widest"
                  title="View Profile"
                >
                  <div className="w-5 h-5 bg-bauhaus-red text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    {user.displayName?.substring(0, 1) ||
                      user.email?.substring(0, 1).toUpperCase() ||
                      "U"}
                  </div>
                  <span>Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-bauhaus-red text-white text-[11px] font-black uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* Landing page: just Login / Join Now */
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login">
                  <button className="px-6 py-2.5 bg-bauhaus-red text-white text-[11px] font-black uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all cursor-pointer">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground border border-foreground/30 hover:bg-foreground hover:text-background transition-all"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-foreground/10 bg-background/98 backdrop-blur-lg overflow-hidden"
          >
            <div className="py-4 px-4 space-y-1">
              {user ? (
                <>
                  {visibleLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 text-sm font-black uppercase tracking-widest transition-all border-l-3 ${
                        isActive(link.href)
                          ? "text-bauhaus-red border-bauhaus-red bg-bauhaus-red/5"
                          : "text-slate-400 border-transparent hover:text-foreground hover:border-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full text-left block px-4 py-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-foreground border-l-3 border-transparent"
                  >
                    View Profile
                  </button>

                  <Link
                    href="/chat"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-foreground border-l-3 border-transparent"
                  >
                    AI Chat
                  </Link>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full mt-4 px-4 py-3 bg-bauhaus-red text-white text-sm font-black uppercase tracking-widest text-center border-2 border-bauhaus-red cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block mt-2 px-4 py-3 bg-bauhaus-red text-white text-sm font-black uppercase tracking-widest text-center border-2 border-bauhaus-red"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

      {/* ── User Profile Modal ── */}
      <AnimatePresence>
        {showProfileModal && user && (
          <div className="fixed inset-0 z-[100] overflow-y-auto flex justify-center items-start pt-20 pb-8 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-surface border-3 border-foreground p-6 brutal-shadow-lg z-50 text-foreground flex flex-col max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 border-b-2 border-[#333] pb-4">
                <h3 className="font-black text-lg uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-bauhaus-yellow" />
                  Your Profile
                </h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-1 border-2 border-transparent hover:border-foreground text-slate-400 hover:text-foreground transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Fields */}
              <div className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                {userProfile?.name && (
                  <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                    <span>Full Name</span>
                    <span className="text-foreground font-black">
                      {userProfile.name}
                    </span>
                  </div>
                )}

                <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                  <span>Email</span>
                  <span
                    className="text-foreground text-right truncate max-w-[200px]"
                    title={user.email}
                  >
                    {user.email}
                  </span>
                </div>

                {userProfile ? (
                  <>
                    <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                      <span>Education Level</span>
                      <span className="text-foreground">
                        {userProfile.educationLevel}
                      </span>
                    </div>
                    <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                      <span>Gender</span>
                      <span className="text-foreground">
                        {userProfile.gender}
                      </span>
                    </div>
                    <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                      <span>Region / State</span>
                      <span className="text-foreground">
                        {userProfile.state}
                      </span>
                    </div>
                    <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                      <span>Category / Caste</span>
                      <span className="text-foreground">
                        {userProfile.caste}
                      </span>
                    </div>
                    <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                      <span>Family Income</span>
                      <span className="text-foreground">
                        ₹{(userProfile.familyIncomeMax !== undefined ? userProfile.familyIncomeMax : userProfile.familyIncome)?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {userProfile.collegeName && (
                      <div className="p-3 bg-surface-2 border-2 border-[#333] flex flex-col gap-1 items-start">
                        <span>College / University</span>
                        <span className="text-foreground text-left leading-normal">
                          {userProfile.collegeName}
                        </span>
                      </div>
                    )}
                    {userProfile.enrollmentNumber && (
                      <div className="p-3 bg-surface-2 border-2 border-[#333] flex justify-between items-center">
                        <span>Enrollment No</span>
                        <span className="text-foreground">
                          {userProfile.enrollmentNumber}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-bauhaus-yellow/5 border-2 border-bauhaus-yellow text-bauhaus-yellow text-center">
                    Profile questionnaire not completed yet.
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-8 pt-4 border-t-2 border-[#333] flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    router.push("/questionnaire");
                  }}
                  className="flex-1 min-w-[110px] py-2.5 bg-bauhaus-yellow border-2 border-foreground text-black text-[10px] font-black uppercase tracking-wider hover:bg-transparent hover:text-bauhaus-yellow transition-all cursor-pointer brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    logout();
                  }}
                  className="flex-1 min-w-[110px] py-2.5 bg-bauhaus-red border-2 border-foreground text-white text-[10px] font-black uppercase tracking-wider hover:bg-transparent hover:text-bauhaus-red transition-all cursor-pointer brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="py-2.5 px-4 border-2 border-[#333] text-slate-400 hover:border-foreground hover:text-foreground text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
