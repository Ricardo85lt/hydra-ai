import React from 'react';
import { Compass } from 'lucide-react';
import { IrrigationZone } from '../types';

interface AgroMapProps {
  zones: IrrigationZone[];
  startManualIrrigation: (zoneId: string, duration: number) => void;
  showToast: (text: string) => void;
}

export const AgroMap: React.FC<AgroMapProps> = ({ zones, startManualIrrigation, showToast }) => {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-border-secondary pb-3 mb-4">
          <h3 className="font-mono text-sm font-semibold tracking-wide text-text-primary flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent-blue" />
            MICRO-COBERTURA DE ZONAS PILOTO — MONTERO, SC
          </h3>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20 animate-pulse">
            MAPA SENSORIZADO INTERACTIVO
          </span>
        </div>
        <p className="text-xs text-text-muted mb-4">
          Haz clic en los nodos de sensores inalámbricos <b className="text-text-primary">LoRaWAN</b> para consultar la telemetría local o desencadenar una prueba rápida.
        </p>
      </div>

      <div className="relative bg-bg-primary border border-border-primary/80 rounded-xl overflow-hidden shadow-inner p-2 select-none">
        <svg viewBox="0 0 520 320" className="w-full h-auto block transform hover:scale-[1.01] transition-transform duration-500">
          <radialGradient id="fieldGround" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#071b12" />
            <stop offset="100%" stopColor="#010705" />
          </radialGradient>
          <rect width="520" height="320" fill="url(#fieldGround)" rx="8" />

          {/* Grid lines */}
          <g stroke="rgba(0,170,255,0.03)" strokeWidth="0.75">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`x-${i}`} x1={i * 65} y1="0" x2={i * 65} y2="320" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`y-${i}`} x1="0" y1={i * 64} x2="520" y2={i * 64} />
            ))}
          </g>

          {/* Río Piraí */}
          <path 
            d="M 30 10 Q 75 55 95 95 Q 125 145 115 195 Q 105 235 135 285 Q 155 315 175 330" 
            fill="none" 
            stroke="rgba(0,170,255,0.18)" 
            strokeWidth="6" 
            strokeLinecap="round" 
          />
          <path 
            d="M 30 10 Q 75 55 95 95 Q 125 145 115 195 Q 105 235 135 285 Q 155 315 175 330" 
            fill="none" 
            stroke="rgba(0,255,213,0.08)" 
            strokeWidth="12" 
            strokeLinecap="round" 
          />
          <text x="35" y="145" fill="rgba(0,170,255,0.3)" fontFamily="monospace" fontSize="8" transform="rotate(-65 35 145)">RÍO PIRAÍ</text>

          {/* Norte */}
          <g 
            className="cursor-pointer group" 
            onClick={() => {
              showToast("Predio Norte Soya: Telemetría óptima. Humedad: 68%.");
              startManualIrrigation('norte', 10);
            }}
          >
            <rect 
              x="200" y="30" width="115" height="80" rx="6" 
              fill={zones[0]?.status === 'watering' ? 'rgba(0,170,255,0.12)' : 'rgba(0,80,40,0.12)'} 
              stroke={zones[0]?.status === 'watering' ? '#00aaff' : 'rgba(0,170,255,0.4)'} 
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <text x="257" y="65" textAnchor="middle" fill="#00e5ff" fontFamily="monospace" fontSize="9" fontWeight="bold">ZONA NORTE</text>
            <text x="257" y="80" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontFamily="monospace" fontSize="7">120 ha · Soya</text>
          </g>

          {/* Sur */}
          <g 
            className="cursor-pointer group"
            onClick={() => {
              showToast("Predio Sur Girasoles: Humedad: 52%. Riego programado.");
              startManualIrrigation('sur', 15);
            }}
          >
            <rect 
              x="325" y="160" width="135" height="85" rx="6" 
              fill={zones[1]?.status === 'watering' ? 'rgba(0,170,255,0.12)' : 'rgba(0,80,40,0.06)'} 
              stroke={zones[1]?.status === 'watering' ? '#00aaff' : 'rgba(0,170,255,0.25)'} 
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <text x="392" y="195" textAnchor="middle" fill="#6fa8d4" fontFamily="monospace" fontSize="9" fontWeight="bold">ZONA SUR</text>
            <text x="392" y="210" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontFamily="monospace" fontSize="7">85 ha · Girasol</text>
          </g>

          {/* Este */}
          <g 
            className="cursor-pointer group"
            onClick={() => {
              showToast("Alerta Zona Este: Estrés hídrico leve detectado. Humedad: 34%.");
              startManualIrrigation('este', 20);
            }}
          >
            <rect 
              x="370" y="35" width="110" height="75" rx="6" 
              fill={zones[2]?.status === 'watering' ? 'rgba(0,170,255,0.15)' : 'rgba(255,77,109,0.06)'} 
              stroke={zones[2]?.status === 'watering' ? '#00aaff' : 'rgba(255,77,109,0.45)'} 
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            {zones[2]?.status !== 'watering' && (
              <rect 
                x="370" y="35" width="110" height="75" rx="6" 
                fill="none" 
                stroke="#ff4d6d" 
                strokeWidth="2" 
                className="animate-pulse" 
              />
            )}
            <text x="425" y="70" textAnchor="middle" fill="#ff4d6d" fontFamily="monospace" fontSize="9" fontWeight="bold">ZONA ESTE</text>
            <text x="425" y="85" textAnchor="middle" fill="rgba(250,150,150,0.7)" fontFamily="monospace" fontSize="7">60 ha · Soya (En Alerta)</text>
          </g>

          {/* Oeste */}
          <g 
            className="cursor-pointer group"
            onClick={() => {
              showToast("Predio Oeste Cañaveral: Humedad abundante (71%).");
              startManualIrrigation('oeste', 10);
            }}
          >
            <rect 
              x="55" y="145" width="110" height="85" rx="6" 
              fill={zones[3]?.status === 'watering' ? 'rgba(0,170,255,0.12)' : 'rgba(0,80,40,0.08)'} 
              stroke={zones[3]?.status === 'watering' ? '#00aaff' : 'rgba(0,170,255,0.2)'} 
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <text x="110" y="180" textAnchor="middle" fill="#6fa8d4" fontFamily="monospace" fontSize="9" fontWeight="bold">ZONA OESTE</text>
            <text x="110" y="195" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontFamily="monospace" fontSize="7">45 ha · Caña de Azúcar</text>
          </g>

          {/* Central pump engine - interactive rotating cogwheel instead of emoji */}
          <g 
            id="central-pump" 
            className="transition-transform duration-300 transform active:scale-95 cursor-pointer" 
            transform="translate(255,175)"
            onClick={() => showToast("Bomba central activa. Presión de flujo: 4.2 bar.")}
          >
            <circle r="18" fill="rgba(2,11,26,0.9)" stroke="#00aaff" strokeWidth="2.5" />
            <circle r="26" fill="none" stroke="#00ffd5" strokeWidth="1.5" opacity="0.3" className="animate-ping" />
            <g className="animate-spin" style={{ animationDuration: '8s', transformOrigin: '0px 0px' }}>
              <g transform="scale(0.6667) translate(-12, -12)">
                <path 
                  d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                  fill="none" 
                  stroke="#00ffd5" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <circle cx="12" cy="12" r="3" fill="none" stroke="#00ffd5" strokeWidth="2" />
              </g>
            </g>
            <text x="0" y="32" textAnchor="middle" fill="#6fa8d4" fontFamily="monospace" fontSize="7" fontWeight="bold">BOMBA CENTRAL</text>
          </g>

          {/* Flows */}
          {zones[0]?.status === 'watering' && (
            <path d="M 255 157 L 257 110" stroke="#00ffd5" strokeWidth="2.5" strokeDasharray="5" className="animate-[dash_1s_linear_infinite]" style={{ strokeDashoffset: -20 } as any} />
          )}
          {zones[1]?.status === 'watering' && (
            <path d="M 273 175 C 310 175 325 180 325 180" stroke="#00ffd5" strokeWidth="2.5" strokeDasharray="5" className="animate-[dash_1.5s_linear_infinite]" style={{ strokeDashoffset: -20 } as any} />
          )}
          {zones[2]?.status === 'watering' && (
            <path d="M 273 162 L 370 110" stroke="#ff4d6d" strokeWidth="2" strokeDasharray="5" className="animate-[dash_1.2s_linear_infinite]" style={{ strokeDashoffset: -20 } as any} />
          )}
          {zones[3]?.status === 'watering' && (
            <path d="M 237 175 L 165 180" stroke="#00ffd5" strokeWidth="2.5" strokeDasharray="5" className="animate-[dash_1s_linear_infinite]" style={{ strokeDashoffset: -20 } as any} />
          )}

          {/* Markers */}
          <circle cx="270" cy="55" r="5" fill="#00ffd5" className="animate-pulse" />
          <circle cx="410" cy="185" r="5" fill="#00aaff" />
          <circle cx="440" cy="65" r="5" fill="#ff4d6d" className="animate-ping" />
          <circle cx="115" cy="165" r="5" fill="#00aaff" />

          {/* Compass */}
          <text x="495" y="35" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontFamily="sans-serif" fontSize="10" fontWeight="bold">N</text>
          <line x1="495" y1="40" x2="495" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </svg>

        <div className="absolute bottom-3 left-3 bg-bg-secondary/95 border border-border-primary rounded-lg p-2 flex flex-col gap-1 text-[9px] font-mono shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-cyan" /> Zona Activa (Riego)</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" /> Humedad Crítica (Alerta)</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-text-muted" /> Zona Reposo Estable</div>
        </div>
      </div>
    </div>
  );
};
