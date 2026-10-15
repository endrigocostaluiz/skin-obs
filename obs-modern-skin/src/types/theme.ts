export type MeterStyle = 'gradient' | 'segmented' | 'neon' | 'minimal';
export type CornerRadius = 'sharp' | 'subtle' | 'modern';
export type Density = 'compact' | 'comfortable';

export interface ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  surfaceHover: string;
  surfaceHeader: string;
  borderColor: string;
  textColor: string;
  textMuted: string;
  meterStyle: MeterStyle;
  cornerRadius: CornerRadius;
  density: Density;
  fontSize: number; // 11, 12, 13
  highContrastMeters: boolean;
  glowAccents: boolean;
}

export interface ObsSource {
  id: string;
  name: string;
  type: 'camera' | 'game' | 'audio' | 'browser' | 'display' | 'image' | 'color' | 'text';
  visible: boolean;
  locked: boolean;
  volume?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ObsScene {
  id: string;
  name: string;
  sources: ObsSource[];
}

export interface AudioChannel {
  id: string;
  name: string;
  sublabel: string;
  volume: number; // 0 to 1
  db: number; // -inf to +6 dB
  peak: number; // 0 to 100%
  muted: boolean;
  type: 'mic' | 'desktop' | 'game' | 'music' | 'aux';
}

export interface StreamStats {
  isStreaming: boolean;
  isRecording: boolean;
  isRecordingPaused: boolean;
  isVirtualCam: boolean;
  streamDuration: number;
  recordDuration: number;
  cpu: number;
  fps: number;
  bitrate: number;
  droppedFrames: number;
  droppedPercent: number;
}
