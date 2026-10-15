import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  FolderPlus,
  Monitor,
  Camera,
  Globe,
  Gamepad2,
  Mic,
  Image,
  Type,
  Maximize,
  Sliders,
  Check,
} from 'lucide-react';
import { ObsScene, ObsSource, ThemeConfig } from '../types/theme';

interface ScenesSourcesDocksProps {
  theme: ThemeConfig;
  scenes: ObsScene[];
  activeSceneId: string;
  onSelectScene: (id: string) => void;
  onAddScene: (name: string) => void;
  onDeleteScene: (id: string) => void;
  selectedSourceId: string | null;
  onSelectSource: (id: string | null) => void;
  onToggleSourceVisibility: (id: string) => void;
  onToggleSourceLock: (id: string) => void;
  onAddSource: (source: ObsSource) => void;
  onDeleteSource: (id: string) => void;
}

export const ScenesSourcesDocks: React.FC<ScenesSourcesDocksProps> = ({
  theme,
  scenes,
  activeSceneId,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  selectedSourceId,
  onSelectSource,
  onToggleSourceVisibility,
  onToggleSourceLock,
  onAddSource,
  onDeleteSource,
}) => {
  const [showAddSceneModal, setShowAddSceneModal] = useState<boolean>(false);
  const [newSceneName, setNewSceneName] = useState<string>('');
  const [showAddSourceModal, setShowAddSourceModal] = useState<boolean>(false);
  const [newSourceName, setNewSourceName] = useState<string>('');
  const [selectedSourceType, setSelectedSourceType] = useState<ObsSource['type']>('browser');

  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];

  const handleCreateScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneName.trim()) return;
    onAddScene(newSceneName.trim());
    setNewSceneName('');
    setShowAddSceneModal(false);
  };

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    const newSource: ObsSource = {
      id: `src-${Date.now()}`,
      name: newSourceName.trim(),
      type: selectedSourceType,
      visible: true,
      locked: false,
      x: 10,
      y: 10,
      width: 40,
      height: 35,
    };
    onAddSource(newSource);
    setNewSourceName('');
    setShowAddSourceModal(false);
  };

  const getSourceIcon = (type: ObsSource['type']) => {
    switch (type) {
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-blue-400" />;
      case 'game':
        return <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'browser':
        return <Globe className="w-3.5 h-3.5 text-amber-400" />;
      case 'audio':
        return <Mic className="w-3.5 h-3.5 text-purple-400" />;
      case 'display':
        return <Monitor className="w-3.5 h-3.5 text-cyan-400" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Image className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
      {/* ===================== CENAS (SCENES) DOCK ===================== */}
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
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Cenas</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {scenes.length} {scenes.length === 1 ? 'cena' : 'cenas'}
          </span>
        </div>

        {/* Scene List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {scenes.map((scene) => {
            const isActive = scene.id === activeSceneId;
            return (
              <div
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer text-xs transition-colors group ${
                  isActive
                    ? 'font-semibold text-white shadow-xs'
                    : 'text-zinc-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: isActive ? theme.surfaceHover : 'transparent',
                  borderLeft: isActive ? `3px solid ${theme.accentColor}` : '3px solid transparent',
                }}
              >
                <span className="truncate">{scene.name}</span>
                <span className="text-[10px] font-mono text-zinc-500 opacity-60 group-hover:opacity-100">
                  {scene.sources.length} fontes
                </span>
              </div>
            );
          })}
        </div>

        {/* Scene Action Toolbar */}
        <div
          className="flex items-center gap-1 p-1.5 border-t"
          style={{
            backgroundColor: theme.surfaceHeader,
            borderColor: theme.borderColor,
          }}
        >
          <button
            onClick={() => setShowAddSceneModal(true)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Adicionar Nova Cena"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (scenes.length > 1) {
                onDeleteScene(activeSceneId);
              }
            }}
            disabled={scenes.length <= 1}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:text-zinc-400"
            title="Remover Cena Selecionada"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => {
              const idx = scenes.findIndex((s) => s.id === activeSceneId);
              if (idx > 0) {
                onSelectScene(scenes[idx - 1].id);
              }
            }}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Mover Cena Acima"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const idx = scenes.findIndex((s) => s.id === activeSceneId);
              if (idx < scenes.length - 1) {
                onSelectScene(scenes[idx + 1].id);
              }
            }}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Mover Cena Abaixo"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================== FONTES (SOURCES) DOCK ===================== */}
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
            <Monitor className="w-3.5 h-3.5 text-zinc-400" />
            <span>Fontes</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {activeScene.sources.length} itens
          </span>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {activeScene.sources.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500">
              Nenhuma fonte nesta cena.
              <br />
              Clique em + abaixo para adicionar.
            </div>
          ) : (
            activeScene.sources.map((source) => {
              const isSelected = source.id === selectedSourceId;
              return (
                <div
                  key={source.id}
                  onClick={() => onSelectSource(source.id)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-xs transition-colors group ${
                    isSelected
                      ? 'font-medium text-white ring-1'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? theme.surfaceHover : 'transparent',
                    borderColor: isSelected ? theme.accentColor : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getSourceIcon(source.type)}
                    <span
                      className={`truncate ${
                        !source.visible ? 'line-through text-zinc-500' : ''
                      }`}
                    >
                      {source.name}
                    </span>
                  </div>

                  {/* Source quick toggles: Eye (visibility) & Lock */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSourceVisibility(source.id);
                      }}
                      className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                        source.visible ? 'text-zinc-400 hover:text-white' : 'text-zinc-600'
                      }`}
                      title={source.visible ? 'Ocultar Fonte' : 'Exibir Fonte'}
                    >
                      {source.visible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSourceLock(source.id);
                      }}
                      className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                        source.locked ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title={source.locked ? 'Desbloquear Fonte' : 'Bloquear Fonte (Travar Posição)'}
                    >
                      {source.locked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Source Action Toolbar */}
        <div
          className="flex items-center gap-1 p-1.5 border-t"
          style={{
            backgroundColor: theme.surfaceHeader,
            borderColor: theme.borderColor,
          }}
        >
          <button
            onClick={() => setShowAddSourceModal(true)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Adicionar Fonte"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (selectedSourceId) {
                onDeleteSource(selectedSourceId);
              }
            }}
            disabled={!selectedSourceId}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:text-zinc-400"
            title="Remover Fonte Selecionada"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal: Adicionar Cena */}
      {showAddSceneModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-sm rounded-lg border shadow-2xl p-4"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <h3 className="text-sm font-semibold mb-3 text-white">Criar Nova Cena</h3>
            <form onSubmit={handleCreateScene}>
              <input
                type="text"
                autoFocus
                placeholder="Ex: Cena Jogo + Discord"
                value={newSceneName}
                onChange={(e) => setNewSceneName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border bg-zinc-900 border-zinc-700 text-white focus:outline-none mb-3"
                style={{ borderColor: theme.accentColor }}
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddSceneModal(false)}
                  className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded text-white font-medium shadow-sm"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  Criar Cena
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Fonte */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-lg border shadow-2xl p-4"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <h3 className="text-sm font-semibold mb-3 text-white">Adicionar Fonte</h3>
            <form onSubmit={handleCreateSource}>
              <div className="mb-3">
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Nome da Fonte
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Ex: Chat Twitch / Overlay"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border bg-zinc-900 border-zinc-700 text-white focus:outline-none"
                  style={{ borderColor: theme.accentColor }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-[11px] text-zinc-400 mb-1.5">
                  Tipo de Fonte do OBS
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {[
                    { id: 'browser', label: 'Navegador (Alertas/Chat)', icon: Globe },
                    { id: 'camera', label: 'Dispositivo Vídeo (Webcam)', icon: Camera },
                    { id: 'game', label: 'Captura de Jogo', icon: Gamepad2 },
                    { id: 'display', label: 'Captura de Tela', icon: Monitor },
                    { id: 'audio', label: 'Captura Áudio (Mic/Aux)', icon: Mic },
                    { id: 'text', label: 'Texto (GDI+)', icon: Type },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = selectedSourceType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedSourceType(t.id as any)}
                        className={`flex items-center gap-2 p-2 rounded text-xs border text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddSourceModal(false)}
                  className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newSourceName.trim()}
                  className="px-3 py-1.5 rounded text-white font-medium shadow-sm disabled:opacity-40"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
