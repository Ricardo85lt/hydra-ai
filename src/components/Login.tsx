import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, Sun, Moon, Droplet, Zap, Compass, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const validateEmail = (val: string): boolean => {
    if (!val) {
      setEmailError('El correo electrónico o usuario es obligatorio.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Allow standard email or a generic institutional identifier (e.g., operator@hydra)
    if (!emailRegex.test(val) && !val.includes('@')) {
      setEmailError('Por favor ingrese un formato de correo o usuario válido.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError('La contraseña es obligatoria.');
      return false;
    }
    if (val.length < 4) {
      setPasswordError('La contraseña debe tener al menos 4 caracteres.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPassValid = validatePassword(password);

    if (isEmailValid && isPassValid) {
      setIsLoading(true);
      // Simulate API verification call
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 1500);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setEmailError('Ingrese su correo electrónico para enviar el enlace de recuperación.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && !email.includes('@')) {
      setEmailError('Por favor ingrese un correo válido para recuperar su contraseña.');
      return;
    }
    setEmailError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRecoveryMessage(`Enlace de restauración enviado con éxito a: ${email}`);
      setTimeout(() => setRecoveryMessage(''), 5000);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary flex transition-colors duration-300">
      {/* Background visual elements for Dark/Light Mode */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-radial from-[#0055aa]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-radial from-[#00ffd5]/10 to-transparent blur-3xl" />
      </div>

      {/* Floating Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl bg-bg-secondary border border-border-primary text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center"
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-accent-yellow" /> : <Moon className="w-5 h-5 text-accent-blue" />}
        </button>
      </div>

      {/* Left side panel - Large screen branding and telemetry details */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bg-tertiary to-bg-secondary border-r border-border-primary p-12 flex-col justify-between relative overflow-hidden select-none z-10">
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,170,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,170,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* Branding header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0055cc] to-[#00aaff] flex items-center justify-center font-bold text-white text-base border border-accent-cyan/30 shadow-md">
            H₂O
          </div>
          <div>
            <span className="font-mono text-lg font-bold tracking-tight text-text-primary">
              HYDRA <span className="text-accent-blue">AI</span>
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-text-muted font-mono">
              Industrial Water & Energy Optimizer
            </span>
          </div>
        </div>

        {/* Dynamic center preview info cards */}
        <div className="my-auto max-w-md space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary font-sans">
            Optimización inteligente de riego y energía para el sector agroindustrial
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Plataforma B2B para monitoreo de sensores LoRaWAN, análisis de evapotranspiración estacional y automatización de pivotes en el Norte Integrado de Santa Cruz, Bolivia.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-bg-primary/50 border border-border-primary rounded-xl p-4">
              <div className="flex items-center gap-2 text-accent-cyan mb-1.5">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold font-mono tracking-wider">Ahorro CRE</span>
              </div>
              <p className="text-xl font-bold font-mono text-text-primary">Hasta -55%</p>
              <p className="text-[9px] text-text-muted-dark mt-0.5 font-mono">Desvío de carga a tarifa Valle</p>
            </div>

            <div className="bg-bg-primary/50 border border-border-primary rounded-xl p-4">
              <div className="flex items-center gap-2 text-accent-blue mb-1.5">
                <Droplet className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold font-mono tracking-wider">Preservación</span>
              </div>
              <p className="text-xl font-bold font-mono text-text-primary">32% Agua</p>
              <p className="text-[9px] text-text-muted-dark mt-0.5 font-mono">Reducción de drenaje ineficiente</p>
            </div>
          </div>
        </div>

        {/* Footer specifications */}
        <div className="flex justify-between text-[10px] font-mono text-text-muted-dark border-t border-border-primary/40 pt-4">
          <span>MONTERO, SANTA CRUZ, BO</span>
          <span>BUILD 2026.4 v2.1</span>
        </div>
      </div>

      {/* Right side panel - Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 z-10">
        <div className="w-full max-w-md bg-bg-secondary border border-border-primary rounded-2xl p-6 md:p-10 shadow-2xl relative">
          {/* Logo visible only on mobile/tablet */}
          <div className="flex items-center gap-3 lg:hidden mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0055cc] to-[#00aaff] flex items-center justify-center font-bold text-white text-sm">
              H₂O
            </div>
            <div>
              <span className="font-mono text-base font-bold text-text-primary">
                HYDRA <span className="text-accent-blue">AI</span>
              </span>
              <span className="block text-[8px] uppercase tracking-wider text-text-muted font-mono">
                Agroindustrial Optimizer
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary tracking-tight">Acceso Institucional</h3>
            <p className="text-xs text-text-muted mt-1">
              Ingresa tus credenciales autorizadas para acceder a la consola de riego.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Username field */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-text-muted mb-1.5 font-semibold">
                Correo Electrónico / Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  disabled={isLoading}
                  placeholder="ejemplo@empresa.com"
                  className={`w-full bg-bg-primary border rounded-xl py-3 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted-dark/50 focus:outline-none transition-all ${
                    emailError 
                      ? 'border-accent-red focus:border-accent-red' 
                      : 'border-border-primary focus:border-accent-blue'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[10px] text-accent-red mt-1.5 font-mono flex items-center gap-1">
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-mono uppercase text-text-muted font-semibold">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full bg-bg-primary border rounded-xl py-3 pl-10 pr-10 text-xs text-text-primary placeholder:text-text-muted-dark/50 focus:outline-none transition-all ${
                    passwordError 
                      ? 'border-accent-red focus:border-accent-red' 
                      : 'border-border-primary focus:border-accent-blue'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[10px] text-accent-red mt-1.5 font-mono">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password row */}
            <div className="flex items-center justify-between text-xs pt-1 select-none">
              <label className="flex items-center gap-2 text-text-muted cursor-pointer hover:text-text-primary">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-border-primary bg-bg-primary text-accent-blue focus:ring-0 focus:ring-offset-0 w-4 h-4"
                />
                <span className="font-mono text-[10px] uppercase">Recordar sesión</span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="font-mono text-[10px] uppercase text-accent-blue hover:underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Status alerts */}
            {recoveryMessage && (
              <div className="p-3.5 bg-accent-blue/10 border border-accent-blue/30 rounded-xl text-[10px] font-mono text-accent-blue leading-relaxed">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{recoveryMessage}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl py-3 bg-gradient-to-r from-[#0055cc] to-[#00aaff] text-white hover:opacity-95 disabled:opacity-50 transition-all font-mono text-xs flex items-center justify-center gap-2 font-bold cursor-pointer shadow-lg shadow-accent-blue/15 border border-accent-cyan/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Conectando al Servidor...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Institutional note */}
          <div className="mt-8 text-center text-[9px] font-mono text-text-muted-dark">
            Consola protegida por encriptación TLS 1.3. El acceso no autorizado será penalizado de acuerdo con la legislación boliviana.
          </div>
        </div>
      </div>
    </div>
  );
};
