/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SensorData {
  soil_moisture: number; // %
  water_tank_level: number; // %
  rain_probability: number; // %
  energy_tariff: number; // USD/kWh
  temperature: number; // °C
  wind_speed: number; // km/h
  evapotranspiration: number; // mm/day
  efficiency_score: number; // %
}

export interface IrrigationZone {
  id: string;
  name: string;
  area: number; // ha
  crop: string;
  moisture: number; // %
  status: 'idle' | 'watering' | 'alert';
}

export interface ForecastItem {
  hour: string;
  temperature: number;
  soil_moisture: number;
  rain_probability: number;
  energy_tariff: number;
  recommended: boolean;
  period: 'Valle' | 'Media' | 'Punta';
}

export interface IrrigationEvent {
  id: string;
  time: string;
  type: 'irrigation' | 'saving' | 'alert' | 'manual' | 'info';
  msg: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
