import React, { useState } from 'react';
import {
  X,
  Settings,
  Radio,
  Sliders,
  Tv,
  Keyboard,
  Shield,
  Palette,
  Check,
} from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { THEME_PRESETS } from '../utils/themePresets';

interface SettingsModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onSelectThemePreset: (preset: ThemeConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  theme,
  isOpen,
  onClose,
  onSelectThemePreset,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Geral');

  if (!isOpen) return null;

  const tabs = [
    { id: 'Geral', label: 'Geral', icon: Settings },
    { id: 'Transmissao', label: 'Transmissão', icon: Radio },
    { id: 'Saida', label: 'Saída', icon: Tv },
    { id: 'Audio', label: 'Áudio', icon: Sliders },
    { id: 'Video', label: 'Vídeo', icon: Tv },
    { id: 'Atalhos', label: 'Teclas de Atalho', icon: Keyboard },
    { id: 'Avancado', label: 'Avançado', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div
        className="relative w-full max-w-2xl h-[480px] rounded-xl border shadow-2xl flex flex-col overflow-hidden text-zinc-200"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b text-xs font-semibold"
          style={{
            backgroundColor: theme.surfaceHeader,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações do OBS Studio</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex flex-1 min-h-0">
          {/* Left Navigation */}
          <div
            className="w-44 border-r p-2 space-y-1 text-xs"
            style={{
              backgroundColor: theme.surfaceHeader,
              borderColor: theme.borderColor,
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition-colors text-left ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                  style={{
                    borderLeft: isActive ? `3px solid ${theme.accentColor}` : undefined,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content */}
          <div className="flex-1 p-5 overflow-y-auto text-xs space-y-4">
            {activeTab === 'Geral' ? (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">
                  Configurações Gerais
                </h4>

                <div className="space-y-2">
                  <label className="block text-zinc-300 font-medium">
                    Tema da Interface (Skin)
                  </label>
                  <div className="relative">
                    <select
                      value={theme.id}
                      onChange={(e) => {
                        const found = THEME_PRESETS.find((p) => p.id === e.target.value);
                        if (found) onSelectThemePreset(found);
                      }}
                      className="w-full px-3 py-2 rounded border bg-zinc-900 border-zinc-700 text-white focus:outline-none"
                    >
                      {THEME_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    O tema selecionado é aplicado em tempo real na janela do OBS.
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded accent-blue-500"
                    />
                    <span className="text-zinc-300">
                      Mostrar diálogo de confirmação ao iniciar transmissões
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded accent-blue-500"
                    />
                    <span className="text-zinc-300">
                      Gravar automaticamente ao transmitir
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded accent-blue-500"
                    />
                    <span className="text-zinc-300">
                      Habilitar aceleração de hardware do navegador
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h4>
                <p className="text-zinc-400 text-xs">
                  Configurações de {activeTab} do OBS Studio renderizadas com a skin{' '}
                  <strong className="text-white">{theme.name}</strong>.
                </p>
                <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  {activeTab === 'Transmissao' && 'Serviço: Twitch / YouTube RTMP • Servidor: Auto (Recomendado)'}
                  {activeTab === 'Saida' && 'Modo de Saída: Avançado • Codificador: NVIDIA NVENC HEVC / AV1 (se suportado)'}
                  {activeTab === 'Audio' && 'Taxa de Amostragem: 48 kHz • Canais: Estéreo 2.0 • Medidor: Pico Real'}
                  {activeTab === 'Video' && 'Resolução Base: 1920x1080 • Resolução de Saída: 1920x1080 • 60 FPS Comum'}
                  {activeTab === 'Atalhos' && 'Iniciar Transmissão: [F9] • Parar Transmissão: [F10] • Mutar Microfone: [F12]'}
                  {activeTab === 'Avancado' && 'Prioridade do Processo: Alta • Renderizador: Direct3D 11 / OpenGL'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          className="flex items-center justify-end gap-2 px-4 py-2.5 border-t text-xs"
          style={{
            backgroundColor: theme.surfaceHeader,
            borderColor: theme.borderColor,
          }}
        >
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-300"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-white font-medium shadow-xs"
            style={{ backgroundColor: theme.accentColor }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
