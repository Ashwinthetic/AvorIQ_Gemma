"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, isFirebaseConfigured } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getReadableErrorMessage = (err: any) => {
    const code = err?.code || "";
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/user-disabled":
        return "This user account has been disabled.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "An account already exists with this email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-credential":
        return "Invalid credentials provided.";
      case "auth/popup-closed-by-user":
        return "Sign-in popup closed before completion.";
      case "auth/popup-blocked":
        return "Google sign-in popup was blocked. Redirecting you to sign in instead...";
      default:
        return err?.message || "An unexpected error occurred. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      router.push("/chat");
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      setError(getReadableErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/chat");
    } catch (err: any) {
      console.error("Firebase Google auth error:", err);
      setError(getReadableErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-20">
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-surface border-2 border-foreground brutal-shadow-lg p-8 sm:p-10 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-bauhaus-red text-white flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-foreground text-xl font-black uppercase tracking-wider">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-slate-500 text-xs uppercase tracking-wider mt-2 font-bold">
              {isLogin ? "Access your AI scholarship companion." : "Join AvorIQ to find opportunities."}
            </p>
          </div>

          {/* Preview Warning Banner */}
          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-bauhaus-yellow/10 border-2 border-bauhaus-yellow text-bauhaus-yellow text-[10px] font-black uppercase tracking-widest relative brutal-shadow-sm text-center">
              ⚠️ PREVIEW MODE: Configure `.env.local` & restart dev server for real Firebase Auth.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-bauhaus-red/10 border-2 border-bauhaus-red text-bauhaus-red text-xs font-bold uppercase tracking-wider">
              <span className="block">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-foreground text-[10px] font-black uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="STUDENT@EXAMPLE.COM"
                  className="w-full pl-10 pr-4 py-3 bg-surface-2 border-2 border-[#333] text-foreground text-sm font-bold uppercase tracking-wider focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] transition-all outline-none placeholder:text-slate-600 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground text-[10px] font-black uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-surface-2 border-2 border-[#333] text-foreground text-sm focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] transition-all outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-black uppercase tracking-widest text-white bg-bauhaus-red border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all flex items-center justify-center gap-2 cursor-pointer brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#D92A2A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-[2px] bg-[#333] flex-1" />
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Or</span>
            <div className="h-[2px] bg-[#333] flex-1" />
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2.5 py-3.5 bg-surface-2 border-2 border-[#333] text-foreground text-xs font-black uppercase tracking-widest hover:border-foreground hover:shadow-[3px_3px_0px_0px_#333] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Sign In With Google
            </button>
          </div>

          {/* Toggle */}
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-wider mt-8">
            {isLogin ? "No account?" : "Have one?"}{" "}
            <button
              disabled={loading}
              onClick={() => {
                setError(null);
                setIsLogin(!isLogin);
              }}
              className="text-bauhaus-red font-black hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
