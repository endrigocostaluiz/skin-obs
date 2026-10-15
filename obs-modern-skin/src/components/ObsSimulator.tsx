import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sliders,
  Settings,
  ChevronDown,
  Maximize2,
  Minimize2,
  X,
  Volume2,
  Radio,
  Disc,
  Video,
  Monitor,
  Menu,
} from 'lucide-react';
import { ThemeConfig, ObsScene, ObsSource, AudioChannel, StreamStats } from '../types/theme';
import { CanvasPreview } from './CanvasPreview';
import { AudioMixerDock } from './AudioMixerDock';
import { ScenesSourcesDocks } from './ScenesSourcesDocks';
import { ControlsDock } from './ControlsDock';

interface ObsSimulatorProps {
  theme: ThemeConfig;
  onOpenSettings: () => void;
  onOpenAdvancedAudio?: () => void;
  onOpenSnapshot?: () => void;
}

export const ObsSimulator: React.FC<ObsSimulatorProps> = ({
  theme,
  onOpenSettings,
  onOpenAdvancedAudio,
  onOpenSnapshot,
}) => {
  // OBS Scenes Initial Mock
  const [scenes, setScenes] = useState<ObsScene[]>([
    {
      id: 'scene-game',
      name: '🎮 Jogo + Facecam',
      sources: [
        {
          id: 'src-cam',
          name: 'Dispositivo de Captura de Vídeo (Webcam)',
          type: 'camera',
          visible: true,
          locked: false,
          x: 70,
          y: 60,
          width: 26,
          height: 34,
        },
        {
          id: 'src-game',
          name: 'Captura de Jogo (DirectX/Vulkan)',
          type: 'game',
          visible: true,
          locked: true,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        },
        {
          id: 'src-alert',
          name: 'Alerta de Subs (Browser Source)',
          type: 'browser',
          visible: true,
          locked: false,
          x: 32,
          y: 8,
          width: 36,
          height: 10,
        },
      ],
    },
    {
      id: 'scene-chat',
      name: '💬 Conversa & Chat',
      sources: [
        {
          id: 'src-cam-full',
          name: 'Webcam Principal 1080p',
          type: 'camera',
          visible: true,
          locked: false,
          x: 10,
          y: 10,
          width: 50,
          height: 75,
        },
        {
          id: 'src-chat-box',
          name: 'Chat do Stream (Twitch/YouTube)',
          type: 'browser',
          visible: true,
          locked: false,
          x: 65,
          y: 10,
          width: 30,
          height: 75,
        },
      ],
    },
    {
      id: 'scene-brb',
      name: '☕ Pausa / Volto Logo (BRB)',
      sources: [
        {
          id: 'src-brb-text',
          name: 'Texto GDI+: Voltamos em 5 Minutos',
          type: 'text',
          visible: true,
          locked: true,
          x: 20,
          y: 40,
          width: 60,
          height: 20,
        },
      ],
    },
  ]);

  const [activeSceneId, setActiveSceneId] = useState<string>('scene-game');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>('src-cam');
  const [isStudioMode, setIsStudioMode] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Audio Channels
  const [audioChannels, setAudioChannels] = useState<AudioChannel[]>([
    {
      id: 'desktop-audio',
      name: 'Áudio do Desktop',
      sublabel: 'Sistema / Jogo',
      volume: 0.85,
      db: -3.5,
      peak: 75,
      muted: false,
      type: 'desktop',
    },
    {
      id: 'mic-aux',
      name: 'Mic/Aux (Shure SM7B)',
      sublabel: 'Voz Principal',
      volume: 0.9,
      db: -12.0,
      peak: 68,
      muted: false,
      type: 'mic',
    },
    {
      id: 'spotify-music',
      name: 'Música de Fundo',
      sublabel: 'Spotify BGM',
      volume: 0.45,
      db: -24.0,
      peak: 40,
      muted: false,
      type: 'music',
    },
    {
      id: 'discord-call',
      name: 'Discord / Amigos',
      sublabel: 'Chat de Voz',
      volume: 0.75,
      db: -14.2,
      peak: 60,
      muted: false,
      type: 'aux',
    },
  ]);

  // Stream Stats
  const [stats, setStats] = useState<StreamStats>({
    isStreaming: false,
    isRecording: false,
    isRecordingPaused: false,
    isVirtualCam: false,
    streamDuration: 0,
    recordDuration: 0,
    cpu: 1.8,
    fps: 60.0,
    bitrate: 6000,
    droppedFrames: 0,
    droppedPercent: 0.0,
  });

  // Streaming / Recording timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => {
        let streamDur = prev.streamDuration;
        let recDur = prev.recordDuration;

        if (prev.isStreaming) streamDur += 1;
        if (prev.isRecording && !prev.isRecordingPaused) recDur += 1;

        // Realistic CPU & Bitrate flutter
        const cpuNoise = (Math.random() - 0.5) * 0.4;
        const newCpu = Math.max(1.1, Math.min(4.8, prev.cpu + cpuNoise));

        const bitrateNoise = Math.floor((Math.random() - 0.5) * 80);
        const newBitrate = prev.isStreaming
          ? Math.max(5800, Math.min(6250, 6000 + bitrateNoise))
          : 0;

        return {
          ...prev,
          streamDuration: streamDur,
          recordDuration: recDur,
          cpu: Math.round(newCpu * 10) / 10,
          bitrate: newBitrate,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];

  const handleUpdateAudioChannel = (id: string, updates: Partial<AudioChannel>) => {
    setAudioChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, ...updates } : ch))
    );
  };

  const handleToggleSourceVisibility = (id: string) => {
    setScenes((prev) =>
      prev.map((sc) => {
        if (sc.id !== activeSceneId) return sc;
        return {
          ...sc,
          sources: sc.sources.map((src) =>
            src.id === id ? { ...src, visible: !src.visible } : src
          ),
        };
      })
    );
  };

  const handleToggleSourceLock = (id: string) => {
    setScenes((prev) =>
      prev.map((sc) => {
        if (sc.id !== activeSceneId) return sc;
        return {
          ...sc,
          sources: sc.sources.map((src) =>
            src.id === id ? { ...src, locked: !src.locked } : src
          ),
        };
      })
    );
  };

  const handleAddSource = (newSource: ObsSource) => {
    setScenes((prev) =>
      prev.map((sc) => {
        if (sc.id !== activeSceneId) return sc;
        return {
          ...sc,
          sources: [newSource, ...sc.sources],
        };
      })
    );
    setSelectedSourceId(newSource.id);
  };

  const handleDeleteSource = (id: string) => {
    setScenes((prev) =>
      prev.map((sc) => {
        if (sc.id !== activeSceneId) return sc;
        return {
          ...sc,
          sources: sc.sources.filter((src) => src.id !== id),
        };
      })
    );
    setSelectedSourceId(null);
  };

  const handleAddScene = (name: string) => {
    const newScene: ObsScene = {
      id: `scene-${Date.now()}`,
      name,
      sources: [],
    };
    setScenes((prev) => [...prev, newScene]);
    setActiveSceneId(newScene.id);
  };

  const handleDeleteScene = (id: string) => {
    if (scenes.length <= 1) return;
    const remaining = scenes.filter((s) => s.id !== id);
    setScenes(remaining);
    setActiveSceneId(remaining[0].id);
  };

  const menus = ['Arquivo', 'Editar', 'Exibir', 'Painéis', 'Perfil', 'Coleção de Cenas', 'Ferramentas', 'Ajuda'];

  return (
    <div
      className="flex flex-col w-full h-[760px] max-h-[85vh] rounded-lg border shadow-2xl overflow-hidden select-none transition-colors"
      style={{
        backgroundColor: theme.bgColor,
        borderColor: theme.borderColor,
        color: theme.textColor,
      }}
    >
      {/* ================= OBS TITLEBAR ================= */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b text-xs select-none"
        style={{
          backgroundColor: theme.surfaceHeader,
          borderColor: theme.borderColor,
          color: theme.textColor,
        }}
      >
        <div className="flex items-center gap-2">
          {/* OBS Studio modern logo glyph */}
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
            style={{ backgroundColor: theme.accentColor }}
          >
            ●
          </div>
          <span className="font-medium tracking-tight text-[11px] text-zinc-300">
            OBS Studio 30.2.0 (64-bit, Windows) - Perfil: Padrão - Cenas: {activeScene.name}
          </span>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          {onOpenSnapshot && (
            <button
              onClick={onOpenSnapshot}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/60 transition-colors flex items-center gap-1 mr-2"
              title="Gerar e visualizar captura de tela em alta resolução (1080p)"
            >
              <span>📸 Ver Imagem</span>
            </button>
          )}
          <button className="hover:text-white p-1">
            <Minimize2 className="w-3 h-3" />
          </button>
          <button className="hover:text-white p-1">
            <Maximize2 className="w-3 h-3" />
          </button>
          <button className="hover:text-red-400 p-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ================= MENU BAR ================= */}
      <div
        className="flex items-center px-2 py-0.5 border-b text-[11px] relative z-30"
        style={{
          backgroundColor: theme.surfaceHeader,
          borderColor: theme.borderColor,
        }}
      >
        {menus.map((m) => (
          <div key={m} className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === m ? null : m)}
              className={`px-2 py-1 rounded text-zinc-300 hover:text-white transition-colors ${
                activeMenu === m ? 'bg-zinc-800 text-white' : ''
              }`}
            >
              {m}
            </button>

            {/* Menu Dropdown */}
            {activeMenu === m && (
              <div
                className="absolute top-full left-0 mt-0.5 w-48 rounded border shadow-xl py-1 z-40 text-xs"
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                }}
              >
                {m === 'Arquivo' && (
                  <>
                    <button
                      onClick={() => setActiveMenu(null)}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                    >
                      Mostrar Gravações
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        onOpenSettings();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                    >
                      Configurações...
                    </button>
                    <div className="border-t my-1 border-zinc-800" />
                    <button
                      onClick={() => setActiveMenu(null)}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-red-400"
                    >
                      Sair
                    </button>
                  </>
                )}
                {m === 'Painéis' && (
                  <>
                    <button
                      onClick={() => setActiveMenu(null)}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between"
                    >
                      <span>Travar Painéis</span>
                      <span className="text-[10px] text-zinc-500">✓</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu(null)}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                    >
                      Redefinir Interface
                    </button>
                  </>
                )}
                {m !== 'Arquivo' && m !== 'Painéis' && (
                  <div className="px-3 py-2 text-[11px] text-zinc-400">
                    Menu {m} do OBS Studio
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= MAIN PREVIEW CANVAS ================= */}
      <div className="flex-1 flex flex-col min-h-0">
        <CanvasPreview
          theme={theme}
          sources={activeScene.sources}
          selectedSourceId={selectedSourceId}
          onSelectSource={setSelectedSourceId}
          isStudioMode={isStudioMode}
          sceneName={activeScene.name}
        />
      </div>

      {/* ================= DOCKS STRIP (BOTTOM OBS DOCKS) ================= */}
      <div
        className="h-64 border-t p-2 grid grid-cols-1 lg:grid-cols-12 gap-2 overflow-hidden"
        style={{
          backgroundColor: theme.bgColor,
          borderColor: theme.borderColor,
        }}
      >
        {/* Scenes & Sources: 5 cols */}
        <div className="lg:col-span-5 h-full">
          <ScenesSourcesDocks
            theme={theme}
            scenes={scenes}
            activeSceneId={activeSceneId}
            onSelectScene={setActiveSceneId}
            onAddScene={handleAddScene}
            onDeleteScene={handleDeleteScene}
            selectedSourceId={selectedSourceId}
            onSelectSource={setSelectedSourceId}
            onToggleSourceVisibility={handleToggleSourceVisibility}
            onToggleSourceLock={handleToggleSourceLock}
            onAddSource={handleAddSource}
            onDeleteSource={handleDeleteSource}
          />
        </div>

        {/* Audio Mixer: 4 cols */}
        <div className="lg:col-span-4 h-full border rounded overflow-hidden" style={{ borderColor: theme.borderColor }}>
          <AudioMixerDock
            theme={theme}
            channels={audioChannels}
            onUpdateChannel={handleUpdateAudioChannel}
            onOpenAdvancedAudio={onOpenAdvancedAudio}
          />
        </div>

        {/* Transitions & Controls: 3 cols */}
        <div className="lg:col-span-3 h-full">
          <ControlsDock
            theme={theme}
            stats={stats}
            onToggleStreaming={() =>
              setStats((prev) => ({ ...prev, isStreaming: !prev.isStreaming }))
            }
            onToggleRecording={() =>
              setStats((prev) => ({ ...prev, isRecording: !prev.isRecording }))
            }
            onTogglePauseRecording={() =>
              setStats((prev) => ({
                ...prev,
                isRecordingPaused: !prev.isRecordingPaused,
              }))
            }
            onToggleVirtualCam={() =>
              setStats((prev) => ({ ...prev, isVirtualCam: !prev.isVirtualCam }))
            }
            onToggleStudioMode={() => setIsStudioMode(!isStudioMode)}
            onOpenSettings={onOpenSettings}
            onTransitionExecute={() => {
              // Quick trigger transition effect
              const nextId =
                scenes.find((s) => s.id !== activeSceneId)?.id || activeSceneId;
              setActiveSceneId(nextId);
            }}
          />
        </div>
      </div>

      {/* ================= STATUS BAR ================= */}
      <div
        className="flex items-center justify-between px-3 py-1 border-t text-[11px] font-mono select-none"
        style={{
          backgroundColor: theme.surfaceHeader,
          borderColor: theme.borderColor,
          color: theme.textMuted,
        }}
      >
        {/* Live / Rec Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                stats.isStreaming ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <span className={stats.isStreaming ? 'text-red-400 font-bold' : ''}>
              LIVE: {stats.isStreaming ? '00:14:28' : '00:00:00'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                stats.isRecording ? 'bg-amber-500' : 'bg-zinc-600'
              }`}
            />
            <span className={stats.isRecording ? 'text-amber-400 font-bold' : ''}>
              REC: {stats.isRecording ? '00:08:12' : '00:00:00'}
            </span>
          </div>
        </div>

        {/* Telemetry Stats: CPU, FPS, Bitrate */}
        <div className="flex items-center gap-4 text-zinc-400">
          <span>
            Quadros perdidos:{' '}
            <strong className="text-zinc-200">
              {stats.droppedFrames} ({stats.droppedPercent.toFixed(1)}%)
            </strong>
          </span>
          <span>
            CPU: <strong className="text-zinc-200">{stats.cpu.toFixed(1)}%</strong>
          </span>
          <span>
            FPS: <strong className="text-zinc-200">{stats.fps.toFixed(2)}</strong>
          </span>
          <span>
            Kbps:{' '}
            <strong className="text-zinc-200">
              {stats.isStreaming ? stats.bitrate : 0} kbps
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
