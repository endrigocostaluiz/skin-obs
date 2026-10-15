import React, { useState } from 'react';
import {
  Radio,
  Disc,
  Video,
  Columns,
  Settings,
  Power,
  Pause,
  Play,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { StreamStats, ThemeConfig } from '../types/theme';

interface ControlsDockProps {
  theme: ThemeConfig;
  stats: StreamStats;
  onToggleStreaming: () => void;
  onToggleRecording: () => void;
  onTogglePauseRecording: () => void;
  onToggleVirtualCam: () => void;
  onToggleStudioMode: () => void;
  onOpenSettings: () => void;
  onTransitionExecute: () => void;
}

export const ControlsDock: React.FC<ControlsDockProps> = ({
  theme,
  stats,
  onToggleStreaming,
  onToggleRecording,
  onTogglePauseRecording,
  onToggleVirtualCam,
  onToggleStudioMode,
  onOpenSettings,
  onTransitionExecute,
}) => {
  const [transitionType, setTransitionType] = useState<string>('Esmaecer');
  const [transitionDuration, setTransitionDuration] = useState<number>(300);

  const formatDuration = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
      {/* ===================== TRANSIÇÃO DE CENA DOCK ===================== */}
      <div
        className="flex flex-col h-full border rounded overflow-hidden select-none"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
        }}
      >
        <div
          className="flex items-center justify-between px-2.5 py-1.5 border-b text-xs font-semibold"
          style={{
            backgroundColor: theme.surfaceHeader,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Transições</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {transitionDuration}ms
          </span>
        </div>

        <div className="p-2 space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            <label className="block text-[11px] text-zinc-400 font-medium">
              Efeito de Transição
            </label>
            <div className="grid grid-cols-2 gap-1">
              {['Esmaecer', 'Cortar', 'Deslizar', 'Stinger'].map((trans) => (
                <button
                  key={trans}
                  type="button"
                  onClick={() => setTransitionType(trans)}
                  className={`px-2 py-1.5 rounded text-xs text-left border transition-colors ${
                    transitionType === trans
                      ? 'bg-blue-600/20 border-blue-500 font-medium text-white'
                      : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                  style={{
                    borderColor: transitionType === trans ? theme.accentColor : undefined,
                  }}
                >
                  {trans}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <label className="block text-[10px] text-zinc-400 mb-1">
                Duração: {transitionDuration} ms
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={transitionDuration}
                onChange={(e) => setTransitionDuration(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer"
                style={{ accentColor: theme.accentColor }}
              />
            </div>
          </div>

          <button
            onClick={onTransitionExecute}
            className="w-full py-1.5 px-3 rounded text-xs font-semibold text-white transition-all shadow-xs active:scale-[0.99]"
            style={{ backgroundColor: theme.accentColor }}
          >
            Executar Transição
          </button>
        </div>
      </div>

      {/* ===================== CONTROLES PRINCIPAIS DOCK ===================== */}
      <div
        className="flex flex-col h-full border rounded overflow-hidden select-none"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
        }}
      >
        <div
          className="flex items-center justify-between px-2.5 py-1.5 border-b text-xs font-semibold"
          style={{
            backgroundColor: theme.surfaceHeader,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-zinc-400" />
            <span>Controles</span>
          </div>
          {stats.isStreaming && (
            <span className="text-[10px] font-mono text-red-400 font-bold">
              AO VIVO • {formatDuration(stats.streamDuration)}
            </span>
          )}
        </div>

        <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
          {/* Iniciar / Interromper Transmissão */}
          <button
            onClick={onToggleStreaming}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              stats.isStreaming
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-950/30'
                : 'text-white border border-zinc-700 hover:border-zinc-500'
            }`}
            style={{
              backgroundColor: stats.isStreaming ? '#DC2626' : theme.surfaceHover,
            }}
          >
            <div className="flex items-center gap-2">
              <Radio className={`w-3.5 h-3.5 ${stats.isStreaming ? 'animate-pulse' : ''}`} />
              <span>
                {stats.isStreaming ? 'Interromper Transmissão' : 'Iniciar Transmissão'}
              </span>
            </div>
            {stats.isStreaming && (
              <span className="font-mono text-[10px]">{formatDuration(stats.streamDuration)}</span>
            )}
          </button>

          {/* Iniciar / Parar Gravação */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleRecording}
              className={`flex-1 flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                stats.isRecording
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'text-zinc-200 border border-zinc-700 hover:border-zinc-500'
              }`}
              style={{
                backgroundColor: stats.isRecording ? '#D97706' : theme.surfaceHover,
              }}
            >
              <div className="flex items-center gap-2">
                <Disc className={`w-3.5 h-3.5 ${stats.isRecording ? 'animate-spin' : ''}`} />
                <span>{stats.isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}</span>
              </div>
              {stats.isRecording && (
                <span className="font-mono text-[10px]">
                  {formatDuration(stats.recordDuration)}
                </span>
              )}
            </button>

            {stats.isRecording && (
              <button
                onClick={onTogglePauseRecording}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                title={stats.isRecordingPaused ? 'Retomar Gravação' : 'Pausar Gravação'}
              >
                {stats.isRecordingPaused ? (
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Câmera Virtual */}
          <button
            onClick={onToggleVirtualCam}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors ${
              stats.isVirtualCam
                ? 'bg-blue-600 text-white font-medium'
                : 'text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Video className="w-3.5 h-3.5" />
              <span>
                {stats.isVirtualCam ? 'Interromper Câmera Virtual' : 'Iniciar Câmera Virtual'}
              </span>
            </div>
            {stats.isVirtualCam && <span className="text-[10px] font-mono">Ativa</span>}
          </button>

          {/* Modo Estúdio */}
          <button
            onClick={onToggleStudioMode}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded text-xs border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Columns className="w-3.5 h-3.5" />
              <span>Modo Estúdio</span>
            </div>
          </button>

          {/* Configurações */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded text-xs border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Configurações</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
