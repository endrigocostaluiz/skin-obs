import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Check,
  Sparkles,
} from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface PreviewSnapshotModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewSnapshotModal: React.FC<PreviewSnapshotModalProps> = ({
  theme,
  isOpen,
  onClose,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsRendering(true);

    const timer = setTimeout(() => {
      renderHighResObsImage();
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, theme]);

  const renderHighResObsImage = () => {
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = theme.bgColor;
    const surface = theme.surfaceColor;
    const surfaceHeader = theme.surfaceHeader;
    const border = theme.borderColor;
    const text = theme.textColor;
    const textMuted = theme.textMuted;
    const accent = theme.accentColor;

    // 1. Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1920, 1080);

    // 2. Window Titlebar
    ctx.fillStyle = surfaceHeader;
    ctx.fillRect(0, 0, 1920, 42);
    ctx.fillStyle = border;
    ctx.fillRect(0, 41, 1920, 1);

    // Titlebar glyph and text
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(24, 21, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = text;
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `OBS Studio 30.2.0 (64-bit, Windows) - Perfil: Padrão - Tema: Lumina ${theme.name}`,
      44,
      26
    );

    // Window controls
    ctx.fillStyle = textMuted;
    ctx.font = '14px monospace';
    ctx.fillText('—  □  ✕', 1840, 26);

    // 3. Menu Bar
    ctx.fillStyle = surfaceHeader;
    ctx.fillRect(0, 42, 1920, 36);
    ctx.fillStyle = border;
    ctx.fillRect(0, 77, 1920, 1);

    const menus = ['Arquivo', 'Editar', 'Exibir', 'Painéis', 'Perfil', 'Coleção de Cenas', 'Ferramentas', 'Ajuda'];
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    let menuX = 20;
    menus.forEach((m) => {
      ctx.fillStyle = textMuted;
      ctx.fillText(m, menuX, 64);
      menuX += ctx.measureText(m).width + 24;
    });

    // 4. Main Preview Canvas Area
    const canvasAreaY = 78;
    const canvasAreaHeight = 672;
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, canvasAreaY, 1920, canvasAreaHeight);

    // 16:9 Central Video Preview
    const pWidth = 1120;
    const pHeight = 630;
    const pX = (1920 - pWidth) / 2;
    const pY = canvasAreaY + (canvasAreaHeight - pHeight) / 2;

    // Outer border of preview
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(pX, pY, pWidth, pHeight);

    // Stream Scene content
    const grad = ctx.createLinearGradient(pX, pY, pX + pWidth, pY + pHeight);
    grad.addColorStop(0, '#0c1220');
    grad.addColorStop(0.5, '#17223b');
    grad.addColorStop(1, '#0a0d14');
    ctx.fillStyle = grad;
    ctx.fillRect(pX, pY, pWidth, pHeight);

    // Grid lines on stream feed
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 1;
    for (let gx = pX; gx < pX + pWidth; gx += 50) {
      ctx.beginPath();
      ctx.moveTo(gx, pY);
      ctx.lineTo(gx, pY + pHeight);
      ctx.stroke();
    }
    for (let gy = pY; gy < pY + pHeight; gy += 50) {
      ctx.beginPath();
      ctx.moveTo(pX, gy);
      ctx.lineTo(pX + pWidth, gy);
      ctx.stroke();
    }

    // Glowing energy sphere on game preview
    const radial = ctx.createRadialGradient(pX + pWidth * 0.45, pY + pHeight * 0.45, 10, pX + pWidth * 0.45, pY + pHeight * 0.45, 220);
    radial.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    radial.addColorStop(0.5, 'rgba(139, 92, 246, 0.25)');
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(pX + pWidth * 0.45, pY + pHeight * 0.45, 220, 0, Math.PI * 2);
    ctx.fill();

    // Stream HUD text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('WORLD 04 // 60 FPS • 1920x1080', pX + 30, pY + 45);

    // Facecam box on canvas
    const camW = 280;
    const camH = 170;
    const camX = pX + pWidth - camW - 25;
    const camY = pY + pHeight - camH - 25;

    ctx.fillStyle = '#141822';
    ctx.fillRect(camX, camY, camW, camH);
    ctx.strokeStyle = '#384152';
    ctx.strokeRect(camX, camY, camW, camH);

    ctx.fillStyle = accent;
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FACECAM 1080p (Shure SM7B)', camX + 16, camY + 30);
    ctx.fillStyle = textMuted;
    ctx.font = '11px monospace';
    ctx.fillText('DISPOSITIVO DE VÍDEO ATIVO', camX + 16, camY + 48);

    // Red transform outline on selected source
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(camX, camY, camW, camH);
    // handles
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(camX - 3, camY - 3, 6, 6);
    ctx.fillRect(camX + camW - 3, camY - 3, 6, 6);
    ctx.fillRect(camX - 3, camY + camH - 3, 6, 6);
    ctx.fillRect(camX + camW - 3, camY + camH - 3, 6, 6);

    // Resolution badge
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(pX + 15, pY + pHeight - 40, 220, 26);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('1920x1080 @ 60.00 FPS', pX + 25, pY + pHeight - 22);

    // 5. Bottom Docks Strip
    const docksY = 750;
    const docksHeight = 290;
    ctx.fillStyle = bg;
    ctx.fillRect(0, docksY, 1920, docksHeight);
    ctx.fillStyle = border;
    ctx.fillRect(0, docksY, 1920, 1);

    // Dock 1: Cenas (Scenes)
    const d1W = 280;
    ctx.fillStyle = surface;
    ctx.fillRect(15, docksY + 10, d1W, docksHeight - 20);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(15, docksY + 10, d1W, docksHeight - 20);

    ctx.fillStyle = surfaceHeader;
    ctx.fillRect(15, docksY + 10, d1W, 32);
    ctx.fillStyle = text;
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CENAS', 28, docksY + 31);

    // Scenes items
    const sceneItems = ['🎮 Jogo + Facecam', '💬 Conversa & Chat', '☕ Pausa (BRB)'];
    sceneItems.forEach((sc, i) => {
      const sy = docksY + 50 + i * 36;
      if (i === 0) {
        ctx.fillStyle = theme.surfaceHover;
        ctx.fillRect(20, sy, d1W - 10, 30);
        ctx.fillStyle = accent;
        ctx.fillRect(20, sy, 3, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      } else {
        ctx.fillStyle = textMuted;
        ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      }
      ctx.fillText(sc, 32, sy + 20);
    });

    // Dock 2: Fontes (Sources)
    const d2X = 310;
    const d2W = 380;
    ctx.fillStyle = surface;
    ctx.fillRect(d2X, docksY + 10, d2W, docksHeight - 20);
    ctx.strokeRect(d2X, docksY + 10, d2W, docksHeight - 20);

    ctx.fillStyle = surfaceHeader;
    ctx.fillRect(d2X, docksY + 10, d2W, 32);
    ctx.fillStyle = text;
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FONTES', d2X + 15, docksY + 31);

    const sourceItems = [
      'Dispositivo de Captura de Vídeo (Webcam)',
      'Captura de Jogo (DirectX/Vulkan)',
      'Alerta de Subs (Browser Source)',
      'Chat da Twitch / Kick',
    ];
    sourceItems.forEach((src, i) => {
      const sy = docksY + 50 + i * 36;
      if (i === 0) {
        ctx.fillStyle = theme.surfaceHover;
        ctx.fillRect(d2X + 6, sy, d2W - 12, 30);
        ctx.strokeStyle = accent;
        ctx.strokeRect(d2X + 6, sy, d2W - 12, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      } else {
        ctx.fillStyle = textMuted;
        ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      }
      ctx.fillText(src, d2X + 18, sy + 20);
      // Eye & Lock mock
      ctx.fillStyle = textMuted;
      ctx.fillText('👁 🔒', d2X + d2W - 45, sy + 20);
    });

    // Dock 3: Mixer de Áudio
    const d3X = 705;
    const d3W = 680;
    ctx.fillStyle = surface;
    ctx.fillRect(d3X, docksY + 10, d3W, docksHeight - 20);
    ctx.strokeRect(d3X, docksY + 10, d3W, docksHeight - 20);

    ctx.fillStyle = surfaceHeader;
    ctx.fillRect(d3X, docksY + 10, d3W, 32);
    ctx.fillStyle = text;
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MIXER DE ÁUDIO', d3X + 15, docksY + 31);

    // Audio channels
    const audioItems = [
      { name: 'Mic/Aux (Shure SM7B)', level: 0.76, db: '-9.2 dB', state: 'SPEECH' },
      { name: 'Áudio do Desktop (Jogo)', level: 0.62, db: '-18.5 dB', state: 'NORMAL' },
      { name: 'Música Spotify BGM', level: 0.44, db: '-26.0 dB', state: 'NORMAL' },
    ];

    audioItems.forEach((aud, i) => {
      const ay = docksY + 54 + i * 68;
      ctx.fillStyle = text;
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(aud.name, d3X + 16, ay + 12);

      ctx.fillStyle = aud.level > 0.7 ? '#F59E0B' : '#22C55E';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(aud.db, d3X + d3W - 75, ay + 12);

      // VU Meter Bar
      const meterW = d3W - 32;
      const meterH = 14;
      ctx.fillStyle = '#080A0D';
      ctx.fillRect(d3X + 16, ay + 20, meterW, meterH);
      ctx.strokeStyle = '#272E3B';
      ctx.strokeRect(d3X + 16, ay + 20, meterW, meterH);

      // Meter fill
      const meterFillGrad = ctx.createLinearGradient(d3X + 16, 0, d3X + 16 + meterW, 0);
      meterFillGrad.addColorStop(0, '#22C55E');
      meterFillGrad.addColorStop(0.65, '#22C55E');
      meterFillGrad.addColorStop(0.85, '#EAB308');
      meterFillGrad.addColorStop(1.0, '#EF4444');
      ctx.fillStyle = meterFillGrad;
      ctx.fillRect(d3X + 17, ay + 21, (meterW - 2) * aud.level, meterH - 2);

      // Peak Hold
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(d3X + 16 + meterW * (aud.level + 0.05), ay + 19, 2, meterH + 2);

      // Scale ticks
      ctx.fillStyle = textMuted;
      ctx.font = '9px monospace';
      ctx.fillText('-inf     -40     -30     -20     -10     -5      0 dB', d3X + 16, ay + 46);
    });

    // Dock 4: Controles
    const d4X = 1400;
    const d4W = 505;
    ctx.fillStyle = surface;
    ctx.fillRect(d4X, docksY + 10, d4W, docksHeight - 20);
    ctx.strokeRect(d4X, docksY + 10, d4W, docksHeight - 20);

    ctx.fillStyle = surfaceHeader;
    ctx.fillRect(d4X, docksY + 10, d4W, 32);
    ctx.fillStyle = text;
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CONTROLES PRINCIPAIS', d4X + 15, docksY + 31);

    // Primary Red Stream Button
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(d4X + 16, docksY + 52, d4W - 32, 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('● INTERROMPER TRANSMISSÃO (AO VIVO: 01:24:18)', d4X + 70, docksY + 75);

    // Recording Button
    ctx.fillStyle = theme.surfaceHover;
    ctx.fillRect(d4X + 16, docksY + 96, d4W - 32, 34);
    ctx.strokeStyle = border;
    ctx.strokeRect(d4X + 16, docksY + 96, d4W - 32, 34);
    ctx.fillStyle = text;
    ctx.fillText('Iniciar Gravação', d4X + 30, docksY + 118);

    // Virtual Cam Button
    ctx.fillStyle = theme.surfaceHover;
    ctx.fillRect(d4X + 16, docksY + 138, d4W - 32, 34);
    ctx.strokeRect(d4X + 16, docksY + 138, d4W - 32, 34);
    ctx.fillStyle = text;
    ctx.fillText('Iniciar Câmera Virtual', d4X + 30, docksY + 160);

    // Studio Mode Button
    ctx.fillStyle = theme.surfaceHover;
    ctx.fillRect(d4X + 16, docksY + 180, d4W - 32, 34);
    ctx.strokeRect(d4X + 16, docksY + 180, d4W - 32, 34);
    ctx.fillStyle = text;
    ctx.fillText('Modo Estúdio', d4X + 30, docksY + 202);

    // Settings Button
    ctx.fillStyle = theme.surfaceHover;
    ctx.fillRect(d4X + 16, docksY + 222, d4W - 32, 34);
    ctx.strokeRect(d4X + 16, docksY + 222, d4W - 32, 34);
    ctx.fillStyle = text;
    ctx.fillText('Configurações', d4X + 30, docksY + 244);

    // 6. Status Bar Bottom
    ctx.fillStyle = surfaceHeader;
    ctx.fillRect(0, 1045, 1920, 35);
    ctx.fillStyle = border;
    ctx.fillRect(0, 1045, 1920, 1);

    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(25, 1062, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('LIVE: 01:24:18', 38, 1066);

    ctx.fillStyle = textMuted;
    ctx.fillText('REC: 00:00:00', 170, 1066);
    ctx.fillText('Quadros perdidos: 0 (0.0%)', 310, 1066);
    ctx.fillText('CPU: 1.8%', 530, 1066);
    ctx.fillText('FPS: 60.00', 640, 1066);
    ctx.fillText('Kbps: 6000 kbps', 750, 1066);

    // Convert to Image URL
    const url = canvas.toDataURL('image/png');
    setImageUrl(url);
    setIsRendering(false);
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `OBS-Lumina-${theme.id}-Preview-1080p.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Captura de Prévia em Alta Resolução (1080p Full HD)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Visualize exatamente como o OBS Studio ficará na sua tela antes de instalar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => (z === 1 ? 1.4 : 1))}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs text-zinc-300 hover:text-white"
            >
              {zoomLevel === 1 ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
              <span>{zoomLevel === 1 ? 'Zoom 140%' : 'Ajustar'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={!imageUrl}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Imagem PNG</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/95">
          {isRendering ? (
            <div className="flex flex-col items-center gap-3 text-zinc-400 py-24">
              <Sparkles className="w-6 h-6 animate-spin text-blue-400" />
              <span className="text-xs">Renderizando imagem em 1920x1080...</span>
            </div>
          ) : imageUrl ? (
            <div
              className="relative transition-transform duration-200 shadow-2xl rounded-lg overflow-hidden border border-zinc-800 max-w-full"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
            >
              <img
                src={imageUrl}
                alt={`Preview da Skin Lumina ${theme.name} para OBS`}
                className="w-full h-auto object-contain block max-h-[75vh]"
              />
            </div>
          ) : null}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-zinc-800 bg-zinc-950 text-xs text-zinc-400">
          <span>
            Tema renderizado: <strong className="text-white">Lumina {theme.name}</strong> • Resolução: 1920x1080 PNG
          </span>

          <span className="text-[11px] text-zinc-500 font-mono">
            Compatível com Windows 10/11, macOS Sequoia e Linux
          </span>
        </div>
      </div>
    </div>
  );
};
