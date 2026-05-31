import React, { useState } from 'react';
import { TrendingUp, MousePointer } from 'lucide-react';
import { HISTORIC_DATA } from '../data';

export const HistoricChart: React.FC = () => {
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any | null>(null);

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-border-secondary pb-3 mb-4">
          <h3 className="font-mono text-sm font-semibold tracking-wide text-text-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-cyan" />
            HISTÓRICO HORARIO DE CAMPO
          </h3>
          <span className="text-[10px] text-text-muted-dark font-mono">Últimas 12hs</span>
        </div>

        <p className="text-xs text-text-muted mb-3">
          Relación entre fluctuación de humedad del suelo (%) y tramos de tarifas eléctricas de CRE Boliviana.
        </p>

        {/* CUSTOM HIGH-FIDELITY SVG CHART */}
        <div className="relative mt-4">
          <div className="h-44 w-full bg-bg-primary border border-border-primary/40 rounded-xl relative overflow-hidden flex items-end px-2 pt-6">
            {/* Grid references */}
            <div className="absolute left-2 top-2 text-[8px] font-mono text-text-muted-dark">100%</div>
            <div className="absolute left-2 top-11 text-[8px] font-mono text-text-muted-dark">75%</div>
            <div className="absolute left-2 top-20 text-[8px] font-mono text-text-muted-dark">50%</div>
            <div className="absolute left-2 bottom-6 text-[8px] font-mono text-text-muted-dark">0%</div>

            <svg viewBox="0 0 420 180" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Threshold line */}
              <line x1="0" y1="108" x2="420" y2="108" stroke="var(--accent-red)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              
              {/* Fill area */}
              <path 
                d="M 10 110 L 45 102 L 80 96 L 115 108 L 150 120 L 185 130 L 220 148 L 255 155 L 290 148 L 325 105 L 360 85 L 395 90 L 420 100 L 420 180 L 10 180 Z" 
                fill="url(#moistureGrad)" 
              />

              {/* Line plot */}
              <path 
                d="M 10 110 L 45 102 L 80 96 L 115 108 L 150 120 L 185 130 L 220 148 L 255 155 L 290 148 L 325 105 L 360 85 L 395 90 L 420 100" 
                fill="none" 
                stroke="var(--accent-blue)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />

              {/* Electricity tariff stairs */}
              <path 
                d="M 10 140 L 45 60 L 80 60 L 115 110 L 150 110 L 185 110 L 220 110 L 255 60 L 290 60 L 325 150 L 360 150 L 395 150 L 420 150" 
                fill="none" 
                stroke="var(--accent-yellow)" 
                strokeWidth="1.5" 
                opacity="0.5" 
                strokeLinecap="round" 
              />
            </svg>

            {/* Interactive Nodes */}
            <div className="absolute inset-x-0 bottom-4 top-0 flex justify-between px-2.5 z-20">
              {HISTORIC_DATA.map((d, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col justify-end items-center group/node cursor-pointer relative"
                  onMouseEnter={() => setHoveredDataPoint(d)}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                >
                  {/* Dynamic Tooltip on Hover */}
                  <div className="w-1 h-32 hover:bg-accent-cyan/10 bg-transparent transition-colors duration-250 rounded-full" />
                  <div className="w-2 h-2 rounded-full border border-accent-blue bg-bg-primary group-hover/node:bg-accent-cyan group-hover/node:scale-125 transition-all mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Tooltip Console */}
        <div className="mt-3.5 bg-bg-tertiary border border-border-primary rounded-xl p-3 h-14 flex items-center justify-between font-mono text-[11px]">
          {hoveredDataPoint ? (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-blue animate-ping" />
                <span>HORA: <b className="text-text-primary">{hoveredDataPoint.label}</b></span>
              </div>
              <div className="text-accent-cyan">HUMEDAD: <b className="text-text-primary">{hoveredDataPoint.moisture}%</b></div>
              <div className="text-accent-yellow">TARIFA RELATIVA: <b className="text-text-primary">${hoveredDataPoint.tariff} USD/kWh</b></div>
            </>
          ) : (
            <div className="text-text-muted flex items-center gap-1.5 w-full justify-center">
              <MousePointer className="w-3.5 h-3.5 text-accent-blue" />
              <span>Desliza el cursor sobre los nodos de la gráfica para ver la telemetría histórica</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
