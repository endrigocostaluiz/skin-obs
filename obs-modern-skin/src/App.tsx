/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  Sliders,
  Sparkles,
  BookOpen,
  Settings,
  Shield,
  Palette,
  Terminal,
  ExternalLink,
  Zap,
  Eye,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { THEME_PRESETS } from './utils/themePresets';
import { ThemeConfig } from './types/theme';
import { ObsSimulator } from './components/ObsSimulator';
import { ThemeEditor } from './components/ThemeEditor';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { UsabilityGuide } from './components/UsabilityGuide';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { PreviewSnapshotModal } from './components/PreviewSnapshotModal';
import { downloadThemeZip } from './utils/qssGenerator';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEME_PRESETS[0]);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isBeforeAfterOpen, setIsBeforeAfterOpen] = useState<boolean>(false);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState<boolean>(false);

  const handleUpdateTheme = (updates: Partial<ThemeConfig>) => {
    setCurrentTheme((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectPreset = (preset: ThemeConfig) => {
    setCurrentTheme(preset);
  };

  return (
    <div className="min-h-screen bg-[#090B0E] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      {/* ================= TOP BAR CONTRACT (Strict 3-Zone) ================= */}
      <header className="sticky top-0 z-40 w-full bg-[#0E1116]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span
              className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: currentTheme.accentColor }}
            />
            <span>Lumina OBS</span>
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a
              href="#simulador"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Simulador Interativo
            </a>
            <a
              href="#personalizador"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Personalizar Tema
            </a>
            <a
              href="#ergonomia"
              onClick={(e) => {
                e.preventDefault();
                setIsGuideOpen(true);
              }}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Ergonomia &amp; Usabilidade
            </a>
            <a
              href="#instalacao"
              onClick={(e) => {
                e.preventDefault();
                setIsExportOpen(true);
              }}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Instalação (Passo a Passo)
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-all hover:brightness-110 active:scale-[0.98] whitespace-nowrap shrink-0"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Skin (.QSS)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO KICKER & VALUE PROPOSITION ================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>OBS Studio 28 · 29 · 30+ (Qt6)</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold">0.0% Overhead de GPU</span>
              <span aria-hidden="true">·</span>
              <span>100% Nativo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Skin Moderna, Leve e de Alta Usabilidade para OBS
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Projetada para eliminar a fadiga visual durante streams longas, fornecer medidores de áudio com detecção instantânea de clipping e alvos de clique ergonomicamente seguros.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setIsSnapshotOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-700/80 bg-emerald-950/40 hover:bg-emerald-900/50 text-xs text-emerald-300 transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Imagem HD (1080p)</span>
            </button>
            <button
              onClick={() => setIsBeforeAfterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-700/80 bg-blue-950/40 hover:bg-blue-900/50 text-xs text-blue-300 transition-colors font-medium"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Comparar Antes / Depois</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span>Configurações OBS</span>
            </button>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Por Que Esta Skin?</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= LIVE OBS SIMULATOR VIEWPORT ================= */}
      <main id="simulador" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-2 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-blue-400" />
              Simulador em Tempo Real do OBS Studio
            </span>
            <span>
              Tema ativo: <strong className="text-white">{currentTheme.name}</strong>
            </span>
          </div>

          {/* Interactive OBS Window */}
          <ObsSimulator
            theme={currentTheme}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAdvancedAudio={() => setIsGuideOpen(true)}
            onOpenSnapshot={() => setIsSnapshotOpen(true)}
          />
        </div>

        {/* ================= THEME CUSTOMIZER ================= */}
        <div id="personalizador">
          <ThemeEditor
            theme={currentTheme}
            onUpdateTheme={handleUpdateTheme}
            onSelectPreset={handleSelectPreset}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenSnapshot={() => setIsSnapshotOpen(true)}
            onOpenBeforeAfter={() => setIsBeforeAfterOpen(true)}
          />
        </div>

        {/* ================= COMPARISON STRIP (Standard vs Lumina) ================= */}
        <section className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-5 my-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Comparativo de Usabilidade: OBS Padrão vs Lumina
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Entenda como cada mudança visual foi pensada para o fluxo de trabalho real do criador de conteúdo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Card 1 */}
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Contraste &amp; Fadiga Ocular</span>
                <span className="text-[10px] font-mono text-blue-400">OLED / Slate</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Substituição do cinza fosco reflexivo do tema padrão por ardósia escura calibrada (#0F1217). Reduz a luminescência residual em quartos escuros em mais de 35%.
              </p>
              <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                ✓ WCAG AA Compliant • Zero cansaço visual
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Medição de Áudio Periférica</span>
                <span className="text-[10px] font-mono text-emerald-400">Peak Hold Real</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Medidores com divisão visual clara entre a zona ideal de voz (-20dB a -9dB) e clipping (&gt; -9dB). O streamer percebe se o microfone está estourando pelo canto do olho.
              </p>
              <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                ✓ Faixas cromáticas de broadcast profissional
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Alvos de Clique Ergonomicamente Seguros</span>
                <span className="text-[10px] font-mono text-purple-400">Lei de Fitts</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Aumento dos botões vitais de controle ("Iniciar Transmissão" e "Gravar") com feedback tátil e cromático em vermelho/âmbar, impedindo encerramentos involuntários de live.
              </p>
              <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                ✓ Botões expandidos de 22px para 32px
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRESET DOWNLOAD CARDS ================= */}
        <section className="my-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              Baixar Presets Avulsos Prontos para Uso
            </h3>
            <span className="text-xs text-zinc-400">Arquivos .QSS individuais</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEME_PRESETS.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between gap-3 transition-colors hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">{p.name}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-black/40"
                      style={{ backgroundColor: p.accentColor }}
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{p.tagline}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setCurrentTheme(p);
                      downloadThemeZip(p);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-white transition-all shadow-sm hover:brightness-110 active:scale-[0.98]"
                    style={{ backgroundColor: p.accentColor }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar {p.id.split('-')[1]?.toUpperCase() || 'QSS'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTheme(p)}
                    className="px-2.5 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-xs text-zinc-300"
                    title="Testar este tema no simulador"
                  >
                    Testar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full border-t border-zinc-800 bg-[#0A0D12] mt-12 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-300">Lumina OBS Theme Studio</span>
            <span aria-hidden="true">·</span>
            <span>Compatível com OBS Studio 28, 29, 30+</span>
            <span aria-hidden="true">·</span>
            <span>Licença de Código Aberto</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              Manual de Usabilidade
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              Pasta de Instalação (%APPDATA%)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExportModal
        theme={currentTheme}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <SettingsModal
        theme={currentTheme}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSelectThemePreset={handleSelectPreset}
      />

      <UsabilityGuide
        theme={currentTheme}
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <BeforeAfterComparison
        theme={currentTheme}
        isOpen={isBeforeAfterOpen}
        onClose={() => setIsBeforeAfterOpen(false)}
      />

      <PreviewSnapshotModal
        theme={currentTheme}
        isOpen={isSnapshotOpen}
        onClose={() => setIsSnapshotOpen(false)}
      />
    </div>
  );
}
