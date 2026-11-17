import { useState } from 'react';
import { GoogleIcon } from "./GoogleIcon";
import { supabase } from "../lib/supabaseClient"; // Importación corregida
import { Logo } from "./Logo";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  onLogin?: (user: any) => void; 
  onBack?: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [isBackHover, setBackHover] = useState(false);
  const [isGoogleHover, setGoogleHover] = useState(false);
  
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirige al usuario de vuelta a la URL actual tras el login
        redirectTo: window.location.origin, 
      },
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Error de conexión: Verifica que Google esté activo en Supabase");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Navbar / Cabecera */}
      <header className="w-full bg-white border-b border-purple-100 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Logo variant="icon" className="w-full h-full" />
            </div>
            <span className="text-base md:text-lg font-bold text-slate-800 hidden sm:inline">
              Gauss-Jordan Academy
            </span>
          </div>

          {/* Botón Volver */}
          {onBack && (
            <button
              onClick={onBack}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
              style={{
                color: isBackHover ? '#ffffff' : '#6c757d',
                backgroundColor: isBackHover ? '#511682' : '#f8f9fa',
                borderColor: isBackHover ? '#511682' : '#cbd5e1'
              }}
              className="flex items-center gap-2 transition-all text-sm font-bold px-4 py-2 rounded-lg border shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </button>
          )}
        </div>
      </header>

      {/* Contenedor de contenido centrado verticalmente en el espacio restante */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full">
          {/* Logo GJ */}
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40">
              <Logo variant="full" className="w-full h-full" />
            </div>
          </div>
          
          <h1 className="text-center text-[#343A40] text-2xl font-bold mb-3">
            Gauss-Jordan Academy
          </h1>
          
          <p className="text-center text-[#6C757D] mb-10">
            Tu plataforma interactiva para dominar el Álgebra Lineal
          </p>
          
          {/* Botón de Google */}
          <button
            onClick={handleGoogleLogin}
            onMouseEnter={() => setGoogleHover(true)}
            onMouseLeave={() => setGoogleHover(false)}
            style={{
              borderColor: isGoogleHover ? '#511682' : '#d1d5db',
              backgroundColor: isGoogleHover ? '#f5f3ff' : '#ffffff'
            }}
            className="w-full border-2 transition-all duration-200 rounded-lg px-6 py-4 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <GoogleIcon />
            <span className="text-[#343A40] font-medium">
              Iniciar sesión con Google
            </span>
          </button>
 
          <p className="text-center text-xs text-gray-400 mt-8">
            Acceso seguro mediante Google OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  );
}