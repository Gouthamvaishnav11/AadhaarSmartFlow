import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  User,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  IdCard,
  Fingerprint,
  ArrowRight,
  Phone
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

type LoginType = "user" | "officer";
type OfficerLoginMethod = "email" | "officerId" | "mobile";

const BASE_URL = "/api";

const Login = () => {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState<LoginType>("user");
  const [showPassword, setShowPassword] = useState(false);

  // User login
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // Officer login
  const [officerLoginMethod, setOfficerLoginMethod] =
    useState<OfficerLoginMethod>("email");
  const [email, setEmail] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [officerPassword, setOfficerPassword] = useState("");

  const formatAadhaar = (value: string) =>
    value.replace(/\D/g, "").slice(0, 12).replace(/(.{4})/g, "$1 ").trim();

  const formatMobile = (value: string) =>
    value.replace(/\D/g, "").slice(0, 10);

  /* ================= USER LOGIN ================= */
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_type: "user",
          aadhaar_id: aadhaarNumber.replace(/\s/g, ""),
          password: userPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "User login failed");
    }
  };

  /* ================= OFFICER LOGIN ================= */
  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (officerLoginMethod !== "email") {
      alert("Only Email login is supported currently");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_type: "officer",
          email: email.trim(),
          password: officerPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("officer", JSON.stringify(data.user));

      navigate("/officer/dashboard");
    } catch (err: any) {
      alert(err.message || "Officer login failed");
    }
  };

  const isUserFormValid =
    aadhaarNumber.replace(/\s/g, "").length === 12 &&
    userPassword.length >= 6;

  const isOfficerFormValid =
    email.trim().length > 0 && officerPassword.length >= 6;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative container mx-auto px-4 py-8 md:py-12">
          <div className="flex justify-center mb-8">
            <Logo variant="light" size="lg" />
          </div>

          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">
              Intelligent Demographic Update
              <span className="block text-accent">Optimization System</span>
            </h1>
            <p className="text-primary-foreground/70 text-sm md:text-base">
              Secure, efficient, and transparent Aadhaar demographic updates
            </p>
          </div>

          {/* Floating Icons */}
          <div className="hidden md:block absolute top-20 left-20 animate-float">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg flex items-center justify-center">
              <Shield className="text-primary-foreground" size={28} />
            </div>
          </div>
          <div className="hidden md:block absolute bottom-20 right-20 animate-float" style={{ animationDelay: "2s" }}>
            <div className="w-14 h-14 rounded-2xl bg-accent/20 backdrop-blur-lg flex items-center justify-center">
              <Fingerprint className="text-accent" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="container mx-auto px-4 -mt-8 pb-12 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Login Type Toggle */}
            <div className="grid grid-cols-2 border-b border-border">
              <button
                onClick={() => setLoginType("user")}
                className={cn(
                  "flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all",
                  loginType === "user"
                    ? "bg-primary/5 text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <User size={18} />
                Aadhaar Holder
              </button>
              <button
                onClick={() => setLoginType("officer")}
                className={cn(
                  "flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all",
                  loginType === "officer"
                    ? "bg-primary/5 text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Briefcase size={18} />
                UIDAI Officer
              </button>
            </div>

            <div className="p-6 md:p-8">
              {loginType === "user" ? (
                <form onSubmit={handleUserLogin} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      Welcome Back
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter your Aadhaar number and password to continue
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="aadhaar"
                        type="text"
                        placeholder="XXXX XXXX XXXX"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(formatAadhaar(e.target.value))}
                        className="pl-10 h-12 text-lg tracking-wider"
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="userPassword">Password</Label>
                      <button type="button" className="text-xs text-primary hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="userPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    variant="hero"
                    disabled={!isUserFormValid}
                  >
                    Login to Dashboard
                    <ArrowRight size={18} />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By logging in, you agree to our Terms of Service and Privacy Policy
                  </p>

                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="/register" className="text-primary font-medium hover:underline">
                        Register here
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOfficerLogin} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      Officer Login
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Access the UIDAI administration portal
                    </p>
                  </div>

                  {/* Officer Login Method Toggle */}
                  <div className="space-y-2">
                    <Label>Login With</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOfficerLoginMethod("email")}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all",
                          officerLoginMethod === "email"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <Mail size={16} />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfficerLoginMethod("officerId")}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all",
                          officerLoginMethod === "officerId"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <IdCard size={16} />
                        Officer ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfficerLoginMethod("mobile")}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all",
                          officerLoginMethod === "mobile"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <Phone size={16} />
                        Mobile
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Login Input */}
                  <div className="space-y-2">
                    {officerLoginMethod === "email" && (
                      <>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12"
                          />
                        </div>
                      </>
                    )}
                    {officerLoginMethod === "officerId" && (
                      <>
                        <Label htmlFor="officerId">Officer ID</Label>
                        <div className="relative">
                          <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input
                            id="officerId"
                            type="text"
                            placeholder="Enter your Officer ID"
                            value={officerId}
                            onChange={(e) => setOfficerId(e.target.value)}
                            className="pl-10 h-12"
                          />
                        </div>
                      </>
                    )}
                    {officerLoginMethod === "mobile" && (
                      <>
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input
                            id="mobile"
                            type="tel"
                            placeholder="Enter your mobile number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(formatMobile(e.target.value))}
                            className="pl-10 h-12"
                            maxLength={10}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="officerPassword">Password</Label>
                      <button type="button" className="text-xs text-primary hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="officerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    variant="hero"
                    disabled={!isOfficerFormValid}
                  >
                    Login to Dashboard
                    <ArrowRight size={18} />
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">Secure Access</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield size={14} />
                    Protected by 2-Factor Authentication
                  </div>

                  <div className="text-center pt-2 mt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      New officer?{" "}
                      <Link to="/register-officer" className="text-primary font-medium hover:underline">
                        Register as UIDAI Officer
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2 text-xs">
              <Shield size={14} className="text-success" />
              256-bit SSL
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Lock size={14} className="text-success" />
              ISO 27001
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
