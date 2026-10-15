import { ThemeConfig } from '../types/theme';

/**
 * Utilitário para clarear ou escurecer cores hexadecimais com precisão matemática.
 */
export function adjustBrightness(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return hex;

  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }

  const amount = Math.round(2.55 * percent);
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface PaletteScale {
  grey8: string;
  grey7: string;
  grey6: string;
  grey5: string;
  grey4: string;
  grey3: string;
  grey2: string;
  grey1: string;
  bgWindow: string;
  bgBase: string;
  bgPreview: string;
  text: string;
  textMuted: string;
}

function getPaletteScale(theme: ThemeConfig): PaletteScale {
  if (theme.id === 'lumina-oled') {
    return {
      grey8: '#000000',
      grey7: '#050608',
      grey6: '#0A0C10',
      grey5: '#101318',
      grey4: '#181C24',
      grey3: '#222834',
      grey2: '#31394A',
      grey1: '#4F5B75',
      bgWindow: '#050608',
      bgBase: '#0A0C10',
      bgPreview: '#000000',
      text: '#F8FAFC',
      textMuted: '#64748B',
    };
  }

  if (theme.id === 'cyber-amber') {
    return {
      grey8: '#0A0B0E',
      grey7: '#121418',
      grey6: '#181B20',
      grey5: '#21252C',
      grey4: '#2C313B',
      grey3: '#3A414E',
      grey2: '#4E5769',
      grey1: '#6E7A94',
      bgWindow: '#121418',
      bgBase: '#181B20',
      bgPreview: '#000000',
      text: '#FFFBEB',
      textMuted: '#94A3B8',
    };
  }

  if (theme.id === 'midnight-violet') {
    return {
      grey8: '#07050E',
      grey7: '#0D0A18',
      grey6: '#130F22',
      grey5: '#1C1730',
      grey4: '#272044',
      grey3: '#372D5E',
      grey2: '#4D3E82',
      grey1: '#6D5BB6',
      bgWindow: '#0D0A18',
      bgBase: '#130F22',
      bgPreview: '#000000',
      text: '#FAF5FF',
      textMuted: '#A78BFA',
    };
  }

  if (theme.id === 'nordic-light') {
    return {
      grey8: '#FFFFFF',
      grey7: '#F8FAFC',
      grey6: '#F1F5F9',
      grey5: '#E2E8F0',
      grey4: '#CBD5E1',
      grey3: '#94A3B8',
      grey2: '#64748B',
      grey1: '#334155',
      bgWindow: '#F8FAFC',
      bgBase: '#F1F5F9',
      bgPreview: '#000000',
      text: '#0F172A',
      textMuted: '#64748B',
    };
  }

  // Lumina Slate (Recomendado)
  return {
    grey8: '#080A0E',
    grey7: '#0F1217',
    grey6: '#151921',
    grey5: '#1C222D',
    grey4: '#252D3C',
    grey3: '#313C50',
    grey2: '#43516B',
    grey1: '#5D7094',
    bgWindow: '#0F1217',
    bgBase: '#151921',
    bgPreview: '#000000',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
  };
}

