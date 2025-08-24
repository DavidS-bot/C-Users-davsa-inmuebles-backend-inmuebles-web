"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { persistToken } from "@/lib/auth";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("davsanchez21277@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      console.log("Sending login request:", { email, password: "***" });
      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      console.log("Login response:", res.data);
      const token = res.data?.access_token;
      if (!token) throw new Error("Token no recibido");
      persistToken(token);
      r.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error response:", err?.response?.data);
      setError(err?.response?.data?.detail ?? err?.message ?? "Error de login");
    } finally { setLoading(false); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post("/auth/register", { email, password });
      setIsRegister(false);
      setError("");
      alert("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Error de registro");
    } finally { setLoading(false); }
  }

  return (
    <main 
      className="min-h-screen grid place-items-center p-4 relative"
      style={{
        backgroundImage: 'url(/platon30.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <form onSubmit={isRegister ? handleRegister : handleLogin} className="relative z-10 bg-yellow-400 p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-4 border-4 border-black">
        <h1 className="text-2xl font-black text-black">{isRegister ? "Registrarse" : "Entrar"}</h1>
        <input 
          className="border-2 border-black p-3 w-full rounded-lg font-bold text-black placeholder-gray-700 bg-yellow-300" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="Email" 
          type="email"
          required
        />
        <input 
          className="border-2 border-black p-3 w-full rounded-lg font-bold text-black placeholder-gray-700 bg-yellow-300" 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="Password" 
          required
        />
        {error && <p className="text-red-800 text-sm font-bold bg-red-200 p-2 rounded border-2 border-red-800">{error}</p>}
        <button disabled={loading} className="w-full bg-black text-yellow-400 py-3 rounded-lg font-black text-lg hover:bg-gray-900 transition-colors border-2 border-black">
          {loading ? (isRegister ? "Registrando..." : "Entrando...") : (isRegister ? "Registrarse" : "Acceder")}
        </button>
        <button 
          type="button" 
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setEmail(isRegister ? "davsanchez21277@gmail.com" : "");
            setPassword(isRegister ? "123456" : "");
          }}
          className="w-full text-black font-bold underline text-sm hover:text-gray-700"
        >
          {isRegister ? "¿Ya tienes cuenta? Iniciar sesión" : "¿No tienes cuenta? Registrarse"}
        </button>
      </form>
    </main>
  );
}
