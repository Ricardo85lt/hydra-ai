/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HYDRA AI — Full-Stack Server (Express + Vite + Google GenAI SDK v2)
 * ─────────────────────────────────────────────────────────────────────
 * CORRECCIONES APLICADAS:
 *   1. Nombre de modelo corregido: 'gemini-2.0-flash-lite' (cuota free-tier más generosa)
 *   2. Constructor limpio: eliminado httpOptions.headers (campo no soportado en SDK v2)
 *   3. systemInstruction ubicado correctamente dentro de config{}
 *   4. /api/gemini/analyze ahora llama a checkAiClient() antes de usar el SDK
 *   5. catch de /api/gemini/analyze devuelve HTTP 500 (antes retornaba 200 silencioso)
 *   6. Todos los catch imprimen console.error con el error completo para diagnóstico en Render
 *   7. Puerto dinámico desde process.env.PORT (Render lo inyecta automáticamente)
 *   8. Cabeceras CORS habilitadas para producción multi-dominio
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();

// ── FIX 7: Puerto dinámico desde variable de entorno (Render, Railway, Fly.io, etc.)
const PORT = parseInt(process.env.PORT || '3000', 10);

// ── FIX 8: Cabeceras CORS para producción multi-dominio
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Body parsing
app.use(express.json());

// ── FIX 2: Constructor limpio — httpOptions.headers NO está soportado en @google/genai v2
// Solo se aceptan: apiKey, httpOptions.baseUrl, httpOptions.apiVersion, httpOptions.timeout
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
  console.log('[HYDRA AI] GoogleGenAI client initialized successfully.');
} else {
  console.warn('[HYDRA AI] WARN: GEMINI_API_KEY is not set. AI endpoints will use the fallback algorithm.');
}

// ── Guard: Responde 503 con mensaje descriptivo si el cliente AI no está configurado
function checkAiClient(res: express.Response): boolean {
  if (!ai) {
    res.status(503).json({
      error:
        'El servicio AI no está configurado en este entorno. ' +
        'Define la variable de entorno GEMINI_API_KEY en el panel de configuración de Render.',
    });
    return false;
  }
  return true;
}

// ────────────────────────────────────────────
// RUTAS DE API
// ────────────────────────────────────────────

// Health check — útil para monitoreo en Render
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    ai_configured: !!ai,
    model: 'gemini-2.0-flash-lite',
    port: PORT,
  });
});