export function generateObsQss(theme: ThemeConfig): string {
  const p = getPaletteScale(theme);
  const radiusPx = theme.cornerRadius === 'sharp' ? '0px' : theme.cornerRadius === 'subtle' ? '3px' : '6px';
  const radiusButton = theme.cornerRadius === 'sharp' ? '0px' : theme.cornerRadius === 'subtle' ? '4px' : '8px';
  const accentHover = adjustBrightness(theme.accentColor, 18);
  const accentActive = adjustBrightness(theme.accentColor, -15);

  let nominalColor = '#22C55E';
  let warningColor = '#EAB308';
  let errorColor = '#EF4444';

  if (theme.id === 'cyber-amber') {
    nominalColor = '#10B981';
    warningColor = '#F59E0B';
    errorColor = '#F43F5E';
  } else if (theme.id === 'midnight-violet') {
    nominalColor = '#06B6D4';
    warningColor = '#EC4899';
    errorColor = '#EF4444';
  }

  return `/* ====================================================================
 * LUMINA OBS THEME - ${theme.name.toUpperCase()}
 * Compatibilidade: OBS Studio 28, 29, 30 e 31+ (Qt6)
 * Transformação Completa: Fundo, Docks, Mixer, Menus e Botões
 * ==================================================================== */

* {
    font-family: "Segoe UI", "Plus Jakarta Sans", -apple-system, sans-serif;
    font-size: ${theme.fontSize}pt;
    color: ${p.text};
    outline: none;
}

/* Janela Principal & Fundo de Tela */
QMainWindow, QDialog, QWidget#OBSMainWindow {
    background-color: ${p.bgWindow};
    color: ${p.text};
}

/* Superfícies dos Painéis (Docks) */
QDockWidget {
    background-color: ${p.bgBase};
    color: ${p.text};
    border: 1px solid ${p.grey3};
}

/* Barra de Título dos Docks */
QDockWidget::title {
    background-color: ${p.grey5};
    text-align: left;
    padding: 6px 10px;
    font-weight: 700;
    font-size: ${theme.fontSize}pt;
    border-bottom: 1px solid ${p.grey3};
    color: ${p.textMuted};
    letter-spacing: 0.03em;
}

QDockWidget::title:hover {
    color: #FFFFFF;
}

/* Barra de Menus Superior */
QMenuBar {
    background-color: ${p.bgWindow};
    color: ${p.text};
    border-bottom: 1px solid ${p.grey3};
    padding: 2px 4px;
}

QMenuBar::item {
    background: transparent;
    padding: 4px 10px;
    border-radius: ${radiusPx};
}

QMenuBar::item:selected {
    background-color: ${p.grey4};
    color: ${theme.accentColor};
}

/* Menus Suspensos e Menus de Contexto */
QMenu {
    background-color: ${p.bgBase};
    border: 1px solid ${p.grey3};
    padding: 4px;
    border-radius: ${radiusPx};
}

QMenu::item {
    padding: 6px 20px 6px 12px;
    border-radius: ${radiusPx};
    color: ${p.text};
}

QMenu::item:selected {
    background-color: ${p.grey4};
    color: ${theme.accentColor};
    border-left: 3px solid ${theme.accentColor};
}

QMenu::separator {
    height: 1px;
    background: ${p.grey3};
    margin: 4px 6px;
}

/* Botões Padronizados com Alto Contraste */
QPushButton {
    background-color: ${p.grey4};
    color: ${p.text};
    border: 1px solid ${p.grey3};
    border-radius: ${radiusButton};
    padding: 6px 12px;
    font-weight: 500;
    min-height: 22px;
}

QPushButton:hover {
    background-color: ${p.grey3};
    border-color: ${theme.accentColor};
    color: #FFFFFF;
}

QPushButton:pressed {
    background-color: ${accentActive};
    color: #FFFFFF;
}

QPushButton:checked {
    background-color: ${p.grey4};
    color: ${theme.accentColor};
    font-weight: 700;
    border: 1px solid ${theme.accentColor};
}

QPushButton:disabled {
    background-color: transparent;
    color: ${p.textMuted};
    border-color: transparent;
}

/* Botão de Destaque Primário (Iniciar Transmissão / Gravação) */
QPushButton#streamButton, QPushButton[primary="true"] {
    background-color: ${theme.accentColor};
    color: #FFFFFF;
    border: 1px solid ${theme.accentColor};
    font-weight: 700;
}

QPushButton#streamButton:hover {
    background-color: ${accentHover};
    border-color: ${accentHover};
    color: #FFFFFF;
}

QPushButton#streamButton:pressed {
    background-color: ${accentActive};
    color: #FFFFFF;
}

/* --- Listas de Cenas e Fontes: Calibração de Alto Contraste --- */
QListView, QTreeView, QListWidget, SceneTree {
    background-color: ${p.bgBase};
    border: none;
    padding: 4px;
    color: ${p.text};
}

QListView::item, QTreeView::item, QListWidget::item, SceneTree::item, .list-grid SceneTree::item {
    padding: 6px 10px;
    border-radius: ${radiusPx};
    margin: 1px 0px;
    color: ${p.text};
    border: 1px solid transparent;
}

/* Hover de Item Normal (não selecionado) */
QListView::item:hover:!selected,
QTreeView::item:hover:!selected,
QListWidget::item:hover:!selected,
SceneTree::item:hover:!selected,
.list-grid SceneTree::item:hover:!selected {
    background-color: ${p.grey4};
    color: #FFFFFF;
    border-color: ${p.grey3};
}

/* Item Selecionado: Fundo escuro sutil com borda lateral na cor do acento */
QListView::item:selected,
QTreeView::item:selected,
QListWidget::item:selected,
SceneTree::item:selected,
.list-grid SceneTree::item:selected,
.list-grid SceneTree::item:checked {
    background-color: ${p.grey4};
    border-left: 4px solid ${theme.accentColor};
    border-color: ${theme.accentColor};
    color: #FFFFFF;
    font-weight: 700;
}

/* Hover de Item Selecionado */
QListView::item:selected:hover,
QTreeView::item:selected:hover,
QListWidget::item:selected:hover,
SceneTree::item:selected:hover,
.list-grid SceneTree::item:selected:hover {
    background-color: ${p.grey3};
    border-left: 4px solid ${theme.accentColor};
    color: #FFFFFF;
    font-weight: 700;
}

/* --- Mixer de Áudio: Removendo o Azul e Integrando à Skin --- */
#stackedMixerArea, #vMixerScrollArea, #hMixerScrollArea, VolumeControl {
    background-color: ${p.bgBase};
}

VolumeControl .mixer-category,
VolumeControl.volume-pinned .mixer-category {
    background: ${p.grey5};
    color: ${theme.accentColor};
    border-bottom: 2px solid ${theme.accentColor};
    font-weight: 700;
    font-size: 9pt;
    padding: 3px 6px;
    border-radius: 3px;
}

VolumeControl .mixer-name {
    color: ${p.text};
    font-weight: 600;
}

/* Abas (QTabWidget & QTabBar) */
QTabWidget::pane {
    border: 1px solid ${p.grey3};
    background-color: ${p.bgBase};
    border-radius: ${radiusPx};
}

QTabBar::tab {
    background-color: ${p.grey5};
    color: ${p.textMuted};
    border: 1px solid ${p.grey3};
    padding: 6px 14px;
    margin-right: 2px;
    border-top-left-radius: ${radiusPx};
    border-top-right-radius: ${radiusPx};
}

QTabBar::tab:hover {
    background-color: ${p.grey4};
    color: #FFFFFF;
}

QTabBar::tab:selected {
    background-color: ${p.bgBase};
    color: ${theme.accentColor};
    border-bottom: 2px solid ${theme.accentColor};
    font-weight: 700;
}

/* Sliders de Fader de Volume do Mixer */
QSlider::groove:horizontal {
    height: 4px;
    background: ${p.grey3};
    border-radius: 2px;
}

QSlider::sub-page:horizontal {
    background: ${theme.accentColor};
    border-radius: 2px;
}

QSlider::handle:horizontal {
    background: #FFFFFF;
    border: 2px solid ${theme.accentColor};
    width: 14px;
    height: 14px;
    margin: -5px 0;
    border-radius: 7px;
}

QSlider::handle:horizontal:hover {
    background: ${theme.accentColor};
    border: 2px solid #FFFFFF;
}

/* VU Meter de Áudio Oficial do OBS Studio (VolumeMeter) */
VolumeMeter {
    qproperty-backgroundNominalColor: ${p.bgWindow};
    qproperty-backgroundWarningColor: ${p.bgWindow};
    qproperty-backgroundErrorColor: ${p.bgWindow};
    qproperty-foregroundNominalColor: ${nominalColor};
    qproperty-foregroundWarningColor: ${warningColor};
    qproperty-foregroundErrorColor: ${errorColor};
    qproperty-magnitudeColor: ${p.grey3};
    qproperty-majorTickColor: ${p.textMuted};
    qproperty-minorTickColor: ${p.grey3};
    qproperty-peakColor: #FFFFFF;
    min-height: 14px;
    border-radius: ${radiusPx};
}

/* Barra de Status Inferior */
QStatusBar {
    background-color: ${p.grey5};
    border-top: 1px solid ${p.grey3};
    color: ${p.textMuted};
    padding: 4px 8px;
    font-family: "JetBrains Mono", "Consolas", monospace;
    font-size: 9.5pt;
}

QStatusBar QLabel {
    padding: 0px 8px;
    border-right: 1px solid ${p.grey3};
}

/* Barras de Rolagem Ultrafinas e Elegantes */
QScrollBar:vertical {
    background: transparent;
    width: 6px;
    margin: 0;
}

QScrollBar::handle:vertical {
    background: ${p.grey3};
    min-height: 24px;
    border-radius: 3px;
}

QScrollBar::handle:vertical:hover {
    background: ${theme.accentColor};
}

QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical,
QScrollBar::add-page:vertical, QScrollBar::sub-page:vertical {
    background: none;
    border: none;
}

/* Divisores de Janela (Splitters) */
QSplitter::handle {
    background: ${p.grey3};
}

QSplitter::handle:horizontal {
    width: 1px;
}

QSplitter::handle:vertical {
    height: 1px;
}

/* Caixas de Texto & Seleção */
QLineEdit, QComboBox, QSpinBox, QDoubleSpinBox {
    background-color: ${p.grey4};
    border: 1px solid ${p.grey3};
    border-radius: ${radiusPx};
    padding: 5px 8px;
    color: ${p.text};
    min-height: 20px;
}

QLineEdit:focus, QComboBox:focus, QSpinBox:focus {
    border-color: ${theme.accentColor};
}

QComboBox QAbstractItemView {
    background-color: ${p.bgBase};
    color: ${p.text};
    border: 1px solid ${p.grey3};
    selection-background-color: ${p.grey4};
    selection-color: #FFFFFF;
}

/* Preview do OBS */
OBSBasicPreview {
    background-color: #000000;
    border: 1px solid ${p.grey3};
}
`;
}

