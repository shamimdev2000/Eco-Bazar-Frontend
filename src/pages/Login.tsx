import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { Lock, Mail, User, Sprout, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export const Login: React.FC = () => {
  const { user, login, register } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "account";

  // State
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Guard: If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      navigate(`/${redirect === "account" ? "account" : redirect}`);
    }
  }, [user, navigate, redirect]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all email and password fields");
      return;
    }

    setLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        toast.success("Welcome back to Organic Grocery!");
        navigate(`/${redirect === "account" ? "account" : redirect}`);
      }
    } catch (err) {
      // toast.error handled by AppContext / api
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const success = await register(fullName.trim(), email.trim(), password);
      if (success) {
        toast.success("Account created! Welcome to Organic Grocery.");
        navigate(`/${redirect === "account" ? "account" : redirect}`);
      }
    } catch (err) {
      // toast.error handled by AppContext / api
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Account Access" }]} />

      <div className="container-custom pt-8 max-w-md">
        
        <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header tabs toggle */}
          <div className="flex border-b border-gray-150 text-xs font-semibold text-gray-500 bg-gray-50/50">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 text-center border-b-2 transition-standard ${
                activeTab === "login" 
                  ? "border-brand-600 text-brand-700 bg-white font-bold" 
                  : "border-transparent hover:text-gray-850"
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-4 text-center border-b-2 transition-standard ${
                activeTab === "register" 
                  ? "border-brand-600 text-brand-700 bg-white font-bold" 
                  : "border-transparent hover:text-gray-850"
              }`}
            >
              Create New Account
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* Logo and brief title */}
            <div className="text-center space-y-1.5">
              <Sprout className="w-8 h-8 text-brand-600 mx-auto" />
              <h2 className="font-display font-bold text-gray-900 text-base">
                {activeTab === "login" ? "Welcome back" : "Join our Organic co-op"}
              </h2>
              <p className="text-[10px] text-gray-400">
                {activeTab === "login" 
                  ? "Sign in to manage your scheduled deliveries & settings." 
                  : "Save 15% on your first order of organic grocery baskets."
                }
              </p>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. customer@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-brand-500"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase block">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-brand-500"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Simulated test accounts helper block */}
                <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-3 text-[10px] text-brand-850 space-y-1">
                  <span className="font-bold block">Demo Credentials:</span>
                  <p>Email: <strong className="font-mono">demo@demo.com</strong></p>
                  <p>Password: <strong className="font-mono">demo123</strong></p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl text-xs transition-standard shadow shadow-brand-100 disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Sign In to Basket"}
                </button>

              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase block">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Johnathan Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase block">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. customer@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase block">Create Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase block">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="flex items-start space-x-2 text-[10px] text-gray-400 leading-normal">
                  <ShieldCheck className="w-4.5 h-4.5 text-brand-500 shrink-0 mt-0.5" />
                  <span>By creating an account, you agree to receive cold-storage logistics emails and crop updates. We never share customer data.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl text-xs transition-standard shadow shadow-brand-100 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Confirm & Setup Account"}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
