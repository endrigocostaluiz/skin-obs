import React from 'react';
import {
  Palette,
  Sliders,
  Check,
  Type,
  Layout,
  Gauge,
  Sparkles,
  Download,
  Code,
  BookOpen,
} from 'lucide-react';
import { ThemeConfig, CornerRadius, Density, MeterStyle } from '../types/theme';
import { THEME_PRESETS } from '../utils/themePresets';

interface ThemeEditorProps {
  theme: ThemeConfig;
  onUpdateTheme: (updates: Partial<ThemeConfig>) => void;
  onSelectPreset: (preset: ThemeConfig) => void;
  onOpenExport: () => void;
  onOpenGuide: () => void;
  onOpenSnapshot?: () => void;
  onOpenBeforeAfter?: () => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  theme,
  onUpdateTheme,
  onSelectPreset,
  onOpenExport,
  onOpenGuide,
  onOpenSnapshot,
  onOpenBeforeAfter,
}) => {
  const accentSwatches = [
    { label: 'Sapphire', value: '#3B82F6' },
    { label: 'Emerald', value: '#10B981' },
    { label: 'Amber', value: '#F59E0B' },
    { label: 'Violet', value: '#8B5CF6' },
    { label: 'Rose', value: '#F43F5E' },
    { label: 'Cyan', value: '#06B6D4' },
  ];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col gap-5 shadow-xl text-zinc-200">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-400" />
            Personalizador de Skin OBS
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ajuste a paleta, ergonomia e densidade em tempo real. Compatível com OBS 28, 29 e 30+.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-700/80 bg-emerald-950/40 hover:bg-emerald-900/50 text-xs text-emerald-300 transition-colors font-medium"
            title="Visualizar e baixar captura em alta resolução (1920x1080 PNG)"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ver Imagem (PNG)</span>
          </button>

          <button
            onClick={onOpenBeforeAfter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-700/80 bg-blue-950/40 hover:bg-blue-900/50 text-xs text-blue-300 transition-colors font-medium"
            title="Comparativo interativo com slider do OBS Padrão vs Lumina"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Antes / Depois</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ergonomia</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium text-xs text-white transition-all shadow-sm hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: theme.accentColor }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar (.QSS)</span>
          </button>
        </div>
      </div>

      {/* 1. Presets Rápidos */}
      <div>
        <label className="block text-xs font-semibold text-zinc-300 mb-2">
          1. Presets de Temas Prontos
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {THEME_PRESETS.map((p) => {
            const isSelected = p.id === theme.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p)}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/20 shadow-xs'
                    : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-800/40'
                }`}
                style={{
                  borderColor: isSelected ? theme.accentColor : undefined,
                }}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-semibold text-white truncate">
                    {p.name.replace(' (Recomendado)', '')}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black/40"
                    style={{ backgroundColor: p.accentColor }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                  {p.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Cores de Destaque & Superfície */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            2. Cor de Destaque (Accent)
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {accentSwatches.map((swatch) => (
              <button
                key={swatch.value}
                onClick={() => onUpdateTheme({ accentColor: swatch.value })}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
                  theme.accentColor === swatch.value
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-105'
                    : ''
                }`}
                style={{ backgroundColor: swatch.value }}
                title={swatch.label}
              >
                {theme.accentColor === swatch.value && (
                  <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                )}
              </button>
            ))}

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-[11px] text-zinc-500 font-mono">Hex:</span>
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* 3. Estilo dos Medidores de Áudio (VU Meter) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            3. Estilo do Mixer de Áudio
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'gradient', label: 'Gradiente Suave' },
              { id: 'segmented', label: 'LED Segmentado' },
              { id: 'neon', label: 'Cyber Neon' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => onUpdateTheme({ meterStyle: st.id as MeterStyle })}
                className={`px-2.5 py-1.5 rounded-lg text-xs border text-center transition-colors ${
                  theme.meterStyle === st.id
                    ? 'bg-zinc-800 border-zinc-500 text-white font-medium'
                    : 'border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Densidade & Ergonomia Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Densidade da Interface
          </label>
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => onUpdateTheme({ density: 'compact' })}
              className={`flex-1 py-1 rounded text-xs transition-colors ${
                theme.density === 'compact'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Compacta (Padrão OBS)
            </button>
            <button
              onClick={() => onUpdateTheme({ density: 'comfortable' })}
              className={`flex-1 py-1 rounded text-xs transition-colors ${
                theme.density === 'comfortable'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Confortável
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Bordas & Cantos (Radius)
          </label>
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {(['sharp', 'subtle', 'modern'] as CornerRadius[]).map((r) => (
              <button
                key={r}
                onClick={() => onUpdateTheme({ cornerRadius: r })}
                className={`flex-1 py-1 rounded text-xs capitalize transition-colors ${
                  theme.cornerRadius === r
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {r === 'sharp' ? 'Reto' : r === 'subtle' ? 'Sutil' : 'Moderno'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Tamanho da Fonte: {theme.fontSize} pt
          </label>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onUpdateTheme({ fontSize: 11 })}
              className={`flex-1 py-1 rounded text-xs border ${
                theme.fontSize === 11
                  ? 'bg-zinc-800 border-zinc-600 text-white font-bold'
                  : 'border-zinc-800 text-zinc-400'
              }`}
            >
              11 pt
            </button>
            <button
              onClick={() => onUpdateTheme({ fontSize: 12 })}
              className={`flex-1 py-1 rounded text-xs border ${
                theme.fontSize === 12
                  ? 'bg-zinc-800 border-zinc-600 text-white font-bold'
                  : 'border-zinc-800 text-zinc-400'
              }`}
            >
              12 pt
            </button>
            <button
              onClick={() => onUpdateTheme({ fontSize: 13 })}
              className={`flex-1 py-1 rounded text-xs border ${
                theme.fontSize === 13
                  ? 'bg-zinc-800 border-zinc-600 text-white font-bold'
                  : 'border-zinc-800 text-zinc-400'
              }`}
            >
              13 pt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