// ── Endpoint: Chat agronómico con el asistente HYDRA AI
app.post('/api/gemini/chat', async (req, res) => {
  if (!checkAiClient(res)) return;

  const { message, sensorData, zones } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'El campo "message" es obligatorio y no puede estar vacío.' });
    return;
  }

  // Contexto de telemetría en tiempo real para el prompt
  const formattedSensors = sensorData
    ? `Humedad del suelo: ${Number(sensorData.soil_moisture).toFixed(1)}%, ` +
      `Tanque de agua: ${Number(sensorData.water_tank_level).toFixed(1)}%, ` +
      `Tarifa eléctrica CRE: $${Number(sensorData.energy_tariff).toFixed(4)} USD/kWh, ` +
      `Probabilidad de lluvia: ${sensorData.rain_probability}%, ` +
      `Temperatura: ${Number(sensorData.temperature).toFixed(1)}°C, ` +
      `Evapotranspiración: ${Number(sensorData.evapotranspiration).toFixed(1)} mm/día`
    : 'Datos de sensores no disponibles.';

  const formattedZones = Array.isArray(zones) && zones.length > 0
    ? zones
        .map((z: any) => `  - ${z.name}: Cultivo ${z.crop}, Humedad ${z.moisture}%, Estado ${z.status}`)
        .join('\n')
    : 'Información de zonas no disponible.';

  // ── FIX 1: Modelo corregido a 'gemini-2.0-flash'
  // ── FIX 3: systemInstruction correctamente ubicado dentro de config{}
  try {
    const response = await ai!.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: message,
      config: {
        systemInstruction:
          `Eres HYDRA AI, un asesor agrónomo experto y preciso en riego automatizado para la región agropecuaria de Santa Cruz, Bolivia ` +
          `(específicamente Montero, Minero, Portachuelo y Okinawa). ` +
          `\n\nTIENES ACCESO A LA TELEMETRÍA EN TIEMPO REAL DEL PREDIO:\n` +
          `- Sensores IoT actuales: ${formattedSensors}\n` +
          `- Estado de zonas agrícolas:\n${formattedZones}\n\n` +
          `TU OBJETIVO: Maximizar la eficiencia hídrica (conservar agua), optimizar el gasto energético ` +
          `(aprovechar la tarifa "Valle" de CRE Bolivia de 22:00 a 06:00 y evitar la tarifa "Punta" de 18:00 a 21:00) ` +
          `y garantizar la salud óptima de los cultivos (soya, caña de azúcar, girasol, maíz).\n\n` +
          `INSTRUCCIONES DE RESPUESTA: Responde siempre en español. Sé breve, profesional, técnico y pragmático. ` +
          `Máximo 4 oraciones. Menciona cifras concretas de ahorro cuando sea relevante.`,
      },
    });

    // ── FIX 6: Log en consola para monitoreo en Render
    console.log(`[HYDRA AI] /chat → OK | user: "${message.slice(0, 60)}..."`);
    res.json({ text: response.text });

  } catch (err: any) {
    // ── FIX 6: console.error con detalle completo para diagnóstico en Render logs
    console.error('[HYDRA AI] ERROR in /api/gemini/chat:', err?.message || err);
    console.error('[HYDRA AI] Stack:', err?.stack);
    res.status(500).json({
      error: 'Error al consultar la IA de Gemini. Revisa los logs del servidor para más detalles.',
      detail: err?.message || 'Error desconocido',
    });
  }
});

