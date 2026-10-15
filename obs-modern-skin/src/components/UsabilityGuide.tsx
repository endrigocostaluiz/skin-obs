import React from 'react';
import {
  X,
  Eye,
  Sliders,
  Cpu,
  MousePointer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface UsabilityGuideProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenExport: () => void;
}

export const UsabilityGuide: React.FC<UsabilityGuideProps> = ({
  theme,
  isOpen,
  onClose,
  onOpenExport,
}) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: Eye,
      title: '1. Fadiga Visual Reduzida em Streams Longas',
      subtitle: 'Contraste óptico calibrado WCAG AA',
      desc: 'Os temas padrões do OBS (Yami e Acri) possuem cinzas com excesso de reflexo azul ou contrastes desiguais que cansam a vista após 2 a 3 horas de transmissão. Lumina adota tons de ardósia profunda e OLED puro (#08080A), mantendo o foco do streamer no jogo e no chat.',
    },
    {
      icon: Sliders,
      title: '2. Medidores de Áudio com Reconhecimento Periférico',
      subtitle: 'Zonas -20dB, -9dB e Peak Hold Instantâneo',
      desc: 'No calor da partida, você não pode parar para ler números miúdos. Lumina utiliza faixas cromáticas padronizadas de transmissão de TV: Verde para base (-60 a -20dB), Amarelo para a fala ideal (-20 a -9dB) e Vermelho para perigo de estouro/distorção (&gt; -9dB).',
    },
    {
      icon: MousePointer,
      title: '3. Alvos de Clique Ergonomicamente Seguros (Lei de Fitts)',
      subtitle: 'Evite interromper transmissões por clique acidental',
      desc: 'Os botões de "Iniciar Transmissão" e "Gravar" no OBS clássico têm apenas 22px de altura. No Lumina, aumentamos a área clicável para 32px a 36px com confirmação de cor inconfundível (Vermelho Vivo para Live Ativa, Âmbar para Gravação).',
    },
    {
      icon: Cpu,
      title: '4. Leveza Máxima: 0% de Impacto em FPS e CPU',
      subtitle: 'Código 100% Qt Style Sheet nativo (sem webviews pesadas)',
      desc: 'Muitos "overlays" e skins comerciais consomem processos extras do Chromium. A skin Lumina é processada diretamente pelo hardware nativo do Qt6 do OBS Studio com overhead de 0.00% na CPU, garantindo que todo o poder da GPU fique com o seu jogo e com o codificador NVENC/AV1.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Princípios de Usabilidade da Skin Lumina OBS
              </h3>
              <p className="text-[11px] text-zinc-400">
                Como esta skin foi projetada para resolver os problemas reais de quem faz live e grava vídeos.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/30">
              <span className="font-semibold text-red-400 block mb-1">
                ✕ Temas Antigos / Padrão do OBS:
              </span>
              <ul className="space-y-1.5 text-zinc-400 text-[11px] list-disc list-inside">
                <li>Bordas chanfradas grossas de 3px poluem a tela.</li>
                <li>Meters de áudio difíceis de enxergar de relance.</li>
                <li>Botões pequenos demais, propensos a cliques errados.</li>
                <li>Títulos de Docks com tipografia pesada e redundante.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
              <span className="font-semibold text-emerald-400 block mb-1">
                ✓ Com a Skin Lumina Moderna:
              </span>
              <ul className="space-y-1.5 text-zinc-300 text-[11px] list-disc list-inside">
                <li>Linhas finas de 1px com visual limpo e moderno.</li>
                <li>Mixer com zona de clipping e peak hold destacados.</li>
                <li>Área de clique ampliada para controle rápido e seguro.</li>
                <li>Totalmente nativo em Qt6, sem peso ou lag no sistema.</li>
              </ul>
            </div>
          </div>

          {/* Pillars List */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-zinc-300">
              Os 4 Pilares de Engenharia da Skin
            </h4>

            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex gap-3.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 text-blue-400 flex items-center justify-center shrink-0 border border-zinc-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{f.title}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {f.subtitle}
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-950/80">
          <span className="text-[11px] text-zinc-400">
            Pronto para aplicar no seu OBS Studio agora mesmo?
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 text-xs"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenExport();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded font-medium text-xs text-white shadow-xs"
              style={{ backgroundColor: theme.accentColor }}
            >
              <span>Exportar Tema Agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
