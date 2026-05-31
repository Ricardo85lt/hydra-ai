import React from 'react';
import { Droplet, Database, Sun, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { SensorData } from '../types';

interface TelemetryGridProps {
  sensors: SensorData;
  timePeriod: string;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ sensors, timePeriod }) => {
  return (
    <div className="space-y-6">
      {/* Dynamic Savings Statistics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Preserved Water */}
        <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border-primary rounded-2xl p-5 hover:border-accent-blue/50 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent-blue/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-mono">Agua Preservada</p>
              <h3 className="text-3xl font-bold text-accent-blue mt-2 font-sans tracking-tight">
                {(4820 + sensors.soil_moisture * 1.5).toLocaleString('es-BO', { maximumFractionDigits: 0 })} L
              </h3>
              <p className="text-[11px] text-text-muted-dark mt-1 font-mono">Preservado vs riego tradicional manual</p>
            </div>
            <div className="bg-accent-blue/10 p-3 rounded-xl border border-accent-blue/20 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 text-accent-blue" />
            </div>
          </div>
        </div>

        {/* Energy Displaced */}
        <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border-primary rounded-2xl p-5 hover:border-accent-cyan/50 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent-cyan/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-mono">Energía Desplazada</p>
              <h3 className="text-3xl font-bold text-accent-cyan mt-2 font-sans tracking-tight">
                {(245 + sensors.evapotranspiration * 2.1).toFixed(1)} kWh
              </h3>
              <p className="text-[11px] text-text-muted-dark mt-1 font-mono">Acomodado en franja horaria Valle</p>
            </div>
            <div className="bg-accent-cyan/10 p-3 rounded-xl border border-accent-cyan/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-accent-cyan" />
            </div>
          </div>
        </div>

        {/* Cash Savings */}
        <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border-primary rounded-2xl p-5 hover:border-accent-yellow/50 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent-yellow/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-mono">Dinero Ahorrado Est.</p>
              <h3 className="text-3xl font-bold text-accent-yellow mt-2 font-sans tracking-tight">
                $ {(412 + sensors.soil_moisture * 0.4).toFixed(2)} USD
              </h3>
              <p className="text-[11px] text-text-muted-dark mt-1 font-mono">Reducción en facturación CRE</p>
            </div>
            <div className="bg-accent-yellow/10 p-3 rounded-xl border border-accent-yellow/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-accent-yellow" />
            </div>
          </div>
        </div>
      </div>

      {/* IoT Sensors Array */}
      <div className="text-xs text-text-muted-dark font-mono font-bold uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
        RED DE TELEMETRÍA IOT (SENSANDO EN TIEMPO REAL)
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Soil Moisture */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 hover:border-accent-blue/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold font-mono uppercase text-text-muted">Humedad del Suelo</span>
            <Droplet className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="text-3xl font-bold font-mono text-accent-blue">{sensors.soil_moisture}%</div>
          <div className="text-[10px] text-text-muted-dark mt-1">Óptimo vegetativo: 55-70%</div>
          <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden mt-3.5">
            <div 
              className="bg-gradient-to-r from-accent-blue to-accent-blue/60 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${sensors.soil_moisture}%` }}
            />
          </div>
        </div>

        {/* Reservatorio Level */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 hover:border-accent-cyan/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold font-mono uppercase text-text-muted">Tanque / Reservorio</span>
            <Database className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-3xl font-bold font-mono text-accent-cyan">{sensors.water_tank_level}%</div>
          <div className="text-[10px] text-text-muted-dark mt-1">Costo crítico menor a: 15%</div>
          <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden mt-3.5">
            <div 
              className="bg-gradient-to-r from-accent-cyan/70 to-accent-cyan h-full rounded-full transition-all duration-1000" 
              style={{ width: `${sensors.water_tank_level}%` }}
            />
          </div>
        </div>

        {/* Rain Probability */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 hover:border-accent-yellow/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold font-mono uppercase text-text-muted">Probabilidad de Lluvia</span>
            <Sun className="w-4 h-4 text-accent-yellow" />
          </div>
          <div className="text-3xl font-bold font-mono text-accent-yellow">{sensors.rain_probability}%</div>
          <div className="text-[10px] text-text-muted-dark mt-1">Umbral retraso: &gt;60%</div>
          <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden mt-3.5">
            <div 
              className="bg-gradient-to-r from-accent-yellow/70 to-accent-yellow h-full rounded-full transition-all duration-1000" 
              style={{ width: `${sensors.rain_probability}%` }}
            />
          </div>
        </div>

        {/* Energy Tariff */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 hover:border-accent-blue/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold font-mono uppercase text-text-muted">Tarifa Horaria CRE</span>
            <Zap className={`w-4 h-4 ${sensors.energy_tariff >= 0.13 ? 'text-accent-red' : 'text-accent-cyan'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${sensors.energy_tariff >= 0.13 ? 'text-accent-red' : sensors.energy_tariff <= 0.05 ? 'text-accent-cyan' : 'text-accent-yellow'}`}>
            ${sensors.energy_tariff.toFixed(4)} <span className="text-[10px] text-text-muted-dark font-normal">/kWh</span>
          </div>
          <div className="text-[9px] uppercase tracking-wider text-text-muted-dark mt-1 font-mono">{timePeriod}</div>
          <div className="w-full bg-bg-primary h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${sensors.energy_tariff >= 0.13 ? 'bg-accent-red' : 'bg-accent-cyan'}`} 
              style={{ width: `${(sensors.energy_tariff / 0.18) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
