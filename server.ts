/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side parsing
app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('Warning: GEMINI_API_KEY environment variable is not defined.');
}

// Ensure clean error response when API key is missing or invalid
function checkAiClient(res: express.Response): boolean {
  if (!ai) {
    res.status(503).json({
      error: 'El servicio AI temporalmente no está configurado. Registra tu GEMINI_API_KEY en la configuración del entorno.',
    });
    return false;
  }
  return true;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Endpoint: General agronomical chat
app.post('/api/gemini/chat', async (req, res) => {
  if (!checkAiClient(res)) return;

  const { message, sensorData, zones } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Falta el mensaje del usuario.' });
    return;
  }

  try {
    const formattedSensors = sensorData
      ? `Humedad: ${sensorData.soil_moisture.toFixed(1)}%, ` +
        `Tanque de Agua: ${sensorData.water_tank_level.toFixed(1)}%, ` +
        `Tarifa: $${sensorData.energy_tariff.toFixed(4)} USD/kWh, ` +
        `Prob. Lluvia: ${sensorData.rain_probability}%, ` +
        `Temperatura: ${sensorData.temperature.toFixed(1)}°C, ` +
        `Evapotranspiración: ${sensorData.evapotranspiration.toFixed(1)} mm`
      : 'No disponibles';

    const formattedZones = zones
      ? zones.map((z: any) => `- Zona ${z.name}: ${z.crop}, Humedad ${z.moisture}%, Estado ${z.status}`).join('\n')
      : 'No disponibles';

    const prompt = message;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Eres HYDRA AI, un asesor agrónomo experto e inteligente de riego automatizado para la región agropecuaria de Santa Cruz, Bolivia (especialmente Montero, Minero, Portachuelo, Okinawa). 
Tienes acceso a la telemetría en tiempo real:
- Sensores actuales: ${formattedSensors}
- Estado de las Zonas agrícolas:
${formattedZones}

Tu objetivo es maximizar la eficiencia hídrica (ahorrar agua), optimizar el rendimiento energético (aprovechar tarifas eléctricas "Valle" de CRE Bolivia de 22:00 a 06:00, y evitar horarios "Punta" de 18:00 a 21:00) y garantizar la salud de los cultivos (como soya, caña de azúcar, girasol).
Proporciona respuestas cortas, profesionales, de tono experto, pragmáticas y técnicas en español. Enfatiza los ahorros logrados y la optimización de tareas de riego.`,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Error in Gemini Chat API:', err);
    res.status(500).json({ error: err.message || 'Error interno del servidor al consultar a Gemini.' });
  }
});

// Endpoint: AI-driven smart review of sensor values & irrigation tasks
app.post('/api/gemini/analyze', async (req, res) => {
  const { sensorData, zones } = req.body;
  if (!sensorData) {
    res.status(400).json({ error: 'Falta sensorData' });
    return;
  }

  // ─── ALGORITMO HÍBRIDO MULTI-CRITERIO (Traducción exacta de la lógica de optimización de ai_engine.py) ───
  const MOISTURE_CRITICAL = 25.0;
  const MOISTURE_LOW = 40.0;
  const MOISTURE_OPTIMAL = 65.0;
  const MOISTURE_HIGH = 80.0;
  const TANK_MINIMUM = 15.0;
  const RAIN_THRESHOLD = 60.0;
  const TARIFF_VALLEY = 0.07;
  const TARIFF_PEAK = 0.13;
  const PUMP_POWER_KW = 3.5;
  const FLOW_RATE_LPM = 450;

  let score = 0.0;
  const reasons: string[] = [];
  const alerts: string[] = [];

  const moisture = sensorData.soil_moisture;
  const tank = sensorData.water_tank_level;
  const rain = sensorData.rain_probability;
  const tariff = sensorData.energy_tariff;
  const et = sensorData.evapotranspiration;

  // 1. Criticidad por humedad
  if (moisture < MOISTURE_CRITICAL) {
    score += 0.9;
    reasons.push(`Humedad crítica o estrés hídrico extremo (${moisture.toFixed(1)}%)`);
  } else if (moisture < MOISTURE_LOW) {
    const x = (MOISTURE_LOW - moisture) / (MOISTURE_LOW - MOISTURE_CRITICAL);
    score += 0.5 * x;
    reasons.push(`Humedad por debajo del umbral óptimo (${moisture.toFixed(1)}%)`);
  } else if (moisture > MOISTURE_HIGH) {
    score -= 0.5;
    reasons.push(`Suelo altamente saturado (${moisture.toFixed(1)}%)`);
  }

  // 2. Penalización por lluvia probable
  if (rain > RAIN_THRESHOLD) {
    const rain_penalty = (rain - RAIN_THRESHOLD) / 40.0;
    score -= rain_penalty * 0.4;
    reasons.push(`Precipitación inminente con probabilidad alta (${Math.round(rain)}%)`);
  }

  // 3. Optimización de tarifa eléctrica (CRE Bolivia pricing)
  if (tariff <= TARIFF_VALLEY) {
    score += 0.15;
    reasons.push("Coincidencia con franja horaria Valle (CRE Bolivia)");
  } else if (tariff >= TARIFF_PEAK) {
    score -= 0.25;
    reasons.push("Franja horaria Punta detectada (evitar costo excesivo)");
  }

  // 4. Nivel del Tanque
  if (tank < TANK_MINIMUM) {
    score -= 1.0;
    alerts.push("ALERTA: Nivel de tanque crítico — reabastecimiento urgente de reservorio hídrico");
    reasons.push("Nivel de reservorio hídrico insuficiente para bombeo");
  }

  // 5. Balance por evapotranspiración (simplificación Penman-Monteith)
  const et_deficit = et - 4.0;
  if (et_deficit > 0) {
    score += Math.min(0.1, et_deficit / 10.0);
    reasons.push(`Evapotranspiración elevada (${et.toFixed(1)} mm/día)`);
  }

  const threshold = 0.35;
  const activate = score >= threshold && tank >= TANK_MINIMUM;

  // Duración adaptativa basada en el déficit hídrico
  let duration = 0;
  if (activate) {
    const moisture_deficit = Math.max(0, MOISTURE_OPTIMAL - moisture);
    duration = Math.round(Math.max(8, Math.min(60, moisture_deficit * 1.8)));
  }

  // Cálculos energéticos e hídricos exactos
  const energy_kwh = activate ? (PUMP_POWER_KW * duration / 60) : 0;
  const energy_cost = parseFloat((energy_kwh * tariff).toFixed(4));
  const water_liters = FLOW_RATE_LPM * duration;

  const manual_cost = energy_kwh * TARIFF_PEAK;
  const savings_pct = manual_cost > 0 ? parseFloat(((1 - energy_cost / manual_cost) * 100).toFixed(1)) : 0;

  const risk = (moisture < MOISTURE_CRITICAL || tank < TANK_MINIMUM) ? "ALTO" : (moisture < MOISTURE_LOW || tank < 30) ? "MEDIO" : "BAJO";
  const confidence = Math.round(Math.min(99, (Math.abs(score - threshold) * 2.0 + 0.5) * 100));
  const recommendation = tank < TANK_MINIMUM ? "BLOQUEADO" : activate ? "RIEGO_ACTIVO" : "EN_ESPERA";

  const fallbackReason = reasons.join(' | ') || 'Sistema operando en estabilidad hídrica.';

  // Intentamos nutrir el análisis textual usando Gemini para un informe agrónomo de primer nivel
  if (!ai) {
    // Si no hay API Key, respondemos con el cómputo exacto del algoritmo híbrido local
    res.json({
      recommendation,
      confidence,
      duration_minutes: duration,
      estimated_liters: water_liters,
      cost_usd: energy_cost,
      savings_percentage: savings_pct,
      risk_evaluation: risk,
      ai_analysis: `[Algoritmo Híbrido] Decisión calculada autónomamente. ${fallbackReason}. Sin clave Gemini se omitirá la narrativa agro-climática extendida, pero se resguarda el flujo matemático de optimización local de Santa Cruz.`
    });
    return;
  }

  try {
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Eres el motor de toma de decisiones HYDRA AI de Santa Cruz, Bolivia. Académicamente experto y agrónomo.
Calculamos computacionalmente la optimización óptima de riego y energía para el predio con los siguientes resultados del algoritmo híbrido matemático:

- Decisión Recomendada de Riego: "${recommendation}" (donde superamos un umbral para activar el equipo si score > ${threshold})
- Confianza del modelo: ${confidence}%
- Duración sugerida: ${duration} minutos
- Nivel de Humedad actual: ${moisture}%
- Nivel de reservorio hídrico: ${tank}%
- Probabilidad de lluvia en zona: ${rain}%
- Tarifa de electricidad de la CRE: $${tariff.toFixed(4)} USD/kWh
- Evapotranspiración diaria medida: ${et} mm/día
- Volumen de agua estimado: ${water_liters} Litros
- Costo de energía calculado: $${energy_cost.toFixed(4)} USD
- Ahorro porcentual vs riego manual: ${savings_pct}%
- Nivel de Riesgo evaluado para los cultivos: ${risk}
- Razones matemáticas locales identificadas: ${fallbackReason}

Por favor, escribe un informe o análisis agrónomo ejecutivo, breve, elocuente y muy profesional en español (máximo 3 frases) que fundamente esta decisión hídrica para el productor. Enfócate en la eficiencia de tareas, el ahorro del acuífero y el beneficio monetario (por ejemplo, aprovechando las horas Valle o posponiendo por lluvias).`,
    });

    res.json({
      recommendation,
      confidence,
      duration_minutes: duration,
      estimated_liters: water_liters,
      cost_usd: energy_cost,
      savings_percentage: savings_pct,
      risk_evaluation: risk,
      ai_analysis: geminiResponse.text || `Análisis automatizado completado con éxito. Motivo: ${fallbackReason}.`
    });

  } catch (err: any) {
    // Failsafe resguardado ante problemas de API o cuotas
    res.json({
      recommendation,
      confidence,
      duration_minutes: duration,
      estimated_liters: water_liters,
      cost_usd: energy_cost,
      savings_percentage: savings_pct,
      risk_evaluation: risk,
      ai_analysis: `Análisis computacional híbrido garantizado ante desconexión de red: la decisión es ${recommendation} debido al estatus de telemetría: ${fallbackReason}.`
    });
  }
});

// Configure Vite middleware in development or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HYDRA AI Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