/**
 * Gera o arquivo oficial OBS Variant Theme (.ovt) compatível com OBS Studio 28, 29, 30 e 31+ (Qt6)
 * Redefine toda a escala de cinzas e fundos para uma transformação visual total e imersiva.
 */
export function generateObsOvt(theme: ThemeConfig): string {
  const isDark = !theme.id.includes('light');
  const safeId = theme.id.replace(/[^a-zA-Z0-9]/g, '');
  const p = getPaletteScale(theme);
  const accentLight = adjustBrightness(theme.accentColor, 18);
  const accentDark = adjustBrightness(theme.accentColor, -25);

  return `@OBSThemeMeta {
    name: '${theme.name}';
    id: 'com.lumina.${safeId}';
    extends: 'com.obsproject.Yami';
    author: 'Lumina Studio Design Team';
    dark: '${isDark ? 'true' : 'false'}';
}

@OBSThemeVars {
    /* --- Redefinição Completa da Escala de Cores do Motor Yami --- */
    --grey8: ${p.grey8};
    --grey7: ${p.grey7};
    --grey6: ${p.grey6};
    --grey5: ${p.grey5};
    --grey4: ${p.grey4};
    --grey3: ${p.grey3};
    --grey2: ${p.grey2};
    --grey1: ${p.grey1};

    --bg_window: ${p.bgWindow};
    --bg_base: ${p.bgBase};
    --bg_preview: ${p.bgPreview};

    --primary: ${p.grey4};
    --primary_light: ${p.grey3};
    --primary_dark: ${p.bgWindow};

    --border_color: ${p.grey3};

    --input_bg: ${p.grey4};
    --input_bg_hover: ${p.grey5};
    --input_bg_focus: ${p.grey5};

    --list_item_bg_selected: ${p.grey4};
    --list_item_bg_hover: ${p.grey4};

    --button_bg: ${p.grey4};
    --button_bg_hover: ${p.grey3};
    --button_bg_down: ${p.grey5};

    --scrollbar_handle: ${p.grey3};
    --scrollbar_hover: ${theme.accentColor};
    --scrollbar_down: ${theme.accentColor};
    --scrollbar_border: ${p.grey3};

    --blue5: ${p.grey5};
    --blue6: ${p.grey6};
}

/* --- Transformação Completa de Docks, Janela e Superfícies --- */
QMainWindow, QDialog, QWidget#OBSMainWindow {
    background-color: ${p.bgWindow} !important;
    color: ${p.text} !important;
}

QDockWidget {
    background-color: ${p.bgBase} !important;
    border: 1px solid ${p.grey3} !important;
}

QDockWidget::title {
    background-color: ${p.grey5} !important;
    color: ${p.textMuted} !important;
    padding: 6px 10px !important;
    font-weight: 700 !important;
    border-bottom: 1px solid ${p.grey3} !important;
    letter-spacing: 0.03em;
}

QDockWidget::title:hover {
    color: #FFFFFF !important;
}

/* Barra de Menus Superior */
QMenuBar {
    background-color: ${p.bgWindow} !important;
    border-bottom: 1px solid ${p.grey3} !important;
}

QMenuBar::item:selected {
    background-color: ${p.grey4} !important;
    color: ${theme.accentColor} !important;
}

/* Barra de Status Inferior */
QStatusBar {
    background-color: ${p.grey5} !important;
    border-top: 1px solid ${p.grey3} !important;
    color: ${p.textMuted} !important;
}

/* --- Mixer de Áudio: Removendo o Azul Padrão e Integrando ao Tema --- */
#stackedMixerArea, #vMixerScrollArea, #hMixerScrollArea, VolumeControl {
    background-color: ${p.bgBase} !important;
}

VolumeControl .mixer-category,
VolumeControl.volume-pinned .mixer-category {
    background: ${p.grey5} !important;
    color: ${theme.accentColor} !important;
    border-bottom: 2px solid ${theme.accentColor} !important;
    font-weight: 700 !important;
    font-size: 9pt !important;
    padding: 3px 6px !important;
    border-radius: 3px !important;
}

VolumeControl .mixer-name {
    color: ${p.text} !important;
    font-weight: 600 !important;
}

/* --- Listas de Cenas e Fontes com Legibilidade e Alto Contraste --- */
QListView, QListWidget, QTreeView, SceneTree {
    background-color: ${p.bgBase} !important;
    color: ${p.text} !important;
}

QListView::item,
QListWidget::item,
SceneTree::item,
.list-grid SceneTree::item {
    padding: 6px 10px !important;
    color: ${p.text} !important;
    border: 1px solid transparent !important;
}

/* Hover de Item Normal (não selecionado) */
QListView::item:hover:!selected,
QListWidget::item:hover:!selected,
SceneTree::item:hover:!selected,
.list-grid SceneTree::item:hover:!selected {
    background-color: ${p.grey4} !important;
    color: #FFFFFF !important;
    border-color: ${p.grey3} !important;
}

/* Item Selecionado (Cena/Fonte Ativa) - Fundo escuro sutil + traço neon lateral + texto branco nítido */
QListView::item:selected,
QListWidget::item:selected,
SceneTree::item:selected,
.list-grid SceneTree::item:selected,
.list-grid SceneTree::item:checked {
    background-color: ${p.grey4} !important;
    border-left: 4px solid ${theme.accentColor} !important;
    border-color: ${theme.accentColor} !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

/* Hover no Item Selecionado */
QListView::item:selected:hover,
QListWidget::item:selected:hover,
SceneTree::item:selected:hover,
.list-grid SceneTree::item:selected:hover {
    background-color: ${p.grey3} !important;
    border-left: 4px solid ${theme.accentColor} !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

/* Botões do Painel de Controles */
#controlsDock QPushButton,
QPushButton {
    background-color: ${p.grey4} !important;
    color: ${p.text} !important;
    border: 1px solid ${p.grey3} !important;
    border-radius: 5px !important;
    padding: 6px 12px !important;
    font-weight: 500 !important;
    min-height: 22px !important;
}

QPushButton:hover {
    background-color: ${p.grey3} !important;
    border-color: ${theme.accentColor} !important;
    color: #FFFFFF !important;
}

QPushButton#streamButton, QPushButton[primary="true"] {
    background-color: ${theme.accentColor} !important;
    color: #FFFFFF !important;
    border: 1px solid ${theme.accentColor} !important;
    font-weight: 700 !important;
}

QPushButton#streamButton:hover {
    background-color: ${accentLight} !important;
    border-color: ${accentLight} !important;
    color: #FFFFFF !important;
}

/* Menus Suspensos */
QMenu {
    background-color: ${p.bgBase} !important;
    border: 1px solid ${p.grey3} !important;
    color: ${p.text} !important;
}

QMenu::item:selected {
    background-color: ${p.grey4} !important;
    color: ${theme.accentColor} !important;
    border-left: 3px solid ${theme.accentColor} !important;
}

/* Medidor de Áudio */
VolumeMeter {
    qproperty-backgroundNominalColor: ${p.bgWindow};
    qproperty-backgroundWarningColor: ${p.bgWindow};
    qproperty-backgroundErrorColor: ${p.bgWindow};
    qproperty-foregroundNominalColor: #22C55E;
    qproperty-foregroundWarningColor: #EAB308;
    qproperty-foregroundErrorColor: #EF4444;
}
`;
}

