import React from 'react';
import { Sparkles, RefreshCw, Send, AlertTriangle, Droplet, PauseCircle, Bot } from 'lucide-react';
import { ChatMessage, SensorData, IrrigationZone } from '../types';

interface AiChatTabProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendChatMessage: (e: React.FormEvent) => void;
  isChatLoading: boolean;
  aiAnalysisResult: {
    recommendation: string;
    confidence: number;
    duration_minutes: number;
    estimated_liters: number;
    cost_usd: number;
    savings_percentage: number;
    risk_evaluation: string;
    ai_analysis: string;
  };
  isAnalyzing: boolean;
  recalculateAIReport: () => void;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
}

export const AiChatTab: React.FC<AiChatTabProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChatMessage,
  isChatLoading,
  aiAnalysisResult,
  isAnalyzing,
  recalculateAIReport,
  chatBottomRef
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Decisión y Estrategia Panel (5 cols) */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-cyan/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-border-secondary pb-4 mb-4">
            <h3 className="font-mono text-sm font-semibold tracking-wide text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              ANÁLISIS COGNITIVO MULTI-CRITERIO
            </h3>
            <button 
              onClick={recalculateAIReport}
              disabled={isAnalyzing}
              className={`p-1.5 rounded-lg bg-bg-tertiary hover:bg-bg-hover text-accent-cyan transition-all border border-border-primary cursor-pointer ${isAnalyzing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic state badge */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1">
              <span className="text-[10px] text-text-muted font-mono uppercase">Recomendación Actual</span>
              <div className="text-xl font-bold font-mono tracking-tight text-text-primary mt-1 flex items-center gap-2">
                {aiAnalysisResult.recommendation === 'RIEGO_ACTIVO' && (
                  <>
                    <span className="w-3 h-3 rounded-full bg-accent-cyan animate-ping shrink-0" />
                    <span className="text-accent-cyan flex items-center gap-1.5">
                      <Droplet className="w-4 h-4" />
                      ACTIVAR RIEGO
                    </span>
                  </>
                )}
                {aiAnalysisResult.recommendation === 'EN_ESPERA' && (
                  <>
                    <span className="w-3 h-3 rounded-full bg-accent-yellow shrink-0" />
                    <span className="text-accent-yellow flex items-center gap-1.5">
                      <PauseCircle className="w-4 h-4" />
                      APAGADO / STANDBY
                    </span>
                  </>
                )}
                {aiAnalysisResult.recommendation === 'BLOQUEADO' && (
                  <>
                    <span className="w-3 h-3 rounded-full bg-accent-red shrink-0" />
                    <span className="text-accent-red flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      BLOQUEADO
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-bg-tertiary border border-border-primary text-center shrink-0">
              <span className="text-[9px] text-text-muted font-mono block">CONFIANZA</span>
              <span className="text-xl font-bold text-accent-cyan font-mono">{aiAnalysisResult.confidence}%</span>
            </div>
          </div>

          {/* Core Decision Math results */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-bg-tertiary border border-border-primary rounded-xl p-4 font-mono text-[11px]">
            <div>
              <span className="text-text-muted">Duración recomendada:</span>
              <p className="text-text-primary text-base font-bold mt-1">{aiAnalysisResult.duration_minutes} min</p>
            </div>
            <div>
              <span className="text-text-muted">Agua estimada necesaria:</span>
              <p className="text-accent-blue text-base font-bold mt-1">{(aiAnalysisResult.estimated_liters).toLocaleString('es-BO')} L</p>
            </div>
            <div className="pt-2 border-t border-border-secondary">
              <span className="text-text-muted">Costo energético predio:</span>
              <p className="text-accent-yellow text-sm font-bold mt-1">${aiAnalysisResult.cost_usd.toFixed(4)} USD</p>
            </div>
            <div className="pt-2 border-t border-border-secondary">
              <span className="text-text-muted">Ahorro vs riego manual:</span>
              <p className="text-accent-cyan text-sm font-bold mt-1">+{aiAnalysisResult.savings_percentage}%</p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-text-muted font-mono uppercase block font-semibold">Fundamentos e Inferencia Agronómica (HYDRA AI Core):</span>
            <div className="bg-bg-primary border border-border-primary/50 rounded-xl p-4 text-xs leading-relaxed text-text-primary h-[220px] overflow-y-auto">
              {aiAnalysisResult.ai_analysis}
            </div>
          </div>

          {/* Technical variables summary tags */}
          <div className="flex gap-2 mt-4 flex-wrap text-[9px] font-mono">
            <span className="px-2 py-1 rounded bg-accent-red/10 text-accent-red border border-accent-red/20 font-bold">RIESGO: {aiAnalysisResult.risk_evaluation}</span>
            <span className="px-2 py-1 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20">TIME-OF-USE: OPTIMIZADO</span>
            <span className="px-2 py-1 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">REGULACIÓN: ANAPO / CRE</span>
          </div>
        </div>
      </div>

      {/* AI Chat Bot Interface (7 cols) */}
      <div className="xl:col-span-7 flex flex-col h-[580px] bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-bg-header-footer border-b border-border-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#0055cc] to-[#00aaff] flex items-center justify-center font-bold text-white shrink-0">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Asistente Agronómico Virtual</h4>
              <p className="text-[10px] text-accent-cyan font-mono font-medium">Conversación en línea · Modelo Gemini 3.5 Flash</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981] shrink-0" />
        </div>

        {/* Chat Stream Screen */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-bg-tertiary">
          {chatMessages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end animate-slide-in' : 'mr-auto items-start'}`}
            >
              <div 
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-accent-blue text-white rounded-br-none' 
                    : 'bg-bg-secondary border border-border-primary text-text-primary rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-text-muted-dark font-mono mt-1.5 px-1">{msg.timestamp}</span>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex items-center gap-2 bg-bg-secondary border border-border-primary/50 p-3 rounded-2xl rounded-bl-none max-w-[50%] mr-auto text-xs font-mono text-accent-cyan">
              <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:0.4s]" />
              <span>HYDRA AI analizando...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat inputs */}
        <form onSubmit={handleSendChatMessage} className="bg-bg-header-footer border-t border-border-primary p-4 flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isChatLoading}
            placeholder="Pregúntame sobre el suelo de la Zona Este, precios CRE, siembra de soya..." 
            className="flex-1 bg-bg-tertiary border border-border-primary focus:border-accent-cyan outline-none text-xs text-text-primary rounded-xl py-3 px-4 placeholder:text-text-muted-dark/50 transition-colors"
          />
          <button 
            type="submit"
            disabled={isChatLoading || !chatInput.trim()}
            className="px-5 rounded-xl bg-gradient-to-r from-[#0055cc] to-[#00aaff] text-white hover:opacity-90 disabled:opacity-50 transition-all font-mono text-xs flex items-center justify-center gap-2 font-bold cursor-pointer shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
