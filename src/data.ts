/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ForecastItem, IrrigationZone, IrrigationEvent } from './types';

export const INITIAL_ZONES: IrrigationZone[] = [
  { id: 'norte', name: 'Norte (Lote 1)', area: 120, crop: 'Soya', moisture: 68, status: 'idle' },
  { id: 'sur', name: 'Sur (Lote 2)', area: 85, crop: 'Girasol', moisture: 52, status: 'idle' },
  { id: 'este', name: 'Este (Lote 3)', area: 60, crop: 'Soya', moisture: 34, status: 'alert' },
  { id: 'oeste', name: 'Oeste (Lote 4)', area: 45, crop: 'Caña de Azúcar', moisture: 71, status: 'idle' },
];

export const INITIAL_EVENTS: IrrigationEvent[] = [
  { id: '1', time: '14:20', type: 'irrigation', msg: 'Riego automatizado finalizado en Zona Norte: 18 min.' },
  { id: '2', time: '13:05', type: 'saving', msg: 'Riego bloqueado por tarifa eléctrica PUNTA ($0.155/kWh).' },
  { id: '3', time: '11:32', type: 'info', msg: 'Datos meteorológicos actualizados desde SENAMHI Santa Cruz.' },
  { id: '4', time: '10:15', type: 'alert', msg: 'Alerta de Humedad Baja en sector Este (Humedad < 35%).' },
  { id: '5', time: '08:44', type: 'saving', msg: 'Ventana de riego reprogramada. Alta probabilidad de precipitación (72%).' },
  { id: '6', time: '04:10', type: 'irrigation', msg: 'Riego automático completado durante tarifa VALLE ($0.042/kWh).' }
];

export const HOUR_FORECAST: ForecastItem[] = [
  { hour: '06:00', temperature: 21, soil_moisture: 58, rain_probability: 10, energy_tariff: 0.08, recommended: false, period: 'Media' },
  { hour: '08:00', temperature: 24, soil_moisture: 52, rain_probability: 15, energy_tariff: 0.14, recommended: false, period: 'Punta' },
  { hour: '10:00', temperature: 27, soil_moisture: 46, rain_probability: 20, energy_tariff: 0.09, recommended: false, period: 'Media' },
  { hour: '12:00', temperature: 31, soil_moisture: 41, rain_probability: 18, energy_tariff: 0.08, recommended: false, period: 'Media' },
  { hour: '14:00', temperature: 32, soil_moisture: 36, rain_probability: 25, energy_tariff: 0.08, recommended: false, period: 'Media' },
  { hour: '16:00', temperature: 30, soil_moisture: 33, rain_probability: 30, energy_tariff: 0.08, recommended: false, period: 'Media' },
  { hour: '18:00', temperature: 27, soil_moisture: 31, rain_probability: 15, energy_tariff: 0.15, recommended: false, period: 'Punta' },
  { hour: '20:00', temperature: 25, soil_moisture: 29, rain_probability: 10, energy_tariff: 0.15, recommended: false, period: 'Punta' },
  { hour: '22:00', temperature: 23, soil_moisture: 28, rain_probability: 5,  energy_tariff: 0.04, recommended: true,  period: 'Valle' },
  { hour: '00:00', temperature: 22, soil_moisture: 55, rain_probability: 5,  energy_tariff: 0.04, recommended: true,  period: 'Valle' },
  { hour: '02:00', temperature: 21, soil_moisture: 65, rain_probability: 10, energy_tariff: 0.04, recommended: false, period: 'Valle' },
  { hour: '04:00', temperature: 20, soil_moisture: 62, rain_probability: 10, energy_tariff: 0.04, recommended: false, period: 'Valle' },
];

export const HISTORIC_DATA = [
  { t: '06h', moisture: 64, tariff: 0.05, label: '06:00' },
  { t: '08h', moisture: 59, tariff: 0.15, label: '08:00' },
  { t: '10h', moisture: 54, tariff: 0.08, label: '10:00' },
  { t: '12h', moisture: 49, tariff: 0.08, label: '12:00' },
  { t: '14h', moisture: 43, tariff: 0.08, label: '14:00' },
  { t: '16h', moisture: 38, tariff: 0.08, label: '16:00' },
  { t: '18h', moisture: 34, tariff: 0.15, label: '18:00' },
  { t: '20h', moisture: 30, tariff: 0.15, label: '20:00' },
  { t: '22h', moisture: 28, tariff: 0.04, label: '22:00' },
  { t: '00h', moisture: 60, tariff: 0.04, label: '00:00' },
  { t: '02h', moisture: 68, tariff: 0.04, label: '02:00' },
  { t: '04h', moisture: 65, tariff: 0.04, label: '04:00' },
];

export const LEAN_CANVAS = [
  {
    title: 'Problema',
    content: 'El bombeo de agua representa hasta el 35% de los costos operativos en agricultura intensiva. Se desperdicia cerca de un 40% del recurso hídrico debido a riegos ineficientes realizados en horas de alta calor o tarifas eléctricas pico en Bolivia.'
  },
  {
    title: 'Segmento de Clientes',
    content: 'Agroindustriales de tamaño mediano a grande en las zonas productivas de Santa Cruz (Montero, Okinawa, San Pedro). Productores que manejan entre 50 y 850 hectáreas de soya, girasol, maíz o caña con sistemas de riego automático.'
  },
  {
    title: 'Propuesta Única de Valor',
    content: 'Motor IA de Riego Inteligente que de manera autónoma disminuye hasta un 32% los costos de agua y un 55% en facturación eléctrica, coordinando los periodos óptimos del nivel del suelo con la fluctuación de tarifas horarias de CRE Bolivia.'
  },
  {
    title: 'Solución',
    content: 'Un tablero de comando en tiempo real acoplado a sensores IoT inalámbricos de bajo costo (LoRaWAN) y un motor IA inteligente que gestiona eficientemente tareas de riego, sugiriendo o activando el flujo estrictamente necesario.'
  },
  {
    title: 'Canales',
    content: 'Venta consultiva directa a cooperativas agrarias locales, participación en exposiciones técnicas del sector (Vidas, Anapo), e integración con integradores de automatización agrícola SCADA existentes.'
  },
  {
    title: 'Flujos de Ingreso',
    content: 'Esquema de Software as a Service (SaaS): Suscripción mensual de $1.2 USD por hectárea monitoreada + Venta inicial llave en mano de sensores inteligentes IoT a $240 USD por nodo transmisor LoRa.'
  },
  {
    title: 'Estructura de Costos',
    content: 'Inversión en I+D de software y optimización del motor de inferencia IA. Servidores cloud escalables, ensamblaje de la electrónica IoT, y soporte técnico de campo para instalación de antenas concentradoras.'
  },
  {
    title: 'Métricas Clave',
    content: 'Porcentaje de ahorro neto en kWh, metros cúbicos de agua preservada por mes, precisión del pronóstico de humedad del suelo, e índice de salud de cultivo medido vía satélite/NDVI.'
  },
  {
    title: 'Ventaja Injusta',
    content: 'Modelos predictivos pre-entrenados con curvas históricas climáticas de Santa Cruz y bases de datos reguladas de tarifas tiempo de uso (TOU) de la CRE, con menor fricción de implementación técnica.'
  },
  {
    title: 'Impacto Social y Ambiental',
    content: 'Sostenibilidad hídrica protegiendo las napas subterráneas de Santa Cruz. Reducción directa en la huella de carbono derivada de los motores de bombeo eléctrico y diésel, optimizando la seguridad alimentaria.'
  }
];
