import React, { useState } from 'react';
import { SlidersHorizontal, ArrowLeftRight, Check, X } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface BeforeAfterComparisonProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  theme,
  isOpen,
  onClose,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight className="w-4 h-4 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Comparativo Visual: OBS Padrão vs Lumina Moderno
              </h3>
              <p className="text-[11px] text-zinc-400">
                Arraste a barra central para comparar lado a lado antes de instalar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Comparison Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-zinc-950">
          <div className="relative w-full max-w-4xl aspect-[16/10] rounded-lg overflow-hidden border border-zinc-800 shadow-2xl select-none">
            {/* LADO DIREITO: LUMINA MODERNO (Camada Base) */}
            <div
              className="absolute inset-0 flex flex-col p-3 transition-colors"
              style={{
                backgroundColor: theme.bgColor,
                color: theme.textColor,
              }}
            >
              {/* Window Header */}
              <div
                className="flex items-center justify-between px-3 py-1.5 rounded-t border text-xs"
                style={{
                  backgroundColor: theme.surfaceHeader,
                  borderColor: theme.borderColor,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span className="font-semibold text-white">Lumina OBS (Novo)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Qt6 • Bordas 1px • Alto Contraste
                </span>
              </div>

              {/* Mock Screen Content */}
              <div className="flex-1 grid grid-cols-12 gap-2 mt-2">
                {/* Canvas Area */}
                <div className="col-span-8 bg-black/90 rounded border flex flex-col items-center justify-center relative p-4" style={{ borderColor: theme.borderColor }}>
                  <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-zinc-900 rounded flex flex-col items-center justify-center border border-zinc-800">
                    <span className="text-xs font-semibold text-zinc-200">
                      Canvas 1920x1080 @ 60 FPS
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1">
                      ● AO VIVO • Bitrate 6000 kbps • CPU 1.8%
                    </span>
                  </div>
                </div>

                {/* Mixer & Docks */}
                <div className="col-span-4 flex flex-col gap-2">
                  {/* Modern Audio Mixer */}
                  <div
                    className="flex-1 rounded border p-2.5 flex flex-col justify-between"
                    style={{
                      backgroundColor: theme.surfaceColor,
                      borderColor: theme.borderColor,
                    }}
                  >
                    <span className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Mixer de Áudio</span>
                      <span className="text-[10px] font-mono text-emerald-400">-12.4 dB</span>
                    </span>

                    {/* Calibrated Meter */}
                    <div className="space-y-2 my-auto">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-zinc-400 font-mono">
                          <span>Mic/Aux (Voz)</span>
                          <span className="text-emerald-400 font-bold">NORMAL</span>
                        </div>
                        <div className="w-full h-3 bg-black/80 rounded overflow-hidden border border-zinc-700 p-0.5">
                          <div
                            className="h-full rounded-xs"
                            style={{
                              width: '74%',
                              background: 'linear-gradient(90deg, #22C55E 0%, #22C55E 65%, #EAB308 85%, #EF4444 100%)',
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-zinc-400 font-mono">
                          <span>Áudio Jogo</span>
                          <span className="text-zinc-400">BGM</span>
                        </div>
                        <div className="w-full h-3 bg-black/80 rounded overflow-hidden border border-zinc-700 p-0.5">
                          <div
                            className="h-full rounded-xs"
                            style={{
                              width: '52%',
                              background: 'linear-gradient(90deg, #22C55E 0%, #22C55E 65%, #EAB308 85%)',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Modern Primary Button */}
                    <div className="pt-2 border-t border-zinc-800">
                      <button
                        className="w-full py-2 rounded text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5"
                        style={{ backgroundColor: '#DC2626' }}
                      >
                        ● Transmissão Ativa (01:42:15)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LADO ESQUERDO: OBS PADRÃO ANTIGO (Camada Sobreposta com Clip) */}
            <div
              className="absolute inset-0 flex flex-col p-3 bg-[#1F232A] text-zinc-300"
              style={{
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              }}
            >
              {/* Window Header Old Style */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-t bg-[#2B303C] border-2 border-[#383F4D] text-xs">
                <span className="font-semibold text-zinc-400">OBS Padrão (Antigo / Yami)</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  Bordas grossas 3px • Cinza fosco
                </span>
              </div>

              {/* Mock Screen Content Old */}
              <div className="flex-1 grid grid-cols-12 gap-2 mt-2">
                <div className="col-span-8 bg-[#14171C] rounded border-2 border-[#383F4D] flex flex-col items-center justify-center p-4">
                  <div className="w-full h-full bg-[#181B22] rounded flex flex-col items-center justify-center border border-[#2B303C]">
                    <span className="text-xs text-zinc-500 font-sans">
                      OBS Padrão • Cinza desbotado
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono mt-1">
                      Sem contraste calibrado para OLED
                    </span>
                  </div>
                </div>

                <div className="col-span-4 flex flex-col gap-2">
                  <div className="flex-1 bg-[#2B303C] rounded border-2 border-[#383F4D] p-2 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-zinc-400">
                      Mixer de Áudio (Padrão)
                    </span>

                    {/* Old Blurry Meter */}
                    <div className="space-y-2 my-auto">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-zinc-500">
                          <span>Mic/Aux</span>
                          <span>-12 dB</span>
                        </div>
                        <div className="w-full h-2 bg-[#181B22] border border-[#383F4D]">
                          <div className="h-full bg-emerald-600 w-3/4 opacity-70" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-zinc-500">
                          <span>Desktop</span>
                          <span>-20 dB</span>
                        </div>
                        <div className="w-full h-2 bg-[#181B22] border border-[#383F4D]">
                          <div className="h-full bg-emerald-700 w-1/2 opacity-70" />
                        </div>
                      </div>
                    </div>

                    {/* Old Small Button */}
                    <div className="pt-2 border-t border-[#383F4D]">
                      <button className="w-full py-1 bg-[#3A4150] border border-[#4B5563] text-[11px] text-zinc-300 rounded-none">
                        Interromper Transmissão
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDER DIVIDER LINE */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 shadow-2xl border-2 border-blue-500 flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4 text-zinc-800" />
              </div>
            </div>

            {/* Slider Range Input Invisible Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-4xl mt-3 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">
              ◀ Esquerda: OBS Padrão (Yami clássico)
            </span>
            <span className="text-[11px] font-mono text-blue-400">
              Arraste para comparar ({Math.round(sliderPos)}%)
            </span>
            <span className="font-semibold text-white">
              Direita: Lumina {theme.name} ▶
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Check className="w-4 h-4 text-emerald-400" />
              Bordas 40% mais finas
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Check className="w-4 h-4 text-emerald-400" />
              Alvos de clique 32px
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Check className="w-4 h-4 text-emerald-400" />
              Preto profundo calibrado
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
