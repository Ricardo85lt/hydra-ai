import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplet, Zap, Clock, Compass, Activity, 
  TrendingUp, BookOpen, Sparkles, RefreshCw, Sliders, Database,
  Sun, Moon, LogOut
} from 'lucide-react';
import { SensorData, IrrigationZone, IrrigationEvent, ChatMessage } from './types';
import { INITIAL_ZONES, INITIAL_EVENTS } from './data';

// Import Modular Sub-Components
import { TelemetryGrid } from './components/TelemetryGrid';
import { AgroMap } from './components/AgroMap';
import { HistoricChart } from './components/HistoricChart';
import { AiChatTab } from './components/AiChatTab';
import { ForecastTab } from './components/ForecastTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { LeanCanvasTab } from './components/LeanCanvasTab';
import { Login } from './components/Login';

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('hydra_logged_in') === 'true';
  });

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('hydra_theme') as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'ia' | 'forecast' | 'analytics' | 'business'>('dashboard');

  // Real-time sensor state
  const [sensors, setSensors] = useState<SensorData>({
    soil_moisture: 52.4,
    water_tank_level: 78.0,
    rain_probability: 25,
    energy_tariff: 0.082,
    temperature: 28.5,
    wind_speed: 14.2,
    evapotranspiration: 4.8,
    efficiency_score: 87
  });

  const [zones, setZones] = useState<IrrigationZone[]>(INITIAL_ZONES);
  const [events, setEvents] = useState<IrrigationEvent[]>(INITIAL_EVENTS);
  const [timePeriod, setTimePeriod] = useState<string>('MEDIA - TARIFA ESTÁNDAR');
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  // AI Chat and analysis states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      sender: 'ai', 
      text: '¡Hola! Soy HYDRA AI, tu asesor de riego. La humedad promedio general está en 52.4% y existe alerta de humedad baja en la Zona Este (Soya). ¿En qué te ayudo hoy para optimizar la gestión hídrica y energética?', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [aiAnalysisResult, setAiAnalysisResult] = useState({
    recommendation: 'EN_ESPERA',
    confidence: 89,
    duration_minutes: 20,
    estimated_liters: 9000,
    cost_usd: 0.065,
    savings_percentage: 55.4,
    risk_evaluation: 'MEDIO',
    ai_analysis: 'El suelo cuenta con humedad aceptable, pero la Zona Este requiere atención prioritaria. No se inicia riego masivo inmediato debido a que nos encontramos fuera de la tarifa optimizada (Valle). Se proyecta programar la siguiente tarea de riego inteligente a las 22:00 para aprovechar un ahorro del 58% en energía eléctrica, siempre que no se presenten lluvias precipitadas en las próximas horas.'
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Sync theme with document class/attributes and persist in localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hydra_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('hydra_logged_in', 'true');
    showToast('Sesión institucional iniciada correctamente.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('hydra_logged_in');
    showToast('Sesión institucional finalizada.');
  };

  // Setup clock for Santa Cruz, Bolivia
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-BO', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set initial tariff period based on hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      setTimePeriod('VALLE - TARIFA OPTIMIZADA (BAJA)');
    } else if (hour >= 18 && hour <= 21) {
      setTimePeriod('PUNTA - TARIFA COSTOSA (ALTA)');
    } else {
      setTimePeriod('MEDIA - TARIFA ESTÁNDAR');
    }
  }, []);

  // Telemetry fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => {
        const hour = new Date().getHours();
        const rate = (hour >= 9 && hour <= 17) ? -0.15 : -0.05;
        const newMoisture = Math.max(15, Math.min(95, prev.soil_moisture + rate + (Math.random() - 0.5) * 0.4));
        const newTank = Math.max(10, Math.min(100, prev.water_tank_level + (Math.random() - 0.5) * 0.15));
        
        let calculatedTariff = 0.08;
        if (hour >= 22 || hour < 6) calculatedTariff = 0.042 + Math.random() * 0.005;
        else if (hour >= 18 && hour <= 21) calculatedTariff = 0.155 + Math.random() * 0.01;
        else calculatedTariff = 0.082 + Math.random() * 0.008;

        const deltaTemp = Math.sin((hour - 6) * Math.PI / 12) * 3;
        const newTemp = Math.max(16, Math.min(38, 28.5 + deltaTemp + (Math.random() - 0.5) * 0.3));

        return {
          ...prev,
          soil_moisture: parseFloat(newMoisture.toFixed(1)),
          water_tank_level: parseFloat(newTank.toFixed(1)),
          energy_tariff: parseFloat(calculatedTariff.toFixed(4)),
          temperature: parseFloat(newTemp.toFixed(1)),
          wind_speed: parseFloat(Math.max(2, Math.min(45, prev.wind_speed + (Math.random() - 0.5) * 1)).toFixed(1)),
          evapotranspiration: parseFloat(Math.max(1.5, Math.min(9.5, prev.evapotranspiration + (Math.random() - 0.5) * 0.2)).toFixed(1))
        };
      });

      setZones(prev => prev.map(z => {
        let modifier = -0.1;
        if (z.status === 'watering') modifier = 1.2;
        const targetMoisture = Math.max(10, Math.min(98, z.moisture + modifier + (Math.random() - 0.5) * 0.6));
        const newStatus = targetMoisture < 35 ? 'alert' : z.status === 'watering' ? 'watering' : 'idle';
        return {
          ...z,
          moisture: Math.round(targetMoisture),
          status: newStatus as any
        };
      }));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Trigger evaluation refresh on sensor boundaries
  useEffect(() => {
    recalculateAIReport(true);
  }, [sensors.soil_moisture, sensors.energy_tariff]);

  const recalculateAIReport = async (silent = false) => {
    if (!silent) setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorData: sensors, zones }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiAnalysisResult(data);
        if (!silent) showToast('Análisis de Riego AI Actualizado con Éxito.');
      } else {
        deriveFallbackAnalysis();
      }
    } catch (e) {
      deriveFallbackAnalysis();
    } finally {
      if (!silent) setIsAnalyzing(false);
    }
  };

  const deriveFallbackAnalysis = () => {
    const MOISTURE_CRITICAL = 25.0;
    const MOISTURE_LOW = 40.0;
    const MOISTURE_OPTIMAL = 65.0;
    const MOISTURE_HIGH = 80.0;
    const TANK_MINIMUM = 15.0;
    const RAIN_THRESHOLD = 60.0;
    const TARIFF_VALLEY = 0.07;
    const TARIFF_PEAK = 0.13;

    let score = 0.0;
    const reasons: string[] = [];

    const moisture = sensors.soil_moisture;
    const tank = sensors.water_tank_level;
    const rain = sensors.rain_probability;
    const tariff = sensors.energy_tariff;
    const et = sensors.evapotranspiration;

    if (moisture < MOISTURE_CRITICAL) {
      score += 0.9;
      reasons.push(`Humedad crítica (${moisture.toFixed(1)}%)`);
    } else if (moisture < MOISTURE_LOW) {
      const x = (MOISTURE_LOW - moisture) / (MOISTURE_LOW - MOISTURE_CRITICAL);
      score += 0.5 * x;
      reasons.push(`Humedad baja (${moisture.toFixed(1)}%)`);
    } else if (moisture > MOISTURE_HIGH) {
      score -= 0.5;
      reasons.push(`Suelo saturado (${moisture.toFixed(1)}%)`);
    }

    if (rain > RAIN_THRESHOLD) {
      const rain_penalty = (rain - RAIN_THRESHOLD) / 40.0;
      score -= rain_penalty * 0.4;
      reasons.push(`Lluvia probable (${Math.round(rain)}%)`);
    }

    if (tariff <= TARIFF_VALLEY) {
      score += 0.15;
      reasons.push("Tarifa óptima (Valle)");
    } else if (tariff >= TARIFF_PEAK) {
      score -= 0.25;
      reasons.push("Tarifa costosa (Punta)");
    }

    if (tank < TANK_MINIMUM) {
      score -= 1.0;
      reasons.push("Nivel de tanque insuficiente");
    }

    const et_deficit = et - 4.0;
    if (et_deficit > 0) {
      score += Math.min(0.1, et_deficit / 10.0);
      reasons.push(`Evapotranspiración elevada (${et.toFixed(1)} mm/día)`);
    }

    const threshold = 0.35;
    const activate = score >= threshold && tank >= TANK_MINIMUM;

    let duration = 0;
    if (activate) {
      const moisture_deficit = Math.max(0, MOISTURE_OPTIMAL - moisture);
      duration = Math.round(Math.max(8, Math.min(60, moisture_deficit * 1.8)));
    }

    const energy_kwh = activate ? (3.5 * duration / 60) : 0;
    const energy_cost = parseFloat((energy_kwh * tariff).toFixed(4));
    const water_liters = 450 * duration;

    const manual_cost = energy_kwh * 0.13;
    const savings_pct = manual_cost > 0 ? parseFloat(((1 - energy_cost / manual_cost) * 100).toFixed(1)) : 0;

    const risk = (moisture < MOISTURE_CRITICAL || tank < TANK_MINIMUM) ? "ALTO" : (moisture < MOISTURE_LOW || tank < 30) ? "MEDIO" : "BAJO";
    const confidence = Math.round(Math.min(99, (Math.abs(score - threshold) * 2.0 + 0.5) * 100));
    const recommendation = tank < TANK_MINIMUM ? "BLOQUEADO" : activate ? "RIEGO_ACTIVO" : "EN_ESPERA";

    setAiAnalysisResult({
      recommendation,
      confidence,
      duration_minutes: duration,
      estimated_liters: water_liters,
      cost_usd: energy_cost,
      savings_percentage: savings_pct,
      risk_evaluation: risk,
      ai_analysis: `[Algoritmo Híbrido Incorporado] Decisión: ${recommendation}. Motivos clave: ${reasons.join(', ')}. Este sistema unifica las ventanas de tarifa reducida CRE Bolivia con el umbral óptimo hídrico.`
    });
  };

  const showToast = (text: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const startManualIrrigation = (zoneId: string, duration: number) => {
    setZones(prev => prev.map(z => {
      if (z.id === zoneId) return { ...z, status: 'watering', moisture: Math.min(95, z.moisture + 15) };
      return z;
    }));

    const eventTime = new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newEvent: IrrigationEvent = {
      id: Date.now().toString(),
      time: eventTime,
      type: 'manual',
      msg: `Riego manual iniciado por operador en Zona ${zoneId.toUpperCase()} (${duration} minutos).`
    };

    setEvents(prev => [newEvent, ...prev]);
    showToast(`Riego Manual activado en Zona [${zoneId.toUpperCase()}] por ${duration} min.`);

    setTimeout(() => {
       setZones(prev => prev.map(z => {
         if (z.id === zoneId) return { ...z, status: 'idle', moisture: Math.min(88, z.moisture + 20) };
         return z;
       }));
       const endEvent: IrrigationEvent = {
         id: Date.now().toString(),
         time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false }),
         type: 'info',
         msg: `Ciclo manual completado. Humedad recuperada en Zona ${zoneId.toUpperCase()}.`
       };
       setEvents(prev => [endEvent, ...prev]);
    }, 12000);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const promptToSend = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          sensorData: sensors,
          zones: zones
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMsg]);
      } else {
        // Extraer el código de estado HTTP para decidir si usar fallback silencioso
        const status = response.status;
        let detail = '';
        try {
          const errData = await response.json();
          detail = errData.detail || errData.error || '';
        } catch {
          // No JSON body
        }
        throw Object.assign(new Error(detail), { httpStatus: status });
      }
    } catch (err: any) {
      setTimeout(() => {
        const fallbackText = getFailsafeChatResponse(promptToSend);
        const aiMsg: ChatMessage = {
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }, 800);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getFailsafeChatResponse = (input: string): string => {
    const text = input.toLowerCase();
    if (text.includes('sugerencia') || text.includes('cuándo') || text.includes('recomiendas') || text.includes('riego')) {
      return `Analizando la telemetría actual: la humedad del suelo promedio está en ${sensors.soil_moisture}%. Como la tarifa eléctrica actual es de $${sensors.energy_tariff} USD/kWh (${timePeriod}), mi recomendación es ${aiAnalysisResult.duration_minutes > 0 ? `un ciclo guiado de ${aiAnalysisResult.duration_minutes} min en los lotes bajos` : 'reprogramar y esperar la ventana nocturna Valle'}.`;
    }
    if (text.includes('tarifa') || text.includes('cre') || text.includes('costo') || text.includes('electric') || text.includes('ahorro')) {
      return `El ahorro del sistema se acopla a las estructuras del mercado de la CRE de Santa Cruz:
- Valle (22:00 a 06:00): Estupendo costo de tarifa ($0.042/kWh).
- Punta (18:00 a 21:00): Tarifa pico con recargo ($0.155/kWh).
El motor inteligente desvía de forma automática la carga para reducir el consumo hasta un 55%.`;
    }
    return `Entendido. Como motor HYDRA AI para Montero, enfoco la optimización en balance de riego y tarifa eléctrica. ¿Quieres que analicemos la evapotranspiración (${sensors.evapotranspiration} mm/día) o el tanque (${sensors.water_tank_level}%)?`;
  };

  // Render Login screen if not authenticated
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary font-sans antialiased overflow-x-hidden pb-12 transition-colors duration-300">
      {/* Background radial overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-radial from-[#0055aa]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-radial from-[#00ffd5]/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--border-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--border-secondary)_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Block */}
        <header className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-border-primary/60 gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0055cc] to-[#00aaff] flex items-center justify-center font-bold text-white text-lg border border-accent-cyan/30 shadow-md select-none">
              H₂O
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono tracking-tight text-text-primary flex flex-wrap items-center gap-2">
                HYDRA <span className="text-accent-blue">AI</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30">
                  BUILD 2026
                </span>
              </h1>
              <p className="text-xs uppercase tracking-wider text-text-muted font-mono mt-0.5">
                Optimización Hídrica y Energética · Montero, Santa Cruz (Norte Integrado)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-blue/5 border border-border-primary text-accent-blue">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)] animate-ping" />
              SISTEMA MONITOREADO
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-bg-secondary border border-border-primary text-text-muted">
              <Clock className="w-3.5 h-3.5 text-accent-blue" />
              <span>{currentTime || '18:15:30'}</span>
            </div>
            
            {/* Quick action buttons: Theme Toggle & Logout */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-bg-secondary border border-border-primary text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors duration-200 cursor-pointer flex items-center justify-center"
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-accent-yellow" /> : <Moon className="w-4 h-4 text-accent-blue" />}
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-bg-secondary border border-border-primary text-text-muted hover:text-accent-red hover:bg-bg-hover transition-colors duration-200 cursor-pointer flex items-center justify-center"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Tab Selection Navbar */}
        <div className="flex bg-bg-tertiary border border-border-primary rounded-xl p-1 gap-1 overflow-x-auto scrollbar-none mb-8 select-none">
          {[
            { id: 'dashboard', label: 'Dashboard Telemetría', icon: Activity },
            { id: 'ia', label: 'Motor IA & Asesor agrónomo', icon: Sparkles },
            { id: 'forecast', label: 'Ventanas de Riego (24h)', icon: Clock },
            { id: 'analytics', label: 'Métricas Avanzadas', icon: TrendingUp },
            { id: 'business', label: 'Canvas de Negocio', icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[130px] font-mono text-xs py-2.5 px-4 rounded-lg transition-all duration-300 font-medium cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-bg-secondary to-bg-hover text-text-primary border border-border-primary shadow-md font-semibold' 
                    : 'text-text-muted/70 hover:text-text-primary hover:bg-bg-hover/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-accent-cyan' : 'text-text-muted/70'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Centralized Toasts */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map(t => (
            <div 
              key={t.id} 
              className="flex items-center gap-2.5 px-4 py-3 bg-bg-secondary border border-accent-cyan/40 text-xs font-mono rounded-lg shadow-lg text-text-primary max-w-sm animate-slide-in"
            >
              <Sparkles className="w-4 h-4 text-accent-cyan shrink-0" />
              <span>{t.text}</span>
            </div>
          ))}
        </div>

        {/* Core Screen Router */}
        <main className="relative z-20">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <TelemetryGrid sensors={sensors} timePeriod={timePeriod} />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                <div className="lg:col-span-7">
                  <AgroMap 
                    zones={zones} 
                    startManualIrrigation={startManualIrrigation} 
                    showToast={showToast} 
                  />
                </div>
                <div className="lg:col-span-5">
                  <HistoricChart />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ia' && (
            <AiChatTab
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendChatMessage={handleSendChatMessage}
              isChatLoading={isChatLoading}
              aiAnalysisResult={aiAnalysisResult}
              isAnalyzing={isAnalyzing}
              recalculateAIReport={() => recalculateAIReport(false)}
              chatBottomRef={chatBottomRef}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastTab sensors={sensors} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab sensors={sensors} events={events} />
          )}

          {activeTab === 'business' && (
            <LeanCanvasTab />
          )}
        </main>
      </div>
    </div>
  );
}