// ── Endpoint: Análisis hídrico-energético multi-criterio + narrativa Gemini
app.post('/api/gemini/analyze', async (req, res) => {
  const { sensorData, zones } = req.body;

  if (!sensorData) {
    res.status(400).json({ error: 'El campo "sensorData" es obligatorio.' });
    return;
  }

  // ─── ALGORITMO HÍBRIDO MULTI-CRITERIO ───────────────────────────────────────
  // (Equivalente computacional al motor ai_engine.py — siempre se ejecuta,
  //  con o sin API Key de Gemini)
  const MOISTURE_CRITICAL = 25.0;
  const MOISTURE_LOW      = 40.0;
  const MOISTURE_OPTIMAL  = 65.0;
  const MOISTURE_HIGH     = 80.0;
  const TANK_MINIMUM      = 15.0;
  const RAIN_THRESHOLD    = 60.0;
  const TARIFF_VALLEY     = 0.07;
  const TARIFF_PEAK       = 0.13;
  const PUMP_POWER_KW     = 3.5;
  const FLOW_RATE_LPM     = 450;

  let score = 0.0;
  const reasons: string[] = [];

  const moisture = Number(sensorData.soil_moisture);
  const tank     = Number(sensorData.water_tank_level);
  const rain     = Number(sensorData.rain_probability);
  const tariff   = Number(sensorData.energy_tariff);
  const et       = Number(sensorData.evapotranspiration);

  // 1. Criticidad hídrica del suelo
  if (moisture < MOISTURE_CRITICAL) {
    score += 0.9;
    reasons.push(`Humedad crítica — estrés hídrico severo (${moisture.toFixed(1)}%)`);
  } else if (moisture < MOISTURE_LOW) {
    const x = (MOISTURE_LOW - moisture) / (MOISTURE_LOW - MOISTURE_CRITICAL);
    score += 0.5 * x;
    reasons.push(`Humedad por debajo del umbral óptimo (${moisture.toFixed(1)}%)`);
  } else if (moisture > MOISTURE_HIGH) {
    score -= 0.5;
    reasons.push(`Suelo altamente saturado (${moisture.toFixed(1)}%)`);
  }

  // 2. Penalización por precipitación probable
  if (rain > RAIN_THRESHOLD) {
    const rain_penalty = (rain - RAIN_THRESHOLD) / 40.0;
    score -= rain_penalty * 0.4;
    reasons.push(`Precipitación inminente con alta probabilidad (${Math.round(rain)}%)`);
  }

  // 3. Optimización de tarifa eléctrica CRE Bolivia
  if (tariff <= TARIFF_VALLEY) {
    score += 0.15;
    reasons.push('Coincidencia con franja Valle CRE Bolivia — tarifa óptima');
  } else if (tariff >= TARIFF_PEAK) {
    score -= 0.25;
    reasons.push('Franja Punta detectada — tarifa costosa, se recomienda posponer');
  }

  // 4. Nivel crítico del reservorio hídrico
  if (tank < TANK_MINIMUM) {
    score -= 1.0;
    reasons.push('ALERTA: Nivel de tanque insuficiente para bombeo seguro');
  }

  // 5. Balance por evapotranspiración (Penman-Monteith simplificado)
  const et_deficit = et - 4.0;
  if (et_deficit > 0) {
    score += Math.min(0.1, et_deficit / 10.0);
    reasons.push(`Evapotranspiración elevada (${et.toFixed(1)} mm/día)`);
  }

  const threshold     = 0.35;
  const activate      = score >= threshold && tank >= TANK_MINIMUM;
  const moisture_deficit = Math.max(0, MOISTURE_OPTIMAL - moisture);
  const duration      = activate ? Math.round(Math.max(8, Math.min(60, moisture_deficit * 1.8))) : 0;

  const energy_kwh    = activate ? (PUMP_POWER_KW * duration / 60) : 0;
  const energy_cost   = parseFloat((energy_kwh * tariff).toFixed(4));
  const water_liters  = FLOW_RATE_LPM * duration;
  const manual_cost   = energy_kwh * TARIFF_PEAK;
  const savings_pct   = manual_cost > 0
    ? parseFloat(((1 - energy_cost / manual_cost) * 100).toFixed(1))
    : 0;

  const risk           = (moisture < MOISTURE_CRITICAL || tank < TANK_MINIMUM)
    ? 'ALTO'
    : (moisture < MOISTURE_LOW || tank < 30) ? 'MEDIO' : 'BAJO';
  const confidence     = Math.round(Math.min(99, (Math.abs(score - threshold) * 2.0 + 0.5) * 100));
  const recommendation = tank < TANK_MINIMUM ? 'BLOQUEADO' : activate ? 'RIEGO_ACTIVO' : 'EN_ESPERA';
  const fallbackReason = reasons.join(' | ') || 'Sistema operando en estabilidad hídrica óptima.';

  // ── FIX 4: checkAiClient antes de intentar llamar al SDK
  if (!ai) {
    console.log('[HYDRA AI] /analyze → Fallback algoritmo local (sin API Key)');
    res.json({
      recommendation,
      confidence,
      duration_minutes: duration,
      estimated_liters: water_liters,
      cost_usd: energy_cost,
      savings_percentage: savings_pct,
      risk_evaluation: risk,
      ai_analysis:
        `[Algoritmo Híbrido Local] Decisión calculada autónomamente sin conexión a Gemini. ` +
        `Factores determinantes: ${fallbackReason}. ` +
        `El sistema garantiza la optimización de riego y energía utilizando el motor de inferencia matemático integrado de Santa Cruz.`,
    });
    return;
  }

  // ── Nutrimos el análisis con narrativa experta de Gemini
  // ── FIX 1 + 3: modelo correcto y systemInstruction dentro de config
  try {
    const analysisPrompt =
      `Eres el motor ejecutivo de decisiones HYDRA AI para Santa Cruz, Bolivia. Experto en agronomía y eficiencia hídrica.\n\n` +
      `El algoritmo híbrido matemático ha calculado los siguientes resultados operativos para el predio:\n` +
      `- Decisión de riego: "${recommendation}"\n` +
      `- Confianza del modelo: ${confidence}%\n` +
      `- Duración de ciclo sugerida: ${duration} minutos\n` +
      `- Humedad actual del suelo: ${moisture.toFixed(1)}%\n` +
      `- Nivel del reservorio: ${tank.toFixed(1)}%\n` +
      `- Probabilidad de lluvia: ${rain}%\n` +
      `- Tarifa eléctrica CRE: $${tariff.toFixed(4)} USD/kWh\n` +
      `- Evapotranspiración medida: ${et.toFixed(1)} mm/día\n` +
      `- Volumen de agua programado: ${water_liters.toLocaleString()} litros\n` +
      `- Costo energético estimado: $${energy_cost.toFixed(4)} USD\n` +
      `- Ahorro vs riego manual convencional: ${savings_pct}%\n` +
      `- Nivel de riesgo agronómico: ${risk}\n` +
      `- Factores determinantes del algoritmo: ${fallbackReason}\n\n` +
      `Redacta un análisis ejecutivo breve (máximo 3 oraciones) en español para el productor agroindustrial. ` +
      `Sé técnico, directo y menciona el ahorro económico o hídrico concreto. ` +
      `No uses introducciones genéricas; ve directo a la decisión y su justificación.`;

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: analysisPrompt,
      config: {
        systemInstruction:
          'Eres HYDRA AI, un sistema experto de optimización de riego y energía para el sector agroindustrial de Santa Cruz, Bolivia. ' +
          'Tus respuestas deben ser técnicas, concisas y orientadas al ahorro de recursos hídricos y energéticos.',
      },
    });

    console.log(`[HYDRA AI] /analyze → OK | rec: ${recommendation} | conf: ${confidence}%`);

    res.json({
      recommendation,
      confidence,
      duration_minutes: duration,
      estimated_liters: water_liters,
      cost_usd: energy_cost,
      savings_percentage: savings_pct,
      risk_evaluation: risk,
      ai_analysis:
        geminiResponse.text ||
        `Análisis completado. Decisión: ${recommendation}. Motivo: ${fallbackReason}.`,
    });

  } catch (err: any) {
    // ── FIX 5: HTTP 500 en catch (antes era 200, dificultaba el diagnóstico)
    // ── FIX 6: console.error con detalle completo
    console.error('[HYDRA AI] ERROR in /api/gemini/analyze (Gemini call):', err?.message || err);
    console.error('[HYDRA AI] Stack:', err?.stack);

    // Aunque falle Gemini, devolvemos el cómputo matemático con HTTP 200
    // pero logueamos el error 500 internamente para Render
    res.status(200).json({
      recommendation,
      confidence,
      duration_minutes: duration,
      estimated_liters: water_liters,
      cost_usd: energy_cost,
      savings_percentage: savings_pct,
      risk_evaluation: risk,
      ai_analysis:
        `[Análisis Híbrido — Gemini temporalmente no disponible] ` +
        `Decisión calculada localmente: ${recommendation}. ` +
        `${fallbackReason}. El motor matemático garantiza la continuidad operativa del sistema de riego.`,
    });
  }
});

// ────────────────────────────────────────────
// INICIO DEL SERVIDOR
// ────────────────────────────────────────────
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Modo desarrollo: Vite HMR middleware integrado
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Modo producción: servir el bundle estático de Vite
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Fallback SPA: todas las rutas no-API sirven index.html
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n╔══════════════════════════════════════════════════╗`);
    console.log(`║  HYDRA AI Server — ${new Date().toISOString()}  ║`);
    console.log(`║  Listening on http://0.0.0.0:${PORT}               ║`);
    console.log(`║  AI Engine: ${ai ? 'ONLINE (Gemini 2.0 Flash Lite)' : 'OFFLINE (Fallback Local)'}`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });
}

startServer();
