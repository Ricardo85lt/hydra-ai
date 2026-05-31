import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { HOUR_FORECAST } from '../data';

interface ForecastTabProps {
  sensors: any;
}

export const ForecastTab: React.FC<ForecastTabProps> = ({ sensors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6">
        <h3 className="font-mono text-sm font-semibold tracking-wide text-text-primary flex items-center gap-2 border-b border-border-secondary pb-4 mb-4">
          <Calendar className="w-5 h-5 text-accent-cyan" />
          CRONOGRAMA ADAPTATIVO DE VENTANAS DE RIEGO (PRÓXIMAS 24H)
        </h3>
        
        <p className="text-xs text-text-muted mb-6">
          Nuestras compuertas automatizadas estiman el momento preciso del día para liberar caudal, cruzando las predicciones de humedad, la probabilidad estacional de lluvia en Montero y la curva de precios de la CRE.
        </p>

        {/* Dynamic hour cards matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {HOUR_FORECAST.map((fc, i) => (
            <div 
              key={i}
              className={`border rounded-xl p-4 transition-all duration-300 relative ${
                fc.recommended 
                  ? 'bg-gradient-to-br from-bg-secondary to-bg-tertiary border-accent-cyan/40 shadow-sm' 
                  : 'bg-bg-tertiary border-border-primary/60 hover:border-border-primary'
              }`}
            >
              {fc.recommended && (
                <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent-cyan text-bg-primary uppercase tracking-wider shadow-sm">
                  Recomendado
                </span>
              )}
              
              <div className="text-center font-mono space-y-2 mt-1">
                <div className="text-xs text-text-muted">{fc.hour}</div>
                <div className="text-base font-bold text-text-primary">{fc.temperature}°C</div>
                
                <div className="border-t border-border-primary/30 my-2 pt-2 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-text-muted-dark">Humedad:</span>
                    <span className="text-accent-blue font-bold">{fc.soil_moisture}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted-dark">Lluvia:</span>
                    <span className="text-text-primary font-medium">{fc.rain_probability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted-dark">Tarifa:</span>
                    <span className={fc.period === 'Valle' ? 'text-accent-cyan font-semibold' : fc.period === 'Punta' ? 'text-accent-red font-semibold' : 'text-accent-yellow font-semibold'}>
                      {fc.period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic informational bar */}
      <div className="bg-bg-tertiary border border-accent-red/20 rounded-xl p-4 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-text-primary font-mono">RESTRICCIONES HORARIAS VIGENTES (REPORTE CRE BOLIVIA)</h4>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Las tarifas en tramos Punta comprenden un incremento sancionatorio temporal. Recomendamos desviar cualquier actividad manual severa de los pivotes antes de las 18:00hs. El motor HYDRA AI mantiene un bloqueo preventivo integral en dichos horarios.
          </p>
        </div>
      </div>
    </div>
  );
};