export function downloadThemeZip(theme: ThemeConfig) {
  const qssContent = generateObsQss(theme);
  const blob = new Blob([qssContent], { type: 'text/css;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Lumina-${theme.id}.qss`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadThemeOvt(theme: ThemeConfig) {
  const ovtContent = generateObsOvt(theme);
  const blob = new Blob([ovtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Lumina-${theme.id}.ovt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadInstallerScript(theme: ThemeConfig) {
  const qssContent = generateObsQss(theme);
  const ovtContent = generateObsOvt(theme);

  const b64Qss = btoa(unescape(encodeURIComponent(qssContent)));
  const b64Ovt = btoa(unescape(encodeURIComponent(ovtContent)));

  const batContent = `@echo off
chcp 65001 >nul
title Instalador Lumina OBS - ${theme.name}
color 0B

echo ====================================================================
echo      INSTALADOR AUTOMATICO: LUMINA OBS - ${theme.name.toUpperCase()}
echo ====================================================================
echo.
echo [1/3] Verificando pasta de temas do OBS Studio...

set "THEMES_DIR=%APPDATA%\\obs-studio\\themes"
if not exist "%THEMES_DIR%" (
    mkdir "%THEMES_DIR%"
    echo   Pasta de temas criada com sucesso!
)

echo [2/3] Instalando arquivos de tema (.qss e .ovt)...
powershell -NoProfile -Command "$dir = [System.IO.Path]::Combine($env:APPDATA, 'obs-studio', 'themes'); [System.IO.File]::WriteAllText((Join-Path $dir 'Lumina-${theme.id}.qss'), [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64Qss}')), [System.Text.Encoding]::UTF8); [System.IO.File]::WriteAllText((Join-Path $dir 'Lumina-${theme.id}.ovt'), [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64Ovt}')), [System.Text.Encoding]::UTF8);"

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao gravar os arquivos de tema.
    pause
    exit /b
)

echo [3/3] Sucesso! Tema instalado em:
echo       %THEMES_DIR%\\Lumina-${theme.id}.qss
echo       %THEMES_DIR%\\Lumina-${theme.id}.ovt
echo.
echo ====================================================================
echo  COMO ATIVAR NO OBS 30/31+:
echo  1. Abra o OBS Studio
echo  2. Clique em: Configuracoes -> Aparencia
echo  3. Deixe Tema em 'Yami' e em 'Estilo' selecione 'Lumina ${theme.name}'
echo  4. Clique em Aplicar!
echo ====================================================================
echo.
pause
`;

  const blob = new Blob([batContent], { type: 'application/x-bat;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Instalar-Lumina-${theme.id}.bat`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
