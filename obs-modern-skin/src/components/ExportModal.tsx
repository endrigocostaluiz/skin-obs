import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Terminal,
  FolderOpen,
  FileCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { generateObsQss, generateObsOvt, downloadThemeZip, downloadThemeOvt, downloadInstallerScript } from '../utils/qssGenerator';

interface ExportModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ theme, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'install' | 'qss' | 'ovt'>('install');
  const [copiedQss, setCopiedQss] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  if (!isOpen) return null;

  const qssCode = generateObsQss(theme);
  const ovtCode = generateObsOvt(theme);

  const handleCopyQss = () => {
    navigator.clipboard.writeText(qssCode);
    setCopiedQss(true);
    setTimeout(() => setCopiedQss(false), 2000);
  };

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            <div>
              <h3 className="text-sm font-bold text-white">
                Exportar Skin: Lumina {theme.name}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Arquivos de tema prontos para OBS Studio 28, 29 e 30+ (Qt6)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar (Download Buttons) */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 bg-zinc-950/40 border-b border-zinc-800 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => downloadInstallerScript(theme)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] border border-emerald-500/30"
              style={{ backgroundColor: '#059669' }}
              title="Baixar instalador .bat com instalação em 1 clique para Windows"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Instalador Automático (.BAT)</span>
            </button>

            <button
              onClick={() => downloadThemeZip(theme)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Arquivo .QSS</span>
            </button>

            <button
              onClick={() => downloadThemeOvt(theme)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
              <span>Metadados .OVT</span>
            </button>
          </div>

          <button
            onClick={handleCopyQss}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            {copiedQss ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">QSS Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código QSS</span>
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'install'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            style={{
              borderColor: activeTab === 'install' ? theme.accentColor : undefined,
            }}
          >
            Como Instalar no OBS (Passo a Passo)
          </button>

          <button
            onClick={() => setActiveTab('qss')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'qss'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            style={{
              borderColor: activeTab === 'qss' ? theme.accentColor : undefined,
            }}
          >
            Visualizar Código QSS ({qssCode.split('\n').length} linhas)
          </button>

          <button
            onClick={() => setActiveTab('ovt')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'ovt'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            style={{
              borderColor: activeTab === 'ovt' ? theme.accentColor : undefined,
            }}
          >
            Metadados OVT (JSON)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Quick Installer Banner */}
              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Instalação Automática com 1 Clique (Recomendado para Windows)
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">
                    Baixe o instalador <code className="bg-emerald-900/40 text-emerald-200 px-1 py-0.5 rounded font-mono">.BAT</code> pronto. Ao executar, ele cria a pasta do OBS automaticamente e salva a skin sem complicações.
                  </p>
                </div>
                <button
                  onClick={() => downloadInstallerScript(theme)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm whitespace-nowrap shrink-0 self-center"
                >
                  Baixar Instalador .BAT
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-900/50 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-white block">
                    Instalação 100% Nativa e Segura
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">
                    Este tema utiliza o motor oficial Qt6 do OBS Studio. Não requer plugins de terceiros,
                    não altera arquivos executáveis e não gera consumo de memória extra.
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center shrink-0 text-xs border border-zinc-700">
                    1
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-white">Baixe o arquivo do tema</span>
                    <p className="text-zinc-400 mt-0.5 text-[11px]">
                      Clique no botão acima <strong>"Baixar Arquivo .QSS"</strong> para salvar{' '}
                      <code className="text-zinc-200 bg-zinc-800 px-1 py-0.5 rounded font-mono">
                        Lumina-{theme.id}.qss
                      </code>{' '}
                      em seu computador.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center shrink-0 text-xs border border-zinc-700">
                    2
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-white">Copie para a pasta de temas do OBS</span>
                    <p className="text-zinc-400 mt-0.5 text-[11px]">
                      Abra a pasta correspondente ao seu sistema operacional:
                    </p>

                    {/* Paths by OS */}
                    <div className="mt-2 space-y-1.5">
                      {/* Windows */}
                      <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px]">
                        <div>
                          <span className="text-blue-400 font-bold mr-2">Windows:</span>
                          <span className="text-zinc-300">%APPDATA%\obs-studio\themes</span>
                        </div>
                        <button
                          onClick={() => handleCopyPath('%APPDATA%\\obs-studio\\themes')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        >
                          {copiedPath === '%APPDATA%\\obs-studio\\themes' ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>

                      {/* macOS */}
                      <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px]">
                        <div>
                          <span className="text-amber-400 font-bold mr-2">macOS:</span>
                          <span className="text-zinc-300">~/Library/Application Support/obs-studio/themes</span>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyPath('~/Library/Application Support/obs-studio/themes')
                          }
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        >
                          {copiedPath === '~/Library/Application Support/obs-studio/themes'
                            ? 'Copiado!'
                            : 'Copiar'}
                        </button>
                      </div>

                      {/* Linux */}
                      <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px]">
                        <div>
                          <span className="text-emerald-400 font-bold mr-2">Linux:</span>
                          <span className="text-zinc-300">~/.config/obs-studio/themes</span>
                        </div>
                        <button
                          onClick={() => handleCopyPath('~/.config/obs-studio/themes')}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        >
                          {copiedPath === '~/.config/obs-studio/themes' ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-500 mt-1 italic">
                      Dica: Se a pasta "themes" não existir ainda no seu OBS, basta criá-la!
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center shrink-0 text-xs border border-zinc-700">
                    3
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-white">Ative no OBS Studio</span>
                    <p className="text-zinc-400 mt-0.5 text-[11px]">
                      Abra o OBS Studio, vá em{' '}
                      <strong className="text-zinc-200">Configurações &gt; Geral &gt; Tema</strong>,
                      selecione <strong>"Lumina {theme.name}"</strong> no menu suspenso e clique em{' '}
                      <strong>Aplicar</strong>!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qss' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Arquivo QSS para Qt6 (OBS Studio)</span>
                <span>CSS válido</span>
              </div>
              <pre className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-96 leading-relaxed">
                {qssCode}
              </pre>
            </div>
          )}

          {activeTab === 'ovt' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Arquivo OVT (OBS Variant Theme Definition)</span>
                <span>JSON</span>
              </div>
              <pre className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-96 leading-relaxed">
                {ovtCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
