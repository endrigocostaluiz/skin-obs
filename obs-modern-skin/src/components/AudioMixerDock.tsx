import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, MoreVertical, Sliders } from 'lucide-react';
import { AudioChannel, ThemeConfig } from '../types/theme';

interface AudioMixerDockProps {
  theme: ThemeConfig;
  channels: AudioChannel[];
  onUpdateChannel: (id: string, updates: Partial<AudioChannel>) => void;
  onOpenAdvancedAudio?: () => void;
}

export const AudioMixerDock: React.FC<AudioMixerDockProps> = ({
  theme,
  channels,
  onUpdateChannel,
  onOpenAdvancedAudio,
}) => {
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');
  // Dynamic animated levels for realism
  const [liveLevels, setLiveLevels] = useState<{ [id: string]: number }>({});
  const [peakHolds, setPeakHolds] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    let animationId: number;
    let t = 0;

    const updateMeters = () => {
      t += 0.05;
      const nextLevels: { [id: string]: number } = {};
      const nextPeaks: { [id: string]: number } = { ...peakHolds };

      channels.forEach((ch, idx) => {
        if (ch.muted) {
          nextLevels[ch.id] = 0;
          nextPeaks[ch.id] = 0;
          return;
        }

        // Varied audio patterns: Mic fluctuates with speech rhythms; Desktop has beat pulses
        let target = 0;
        if (ch.type === 'mic') {
          // Voice burst simulation with pauses
          const speechCycle = Math.sin(t * 1.5 + idx);
          const noise = Math.random() * 0.2;
          target = speechCycle > 0 ? (0.45 + speechCycle * 0.35 + noise) * ch.volume : 0.08 * ch.volume;
        } else if (ch.type === 'music') {
          // Continuous rhythmic beat
          target = (0.55 + Math.sin(t * 4) * 0.15 + Math.random() * 0.1) * ch.volume;
        } else {
          // Game / Desktop audio peaks
          target = (0.4 + Math.sin(t * 2 + idx) * 0.25 + Math.random() * 0.15) * ch.volume;
        }

        target = Math.min(Math.max(target, 0.02), 0.98);
        const current = liveLevels[ch.id] || target;
        // Fast attack, smooth decay
        const smoothed = target > current ? target : current * 0.92;
        nextLevels[ch.id] = smoothed;

        // Peak hold decay
        const prevPeak = nextPeaks[ch.id] || 0;
        if (smoothed >= prevPeak) {
          nextPeaks[ch.id] = smoothed;
        } else {
          nextPeaks[ch.id] = Math.max(0, prevPeak - 0.005);
        }
      });

      setLiveLevels(nextLevels);
      setPeakHolds(nextPeaks);
      animationId = requestAnimationFrame(updateMeters);
    };

    animationId = requestAnimationFrame(updateMeters);
    return () => cancelAnimationFrame(animationId);
  }, [channels, liveLevels, peakHolds]);

  // Convert normalized level (0..1) to decibels (-inf to 0 dB)
  const levelToDb = (level: number) => {
    if (level <= 0.01) return -60;
    const db = 20 * Math.log10(level);
    return Math.max(-60, Math.min(0, Math.round(db * 10) / 10));
  };

  const getMeterColor = (val: number) => {
    // Standard broadcast color zones:
    // 0 to 0.65 -> Green (Normal -60 to -20 dB)
    // 0.65 to 0.85 -> Yellow (Ideal Voice Target -20 to -9 dB)
    // 0.85 to 1.0 -> Red (Clip Warning -9 to 0 dB)
    if (val < 0.65) return '#22C55E';
    if (val < 0.85) return '#EAB308';
    return '#EF4444';
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden select-none"
      style={{
        backgroundColor: theme.surfaceColor,
        borderColor: theme.borderColor,
      }}
    >
      {/* Dock Header */}
      <div
        className="flex items-center justify-between px-2.5 py-1.5 border-b text-xs font-semibold"
        style={{
          backgroundColor: theme.surfaceHeader,
          borderColor: theme.borderColor,
          color: theme.textColor,
        }}
      >
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
          <span>Mixer de Áudio</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setLayoutMode(layoutMode === 'horizontal' ? 'vertical' : 'horizontal')
            }
            className="px-1.5 py-0.5 rounded text-[10px] font-mono hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
            title="Alternar entre layout horizontal e vertical"
          >
            {layoutMode === 'horizontal' ? 'H' : 'V'}
          </button>
          <button
            onClick={onOpenAdvancedAudio}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Propriedades de Áudio Avançadas"
          >
            <Settings className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {channels.map((ch) => {
          const currentLevel = liveLevels[ch.id] || 0;
          const peak = peakHolds[ch.id] || 0;
          const dbValue = levelToDb(currentLevel);

          return (
            <div
              key={ch.id}
              className="p-2 rounded border transition-colors group"
              style={{
                backgroundColor: theme.surfaceHover,
                borderColor: theme.borderColor,
              }}
            >
              {/* Channel Label & Readout */}
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-200 truncate max-w-[120px]">
                    {ch.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                    {ch.sublabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] px-1 rounded ${
                      dbValue > -9
                        ? 'text-red-400 bg-red-950/60 font-bold'
                        : dbValue > -20
                        ? 'text-amber-300 font-medium'
                        : 'text-zinc-400'
                    }`}
                  >
                    {ch.muted ? 'MUDO' : `${dbValue.toFixed(1)} dB`}
                  </span>
                  <button
                    onClick={() => onUpdateChannel(ch.id, { muted: !ch.muted })}
                    className={`p-1 rounded transition-colors ${
                      ch.muted
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                    }`}
                    title={ch.muted ? 'Desmutar canal' : 'Mutar canal'}
                  >
                    {ch.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Dynamic VU Meter Bar */}
              <div className="relative w-full h-3.5 bg-black/70 rounded overflow-hidden p-0.5 border border-zinc-800">
                {/* Meter Background Segments / Scale Guides */}
                <div className="absolute inset-0 flex pointer-events-none opacity-20">
                  <div className="w-[65%] border-r border-white/50" />
                  <div className="w-[20%] border-r border-white/50" />
                  <div className="w-[15%]" />
                </div>

                {/* Live Audio Fill */}
                <div
                  className="h-full rounded-xs transition-all duration-75 relative overflow-hidden"
                  style={{
                    width: `${ch.muted ? 0 : currentLevel * 100}%`,
                    background:
                      theme.meterStyle === 'neon'
                        ? 'linear-gradient(90deg, #06B6D4 0%, #3B82F6 65%, #EC4899 85%, #EF4444 100%)'
                        : theme.meterStyle === 'segmented'
                        ? 'repeating-linear-gradient(90deg, #22C55E 0px, #22C55E 4px, transparent 4px, transparent 6px, #EAB308 65%, #EF4444 85%)'
                        : 'linear-gradient(90deg, #22C55E 0%, #22C55E 65%, #EAB308 85%, #EF4444 100%)',
                  }}
                />

                {/* Peak Hold Marker */}
                {!ch.muted && peak > 0.05 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm z-10 transition-all duration-75"
                    style={{ left: `${Math.min(99, peak * 100)}%` }}
                  />
                )}
              </div>

              {/* Decibel Scale Ticks */}
              <div className="flex justify-between text-[8px] font-mono text-zinc-500 px-0.5 mt-0.5">
                <span>-inf</span>
                <span>-40</span>
                <span>-30</span>
                <span className="text-amber-500/80 font-bold">-20</span>
                <span className="text-amber-400 font-bold">-10</span>
                <span className="text-red-500 font-bold">-5</span>
                <span className="text-red-400 font-bold">0</span>
              </div>

              {/* Volume Fader Slider */}
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={ch.volume}
                  onChange={(e) =>
                    onUpdateChannel(ch.id, { volume: parseFloat(e.target.value) })
                  }
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  style={{
                    accentColor: theme.accentColor,
                  }}
                />
                <span className="text-[10px] font-mono text-zinc-400 w-10 text-right">
                  {Math.round(ch.volume * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
