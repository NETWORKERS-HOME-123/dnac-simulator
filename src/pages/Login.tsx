import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      sessionStorage.setItem("ccc-logged-in", "true");
      toast.success("Login successful");
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(135deg, #1b2a32 0%, #0d1b24 50%, #1a2c36 100%)" }}>
      <div className="w-full max-w-md px-6">
        {/* Cisco Logo */}
        <div className="flex flex-col items-center mb-8">
          <svg viewBox="0 0 200 40" className="w-48 mb-2" fill="none">
            {/* Cisco bridge bars */}
            <g>
              <rect x="20" y="18" width="4" height="14" rx="1" fill="#049fd9" />
              <rect x="30" y="12" width="4" height="20" rx="1" fill="#049fd9" />
              <rect x="40" y="6" width="4" height="26" rx="1" fill="#049fd9" />
              <rect x="50" y="2" width="4" height="30" rx="1" fill="#049fd9" />
              <rect x="60" y="6" width="4" height="26" rx="1" fill="#049fd9" />
              <rect x="70" y="12" width="4" height="20" rx="1" fill="#049fd9" />
              <rect x="80" y="18" width="4" height="14" rx="1" fill="#049fd9" />
            </g>
            <text x="94" y="28" fill="white" fontSize="22" fontFamily="Arial, sans-serif" fontWeight="700" letterSpacing="1">CISCO</text>
          </svg>
          <span className="text-[#8fadbd] text-sm tracking-wider mt-1">Catalyst Center</span>
        </div>

        {/* Login Card */}
        <div className="rounded-lg p-8" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h2 className="text-white text-lg font-semibold mb-6 text-center">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#8fadbd] text-xs mb-1.5 uppercase tracking-wide">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                className="w-full px-3 py-2.5 rounded text-sm text-white placeholder:text-[#5a7a8a] focus:outline-none focus:ring-2 focus:ring-[#049fd9]"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[#8fadbd] text-xs mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                className="w-full px-3 py-2.5 rounded text-sm text-white placeholder:text-[#5a7a8a] focus:outline-none focus:ring-2 focus:ring-[#049fd9]"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                placeholder="Enter password"
              />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#049fd9" }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0388be")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#049fd9")}
            >
              Log In
            </button>
          </form>

          {/* Default credentials hint */}
          <div className="mt-5 p-3 rounded text-center" style={{ backgroundColor: "rgba(4,159,217,0.1)", border: "1px solid rgba(4,159,217,0.25)" }}>
            <p className="text-[#049fd9] text-xs font-medium">Demo Credentials</p>
            <p className="text-[#8fadbd] text-xs mt-1">Username: <span className="text-white font-mono">admin</span> &nbsp;|&nbsp; Password: <span className="text-white font-mono">admin</span></p>
          </div>
        </div>

        <p className="text-[#5a7a8a] text-[10px] text-center mt-6">This is a training simulation. Not affiliated with Cisco Systems.</p>
      </div>
    </div>
  );
}
