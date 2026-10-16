"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isQuestionnaireCompleted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    console.log("[RouteGuard] Evaluating path:", pathname, {
      isAuthenticated: !!user,
      isQuestionnaireCompleted,
    });

    // 1. Gating logged-in users who have NOT completed the questionnaire
    const isLoginOrHomeOrQuestionnaire = pathname === "/questionnaire" || pathname === "/login" || pathname === "/";
    if (user && !isQuestionnaireCompleted && !isLoginOrHomeOrQuestionnaire) {
      console.log("[RouteGuard] Gating user to /questionnaire");
      router.replace("/questionnaire");
      return;
    }

    // 2. Protect authenticated paths from anonymous users
    const isProtectedRoute = 
      pathname?.startsWith("/chat") || 
      pathname?.startsWith("/saved") || 
      pathname?.startsWith("/about") || 
      pathname?.startsWith("/dashboard") || 
      pathname?.startsWith("/scholarships") || 
      pathname === "/questionnaire";
      
    if (!user && isProtectedRoute) {
      console.log("[RouteGuard] Protecting route, redirecting to /login");
      router.replace("/login");
      return;
    }

    // 3. Redirect logged-in users away from / and /login to the app dashboard
    if (user && (pathname === "/" || pathname === "/login")) {
      if (isQuestionnaireCompleted) {
        console.log("[RouteGuard] Authenticated user on auth/home path, redirecting to /dashboard");
        router.replace("/dashboard");
      } else {
        console.log("[RouteGuard] Authenticated user on auth/home path with incomplete profile, redirecting to /questionnaire");
        router.replace("/questionnaire");
      }
    }
  }, [user, loading, isQuestionnaireCompleted, pathname, router]);

  // Premium Neo-Brutalist loading block visualizer during session initialization
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <div className="flex gap-2 items-center justify-center h-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-3.5 h-6 bg-bauhaus-red brutal-shadow-xs"
              animate={{ opacity: [0.15, 1, 0.15], scaleY: [0.8, 1.2, 0.8] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">Loading Session...</span>
      </div>
    );
  }

  return <>{children}</>;
}
