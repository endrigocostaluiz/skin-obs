import React, { useState, useEffect, useRef } from 'react';
import { Camera, Maximize2, Shield, Eye, VideoOff, RefreshCw } from 'lucide-react';
import { ObsSource, ThemeConfig } from '../types/theme';

interface CanvasPreviewProps {
  theme: ThemeConfig;
  sources: ObsSource[];
  selectedSourceId: string | null;
  onSelectSource: (id: string | null) => void;
  isStudioMode: boolean;
  sceneName: string;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  theme,
  sources,
  selectedSourceId,
  onSelectSource,
  isStudioMode,
  sceneName,
}) => {
  const [showSafeAreas, setShowSafeAreas] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100%'>('fit');
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated game canvas simulation loop
  useEffect(() => {
    let animationFrameId: number;
    let t = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Dark sci-fi game background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0c101c');
      grad.addColorStop(0.5, '#151d30');
      grad.addColorStop(1, '#080a10');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Cyber grid lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Moving energy orbs / simulated game action
      const orbX = (Math.sin(t) * 0.35 + 0.5) * w;
      const orbY = (Math.cos(t * 0.8) * 0.3 + 0.5) * h;
      const radial = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, 120);
      radial.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
      radial.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
      radial.addColorStop(1, 'transparent');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Second pulsing neon point
      const orb2X = (Math.cos(t * 1.2) * 0.35 + 0.5) * w;
      const orb2Y = (Math.sin(t * 0.9) * 0.25 + 0.5) * h;
      const radial2 = ctx.createRadialGradient(orb2X, orb2Y, 5, orb2X, orb2Y, 90);
      radial2.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
      radial2.addColorStop(1, 'transparent');
      ctx.fillStyle = radial2;
      ctx.beginPath();
      ctx.arc(orb2X, orb2Y, 90, 0, Math.PI * 2);
      ctx.fill();

      // UI HUD elements on game canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`WORLD 04 // 60 FPS`, 30, 36);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.fillText(`SIMULATED BROADCAST FEED • 1920x1080`, 30, 54);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // WebRTC User Camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Webcam permission not granted:', err);
          setCameraError('Permissão de câmera não concedida. Usando feed simulado.');
          setUseRealCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [useRealCamera]);

  const toggleRealCamera = () => {
    setUseRealCamera((prev) => !prev);
  };

  const selectedSource = sources.find((s) => s.id === selectedSourceId);

  const renderCanvasView = (isProgram: boolean) => (
    <div
      className={`relative w-full aspect-video bg-black overflow-hidden select-none border transition-colors ${
        isProgram ? 'border-red-600/80' : isStudioMode ? 'border-emerald-500/80' : 'border-zinc-800'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectSource(null);
        }
      }}
    >
      {/* Background Simulated Gameplay / Feed */}
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Render active sources layer */}
      {sources
        .filter((s) => s.visible)
        .map((source) => {
          const isSelected = selectedSourceId === source.id && !isProgram;

          if (source.type === 'camera') {
            return (
              <div
                key={source.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSource(source.id);
                }}
                className={`absolute cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-black' : ''
                }`}
                style={{
                  top: `${source.y}%`,
                  left: `${source.x}%`,
                  width: `${source.width}%`,
                  height: `${source.height}%`,
                }}
              >
                <div className="relative w-full h-full rounded-md overflow-hidden bg-zinc-900 border border-zinc-700 shadow-xl flex items-center justify-center">
                  {useRealCamera ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-zinc-900 via-zinc-800 to-slate-900 flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-white tracking-wide">
                        Facecam 1080p
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono">60.0 FPS</span>
                    </div>
                  )}

                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-mono text-zinc-300">
                    {source.name}
                  </div>
                </div>

                {/* Transform handles if selected */}
                {isSelected && (
                  <>
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-red-500 border border-white" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border border-white" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-red-500 border border-white" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-500 border border-white" />
                  </>
                )}
              </div>
            );
          }

          if (source.type === 'browser') {
            return (
              <div
                key={source.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSource(source.id);
                }}
                className={`absolute cursor-pointer ${
                  isSelected ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-black' : ''
                }`}
                style={{
                  top: `${source.y}%`,
                  left: `${source.x}%`,
                  width: `${source.width}%`,
                  height: `${source.height}%`,
                }}
              >
                <div className="w-full h-full bg-zinc-950/80 backdrop-blur-md rounded border border-blue-500/40 p-2.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-semibold text-white">ÚLTIMO INSCRITO:</span>
                    <span className="text-xs font-mono font-bold text-amber-300">@DevStreamer</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Meta: 84/100</span>
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* EBU Safe Areas Overlay */}
        {showSafeAreas && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Action Safe (90%) */}
            <div className="absolute inset-[5%] border border-dashed border-emerald-400/50 flex items-start justify-end p-1">
              <span className="text-[8px] font-mono text-emerald-400 bg-black/60 px-1">
                90% Ação Segura
              </span>
            </div>
            {/* Title Safe (80%) */}
            <div className="absolute inset-[10%] border border-dashed border-amber-400/50 flex items-start justify-end p-1">
              <span className="text-[8px] font-mono text-amber-400 bg-black/60 px-1">
                80% Título Seguro
              </span>
            </div>
            {/* Center Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-t border-l border-white/40" />
          </div>
        )}

      {/* Program / Preview Badge */}
      <div
        className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md ${
          isProgram ? 'bg-red-600/90 text-white' : 'bg-black/70 text-zinc-200 border border-zinc-700'
        }`}
      >
        {isProgram ? 'PROGRAMA (AO VIVO)' : isStudioMode ? 'PRÉVIA (PREVIEW)' : sceneName}
      </div>

      {/* Resolution Indicator */}
      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-zinc-400 border border-zinc-800">
        1920x1080 @ 60fps
      </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 bg-black/40 overflow-hidden">
      {/* Canvas Toolbar with Usability Controls */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b select-none text-xs"
        style={{
          backgroundColor: theme.surfaceHeader,
          borderColor: theme.borderColor,
          color: theme.textColor,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-xs tracking-wide flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            Prévia do Canvas
          </span>

          <span className="text-[11px] text-zinc-400 font-mono">
            {sceneName} {selectedSource ? `• [${selectedSource.name}]` : ''}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Real Webcam Toggle */}
          <button
            onClick={toggleRealCamera}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              useRealCamera
                ? 'bg-emerald-600 text-white'
                : 'hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}
            title="Usar sua webcam real na prévia do OBS"
          >
            {useRealCamera ? <Camera className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            <span>{useRealCamera ? 'Câmera Ativa' : 'Testar Minha Câmera'}</span>
          </button>

          {/* Safe Areas Guide */}
          <button
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              showSafeAreas
                ? 'bg-blue-600 text-white'
                : 'hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}
            title="Margens de segurança de transmissão (Action & Title Safe)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Guias</span>
          </button>

          {/* Zoom Toggle */}
          <button
            onClick={() => setZoomLevel(zoomLevel === 'fit' ? '100%' : 'fit')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="font-mono">{zoomLevel === 'fit' ? 'Ajustar' : '100%'}</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="bg-amber-950/80 text-amber-200 border-b border-amber-800 text-xs px-3 py-1 flex items-center justify-between">
          <span>{cameraError}</span>
          <button
            onClick={() => setCameraError(null)}
            className="text-amber-400 hover:underline ml-2"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* Canvas Area (Single vs Studio Mode) */}
      <div className="flex-1 p-2 sm:p-4 flex items-center justify-center overflow-auto bg-zinc-950/90">
        {isStudioMode ? (
          <div className="grid grid-cols-2 gap-3 w-full max-w-6xl">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                PRÉVIA (PREVIEW)
              </span>
              {renderCanvasView(false)}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-red-500 font-semibold">
                PROGRAMA (AO VIVO)
              </span>
              {renderCanvasView(true)}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl shadow-2xl">
            {renderCanvasView(false)}
          </div>
        )}
      </div>
    </div>
  );
};
