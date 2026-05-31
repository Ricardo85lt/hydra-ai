import React from 'react';
import { Activity, Droplet, Zap, DollarSign, Award, Trophy } from 'lucide-react';

interface AnalyticsTabProps {
  sensors: any;
  events: any[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ sensors, events }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Metrics graph details (2 cols) */}
      <div className="lg:col-span-2 bg-bg-secondary border border-border-primary rounded-2xl p-6 space-y-6">
        <h3 className="font-mono text-sm font-semibold tracking-wide text-text-primary flex items-center gap-2 border-b border-border-secondary pb-4">
          <Activity className="w-5 h-5 text-accent-cyan" />
          EFICIENCIA AMBIENTAL & RESUMEN DE COBERTURA
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-bg-tertiary border border-border-primary/50 rounded-xl p-5">
            <h4 className="text-xs font-mono font-bold text-text-muted uppercase">HUELLA DE CARBONO REDUCIDA</h4>
            <div className="text-2xl font-bold font-mono text-text-primary mt-1">~ 1,485 kg CO₂e</div>
            <p className="text-[10px] text-text-muted-dark mt-1 font-mono">Preservado al mes mitigando uso de motores mecánicos diésel</p>
          </div>

          <div className="bg-bg-tertiary border border-border-primary/50 rounded-xl p-5">
            <h4 className="text-xs font-mono font-bold text-text-muted uppercase">EFICACIA EN EL BALANCE HÍDRICO</h4>
            <div className="text-2xl font-bold font-mono text-accent-cyan mt-1">94.2%</div>
            <p className="text-[10px] text-text-muted-dark mt-1 font-mono">Coeficiente óptimo de transpiración vegetal vs infiltración</p>
          </div>
        </div>

        {/* Dynamic task list showing past saving logs */}
        <div className="space-y-3">
          <span className="text-[10px] text-text-muted font-mono uppercase block font-semibold">ÚLTIMAS TAREAS HIDROLÓGICAS EN COLA (LOGS):</span>
          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {events.map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary/85 border border-border-primary/40 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${
                    ev.type === 'irrigation' ? 'bg-accent-cyan' :
                    ev.type === 'saving' ? 'bg-accent-yellow' :
                    ev.type === 'alert' ? 'bg-accent-red' : 'bg-text-muted'
                  }`} />
                  <span className="text-text-primary font-medium">[{ev.time}]</span>
                  <span className="text-text-muted">{ev.msg}</span>
                </div>
                <span className="text-[10px] text-text-muted-dark border border-border-primary rounded px-1.5 py-0.5 bg-bg-primary">
                  {ev.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainable Score progress tracker (1 col) */}
      <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-mono text-sm font-semibold tracking-wide text-text-primary flex items-center gap-2 border-b border-border-secondary pb-4 mb-4">
            <Award className="w-5 h-5 text-accent-cyan" />
            SCORE DE CONCIENCIA HÍDRICA
          </h3>
          <p className="text-xs text-text-muted mb-6">
            Mapeamos el porcentaje de rendimiento neto sostenible del campo considerando la tasa de drenaje, reciclamiento de napas freáticas e índice de evapotranspiración.
          </p>

          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            {/* Center score readout */}
            <div className="text-center z-10 font-mono">
              <span className="text-3xl font-bold text-accent-cyan">92.8%</span>
              <span className="block text-[9px] text-text-muted uppercase mt-0.5 font-semibold">Índice Sostenible</span>
            </div>
            
            {/* Ambient progress rings */}
            <div className="absolute inset-0 rounded-full border-[10px] border-bg-primary" />
            <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-accent-cyan border-r-accent-cyan border-l-accent-blue animate-spin-slow" />
          </div>
        </div>

        <div className="bg-bg-tertiary border border-border-primary/60 rounded-xl p-4 mt-6 text-center text-xs text-text-muted leading-relaxed flex items-center gap-2.5">
          <Trophy className="w-6 h-6 text-accent-yellow shrink-0" />
          <span className="text-left">
            ¡Felicidades! Su predio clasifica en el rango <b className="text-accent-cyan font-bold">Oro Agrónomo</b> por un desvío mínimo de agua dulce y control de infiltración sobre arcillas pampeanas bolivianas.
          </span>
        </div>
      </div>
    </div>
  );
};
