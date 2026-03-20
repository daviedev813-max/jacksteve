import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // [ADDED useLocation]
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const API_BASE_URL = "https://jacksteve.onrender.com";

const AuthPage = ({ user, onLogin, onLogout }) => {
  const [view, setView] = useState("login");
  const [role, setRole] = useState("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    resetToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // [ADDED to track URL params]

  // 1. REDIRECT FIX (Keep as is)
  useEffect(() => {
    if (user?.authenticated && user?.role !== "guest") {
      const target =
        user.role === "admin" ? "/admin/fleet" : `/${user.role}-portal`;
      navigate(target);
    }
  }, [user, navigate]);

  // 2. [NEW] AUTO-CAPTURE TOKEN FROM EMAIL LINK
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get("view");
    const tokenParam = params.get("token");

    if (viewParam === "reset" && tokenParam) {
      setView("reset");
      setFormData((prev) => ({ ...prev, resetToken: tokenParam }));
      setSuccessMsg("SECURITY TOKEN DETECTED. ENTER NEW PASSKEY.");
    }
  }, [location]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      let response;
      if (view === "login") {
        response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: role.toUpperCase(), // Your schema uses ["FARMER", "MILLER", "ADMIN"]
        });
      } else if (view === "register") {
        await axios.post(`${API_BASE_URL}/api/auth/register`, {
          ...formData,
          role: role.toUpperCase(),
        });
        setSuccessMsg("PARTNER REGISTERED. DISPATCHING ACTIVATION CODE...");
        setTimeout(() => setView("verify"), 2000);
        setLoading(false);
        return;
      } else if (view === "verify") {
        response = await axios.post(`${API_BASE_URL}/api/auth/verify`, {
          email: formData.email.toLowerCase().trim(),
          otp: formData.otp,
        });
      } else if (view === "forgot") {
        await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
          email: formData.email.toLowerCase().trim(),
        });
        setSuccessMsg(
          "RESET TOKEN DISPATCHED. REDIRECTING TO RESET TERMINAL...",
        );
        // Auto-switch to reset view so user can paste if link fails
        setTimeout(() => setView("reset"), 2500);
        setLoading(false);
        return;
      } else if (view === "reset") {
        // [UPDATED]: Matches the router.put("/reset-password/:token") path
        response = await axios.put(
          `${API_BASE_URL}/api/auth/reset-password/${formData.resetToken}`,
          {
            password: formData.password,
          },
        );
        setSuccessMsg("PASSKEY UPDATED. RE-INITIALIZING LOGIN...");
        setTimeout(() => setView("login"), 2000);
        setLoading(false);
        return;
      }

      if (response?.data?.token) {
        const { data } = response;
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role.toLowerCase());
        setSuccessMsg("ACCESS GRANTED. INITIALIZING TERMINAL...");
        onLogin(data);
        const target =
          data.role === "ADMIN"
            ? "/admin/fleet"
            : `/${data.role.toLowerCase()}-portal`;
        setTimeout(() => navigate(target, { replace: true }), 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "UPLINK ERROR: CONNECTION REFUSED",
      );
    } finally {
      setLoading(false);
    }
  };

  if (user?.authenticated && user?.role !== "guest") return null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden font-sans">
      {/* LEFT SIDE: Cinematic (Same as your branding code) */}
      <div className="relative hidden lg:flex flex-col justify-center p-20 bg-neutral overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center transition-all duration-[2000ms] scale-110"
          style={{
            backgroundImage: `url(${role === "farmer" ? "/maize-field.jpg" : "/industrial-hub.jpg"})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/60 to-transparent"></div>
        <div className="relative z-10">
          <div
            className={`badge ${role === "farmer" ? "bg-secondary" : "bg-primary"} border-none font-black italic mb-6 px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-white shadow-lg`}
          >
            {role === "farmer" ? "Agriculture Division" : "Industrial Division"}
          </div>
          <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-[0.85] mb-6">
            Reliability <br />{" "}
            <span
              className={role === "farmer" ? "text-secondary" : "text-primary"}
            >
              At Scale.
            </span>
          </h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] italic">
            Jacksteve Logistics Ltd • Verified Supply Chain
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Form */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-white relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-10 duration-700">
          <div className="text-center lg:text-left mb-10">
            <img
              src="/jackstevelogo.png"
              alt="Logo"
              className="h-14 w-auto mb-8 mx-auto lg:mx-0 drop-shadow-md"
            />
            <h1 className="text-4xl font-black italic text-neutral uppercase tracking-tighter leading-none">
              {view === "login"
                ? "System"
                : view === "verify"
                  ? "Identity"
                  : "Partner"}{" "}
              <span
                className={
                  role === "farmer" ? "text-secondary" : "text-primary"
                }
              >
                {view === "forgot" ? "Recovery" : "Entry"}
              </span>
            </h1>
            <p className="text-neutral/30 font-bold uppercase tracking-widest text-[9px] mt-2 italic">
              Secured Jacksteve Logistics Terminal
            </p>
          </div>

          {(view === "login" || view === "register") && (
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-base-200 rounded-3xl mb-8 border border-base-300">
              <button
                onClick={() => setRole("farmer")}
                className={`py-4 rounded-[1.25rem] text-[10px] font-black uppercase italic tracking-widest transition-all ${role === "farmer" ? "bg-secondary text-white shadow-xl scale-[1.02]" : "opacity-40 hover:opacity-100"}`}
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => setRole("miller")}
                className={`py-4 rounded-[1.25rem] text-[10px] font-black uppercase italic tracking-widest transition-all ${role === "miller" ? "bg-primary text-white shadow-xl scale-[1.02]" : "opacity-40 hover:opacity-100"}`}
              >
                🏗️ Miller
              </button>
            </div>
          )}

          {error && (
            <div className="alert bg-error/10 border-l-4 border-error text-error text-[10px] font-black uppercase italic mb-6 p-4 rounded-xl">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="alert bg-success/10 border-l-4 border-success text-success text-[10px] font-black uppercase italic mb-6 p-4 rounded-xl animate-pulse">
              {successMsg}
            </div>
          )}
          {user?.authenticated && (
            <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/20 text-center">
              <p className="text-[10px] font-black uppercase italic mb-2">
                Active Session: {user.email}
              </p>
              <button
                onClick={onLogout}
                className="text-[9px] font-black uppercase underline text-error hover:text-error/70"
              >
                [ Terminate & Switch Account ]
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {view === "register" && (
              <div className="form-control">
                <label className="label p-0 mb-1 px-1">
                  <span className="label-text text-[9px] font-black uppercase text-neutral/40 italic">
                    Organization Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. UNITED MILLERS LTD"
                  required
                  className="input input-bordered w-full rounded-2xl font-black italic h-16 bg-slate-50 uppercase"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            )}

            {view !== "reset" && (
              <div className="form-control">
                <label className="label p-0 mb-1 px-1">
                  <span className="label-text text-[9px] font-black uppercase text-neutral/40 italic">
                    Comms Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="OPERATOR@JACKSTEVE.COM"
                  required
                  className="input input-bordered w-full rounded-2xl font-black italic h-16 bg-slate-50 uppercase"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            )}

            {view === "verify" && (
              <div className="form-control">
                <label className="label p-0 mb-1 px-1">
                  <span className="label-text text-[9px] font-black uppercase text-neutral/40 italic">
                    Activation Code
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  required
                  className="input input-bordered w-full rounded-2xl font-black italic h-16 bg-slate-50 text-center text-3xl tracking-[0.5em]"
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                />
              </div>
            )}

            {(view === "login" || view === "register" || view === "reset") && (
              <div className="form-control relative">
                <label className="label p-0 mb-1 px-1">
                  <span className="label-text text-[9px] font-black uppercase text-neutral/40 italic">
                    Secure Passkey
                  </span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="input input-bordered w-full rounded-2xl font-black italic h-16 bg-slate-50"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 bottom-4 text-neutral/20 hover:text-neutral transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            )}

            <button
              disabled={loading}
              className={`btn w-full rounded-2xl btn-lg h-20 mt-6 border-none text-white font-black italic uppercase shadow-2xl transition-all ${role === "farmer" ? "bg-secondary" : "bg-primary"}`}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : view === "login" ? (
                "Authorize Dispatch →"
              ) : (
                "Establish Partnership →"
              )}
            </button>

            {/* --- SECONDARY NAVIGATION --- */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              {view === "login" ? (
                <div className="flex flex-col gap-6 items-center">
                  {/* Forgot Password Link */}
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Forgot your password?
                  </button>

                  {/* Register Link with a cleaner look */}
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-slate-400">
                      Don't have an account?
                    </span>
                    <button
                      type="button"
                      onClick={() => setView("register")}
                      className="font-bold text-slate-900 hover:underline underline-offset-4"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              ) : (
                /* Return to Login */
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full flex items-center justify-center gap-3 py-2 group transition-all"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-200 text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                    <svg
                      xmlns="http://www.w3.org"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">
                    Back to login
                  </span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
