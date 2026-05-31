import React from 'react';
import { BookOpen } from 'lucide-react';
import { LEAN_CANVAS } from '../data';

export const LeanCanvasTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6">
        <h3 className="font-mono text-sm font-semibold tracking-wide text-text-primary flex items-center gap-2 border-b border-border-secondary pb-4 mb-4">
          <BookOpen className="w-5 h-5 text-accent-cyan" />
          CANVAS DE NEGOCIO MODELO SANO — HYDRA AI
        </h3>
        
        <p className="text-xs text-text-muted mb-8 leading-relaxed">
          Diseñado bajo las reglas lógicas del agro-negocio regional en Santa Cruz, Bolivia. Un modelo optimizado enfocado en la conversión real de costos fijos a variables inteligentes.
        </p>

        {/* Bento grid style Lean Canvas layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEAN_CANVAS.map((cell, idx) => (
            <div 
              key={idx}
              className="bg-bg-tertiary/90 border border-border-primary/80 rounded-xl p-5 hover:border-accent-blue/50 transition-colors duration-200 relative overflow-hidden"
            >
              {/* Subtle top border color for visual dynamic rhythm */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan" />
              
              <h4 className="font-mono font-bold text-xs uppercase tracking-wide text-accent-cyan mb-2">{cell.title}</h4>
              <p className="text-xs leading-relaxed text-text-primary/85">{cell.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
