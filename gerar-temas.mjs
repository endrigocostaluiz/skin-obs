// Gera os temas Lumina para o OBS Studio 28+ (formato .obt) e os Ã­cones SVG de cada tema.
// Uso:  node gerar-temas.mjs
// SaÃ­da: instalador-lumina-obs/temas/<id>.obt  +  instalador-lumina-obs/temas/Lumina-<id>/*.svg
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(raiz, 'instalador-lumina-obs', 'temas');
const lucideDir = path.join(raiz, 'obs-modern-skin', 'node_modules', 'lucide-react', 'dist', 'esm', 'icons');

// ---------- utilitÃ¡rios de cor ----------
const hex2rgb = (h) => {
  const c = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(c.substring(i, i + 2), 16));
};
const rgb2hex = (r) => '#' + r.map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => {
  const A = hex2rgb(a), B = hex2rgb(b);
  return rgb2hex(A.map((v, i) => v + (B[i] - v) * t));
};
const lum = (h) => {
  const [r, g, b] = hex2rgb(h).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const lighten = (h, t) => mix(h, '#FFFFFF', t);
const darken = (h, t) => mix(h, '#000000', t);

// ---------- paletas (mesmas do preview: obs-modern-skin/src/utils) ----------
const TEMAS = [
  {
    id: 'lumina-slate', nome: 'Lumina Slate', obsId: 'com.lumina.luminaslate', dark: true,
    accent: '#3B82F6', raio: 6,
    g: ['#080A0E', '#0F1217', '#151921', '#1C222D', '#252D3C', '#313C50', '#43516B', '#5D7094'], // grey8..grey1
    text: '#F1F5F9', muted: '#94A3B8', medidor: ['#22C55E', '#EAB308', '#EF4444'],
  },
  {
    id: 'lumina-oled', nome: 'Lumina OLED Obsidian', obsId: 'com.lumina.luminaoled', dark: true,
    accent: '#10B981', raio: 4,
    g: ['#000000', '#050608', '#0A0C10', '#101318', '#181C24', '#222834', '#31394A', '#4F5B75'],
    text: '#F8FAFC', muted: '#64748B', medidor: ['#22C55E', '#EAB308', '#EF4444'],
  },
  {
    id: 'cyber-amber', nome: 'Cyber Amber Broadcast', obsId: 'com.lumina.cyberamber', dark: true,
    accent: '#F59E0B', raio: 2,
    g: ['#0A0B0E', '#121418', '#181B20', '#21252C', '#2C313B', '#3A414E', '#4E5769', '#6E7A94'],
    text: '#FFFBEB', muted: '#94A3B8', medidor: ['#10B981', '#F59E0B', '#F43F5E'],
  },
  {
    id: 'midnight-violet', nome: 'Midnight Creator', obsId: 'com.lumina.midnightviolet', dark: true,
    accent: '#8B5CF6', raio: 6,
    g: ['#07050E', '#0D0A18', '#130F22', '#1C1730', '#272044', '#372D5E', '#4D3E82', '#6D5BB6'],
    text: '#FAF5FF', muted: '#A78BFA', medidor: ['#06B6D4', '#EC4899', '#EF4444'],
  },
  {
    id: 'nordic-light', nome: 'Nordic Clean Studio', obsId: 'com.lumina.nordiclight', dark: false,
    accent: '#2563EB', raio: 6,
    g: ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#334155'],
    text: '#0F172A', muted: '#64748B', medidor: ['#22C55E', '#EAB308', '#EF4444'],
  },
];

// ---------- Ã­cones (Lucide, o mesmo conjunto do preview) ----------
const ICONES = {
  'sources/camera': 'camera',
  'sources/gamepad': 'gamepad-2',
  'sources/globe': 'globe',
  'sources/window': 'app-window',
  'sources/windowaudio': 'volume-2',
  'sources/microphone': 'mic',
  'sources/audio': 'volume-2',
  'sources/video': 'monitor',
  'sources/image': 'image',
  'sources/brush': 'brush',
  'sources/slideshow': 'images',
  'sources/text': 'type',
  'sources/media': 'circle-play',
  'sources/group': 'folder',
  'sources/scene': 'clapperboard',
  'sources/default': 'box',
  visible: 'eye',
  invisible: 'eye-off',
  locked: 'lock',
  unlocked: 'lock-open',
  expand: 'chevron-down',
  collapse: 'chevron-right',
  'btn/stream': 'radio',
  'btn/record': 'disc',
  'btn/virtualcam': 'video',
  'btn/studio': 'layout-panel-left',
  'btn/settings': 'settings',
  'btn/exit': 'power',
};
// cor de cada Ã­cone: fontes em destaque; olho/cadeado discretos; botÃµes herdam o texto
const COR_ICONE = (t, nome) => {
  if (nome.startsWith('sources/')) return t.accent;
  if (nome.startsWith('btn/')) return t.text;
  if (nome === 'locked') return '#F59E0B'; // igual ao cadeado Ã¢mbar do preview
  return t.muted;
};

async function carregarNos(arquivo) {
  const mod = await import(pathToFileURL(path.join(lucideDir, `${arquivo}.js`)).href);
  return mod.__iconNode;
}

function svg(nos, cor) {
  const corpo = nos
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${corpo}</svg>\n`;
}

const baseClaro = fs.readFileSync(path.join(raiz, 'base-light.qss'), 'utf-8');

// ---------- tema .obt ----------
function gerarObt(t) {
  const [g8, g7, g6, g5, g4, g3, g2, g1] = t.g;
  const A = t.accent;
  const aLight = lighten(A, 0.18), aLighter = lighten(A, 0.35), aDark = darken(A, 0.15), aDarker = darken(A, 0.3);
  const sel = mix(g6, A, t.dark ? 0.16 : 0.12); // fundo do item selecionado
  const selHover = mix(g6, A, t.dark ? 0.24 : 0.2);
  const onAccent = lum(A) > 0.45 ? '#04110C' : '#FFFFFF';
  const borda = t.dark ? g4 : g4;
  const r = t.raio, rb = r + 2;
  const knobRing = t.dark ? '#FFFFFF' : '#FFFFFF';
  const pasta = `Lumina-${t.id}`;
  const ic = (n) => `url(theme:${pasta}/${n}.svg)`;
  const extende = 'com.obsproject.Yami';
  const medidorFundo = t.dark ? g8 : g4;

  return `@OBSThemeMeta {
    name: '${t.nome}';
    id: '${t.obsId}';
    extends: '${extende}';
    author: 'Lumina Studio Design Team';
    dark: '${t.dark}';
}

@OBSThemeVars {
    /* Escala neutra (superfÃ­cies, bordas, botÃµes) */
    --grey8: ${g8};
    --grey7: ${g7};
    --grey6: ${g6};
    --grey5: ${g5};
    --grey4: ${g4};
    --grey3: ${g3};
    --grey2: ${g2};
    --grey1: ${g1};

    /* Cor de destaque */
    --blue1: ${aLighter};
    --blue2: ${aLight};
    --blue3: ${A};
    --blue4: ${aDark};
    --blue5: ${aDarker};
    --blue6: ${darken(A, 0.45)};
    --primary: ${A};
    --primary_light: ${aLight};
    --primary_lighter: ${aLighter};
    --primary_dark: ${aDark};
    --primary_darker: ${aDarker};

    --bg_window: ${g7};
    --bg_base: ${g6};
    --bg_preview: ${g8};

    --text: ${t.text};
    --text_light: ${t.text};
    --text_muted: ${t.muted};
    --text_disabled: ${t.muted};
    --text_inactive: ${t.muted};

    --border_color: ${borda};
    --border_radius: ${r}px;
    --border_radius_small: ${Math.max(0, r - 2)}px;
    --border_radius_large: ${rb}px;

    --input_bg: ${g5};
    --input_bg_hover: ${g4};
    --input_bg_focus: ${g6};
    --input_border: ${g4};
    --input_border_hover: ${g2};
    --input_border_focus: ${A};

    --button_bg: ${g5};
    --button_bg_hover: ${g4};
    --button_bg_down: ${g7};
    --button_bg_disabled: ${g6};
    --button_border: ${g4};
    --button_border_hover: ${A};
    --button_border_focus: ${A};

    --list_item_bg_selected: ${sel};
    --list_item_bg_hover: ${g5};

    --tab_bg: ${g6};
    --tab_bg_hover: ${g5};
    --tab_bg_down: ${A};
    --tab_border: ${borda};
    --tab_border_selected: ${A};
    --tab_border_focus: ${aLighter};

    --scrollbar_bg: ${g7};
    --scrollbar_handle: ${g4};
    --scrollbar_hover: ${g3};
    --scrollbar_down: ${A};

    --highlight_color: ${A};

    --palette_window: ${g7};
    --palette_base: ${g6};
    --palette_highlight: ${A};
    --palette_highlightedText: ${onAccent};
}

${t.dark ? '' : baseClaro}
/* ====================================================================
   ${t.nome.toUpperCase()} - PadrÃ£o visual idÃªntico ao preview da galeria
   Fonte: Plus Jakarta Sans (fallback Segoe UI) | Ãcones: Lucide
   ==================================================================== */

QWidget {
    font-family: "Plus Jakarta Sans", "Segoe UI", "Inter", sans-serif;
}

/* ---------- Docks ---------- */
QDockWidget::title {
    background-color: ${g5};
    color: ${t.text};
    padding: 7px 10px;
    font-weight: 700;
    border-bottom: 1px solid ${borda};
    border-top-left-radius: ${r}px;
    border-top-right-radius: ${r}px;
}

OBSDock > QWidget, OBSDock QAbstractScrollArea {
    background-color: ${g6};
}

/* ---------- Listas: Cenas e Fontes ---------- */
QListView, QListWidget, SceneTree, SourceTree {
    background-color: ${g7};
    border: 1px solid ${borda};
    border-radius: ${r}px;
    padding: 3px;
}

QListView::item, QListWidget::item, SceneTree::item {
    padding: 7px 9px;
    margin: 0px;
    border-radius: ${r}px;
    border: 1.5px solid transparent;
    color: ${t.text};
    font-weight: 600;
    font-size: var(--font_large);
}

QListView::item:hover:!selected, QListWidget::item:hover:!selected, SceneTree::item:hover:!selected {
    background-color: ${g5};
    border: 1.5px solid ${g4};
}

QListView::item:selected, QListWidget::item:selected, SceneTree::item:selected,
.list-grid SceneTree::item:selected, .list-grid SceneTree::item:checked {
    background-color: ${sel};
    border: 1.5px solid ${A};
    color: ${t.dark ? '#FFFFFF' : t.text};
    font-weight: 700;
}

QListView::item:selected:hover, QListWidget::item:selected:hover, SceneTree::item:selected:hover {
    background-color: ${selHover};
    border: 1.5px solid ${aLight};
}

.list-grid SceneTree::item {
    background-color: ${g5};
    border: 1.5px solid ${g4};
    border-radius: ${r}px;
}

/* O item de Fontes é um widget (SourceTreeItem) desenhado sobre a linha: a linha não pode ter
   padding/margem, senão o hover/seleção fica deslocado ou pela metade */
SourceTree::item, SourceTree::item:hover, SourceTree::item:selected, SourceTree::item:selected:hover {
    padding: 0px;
    margin: 0px;
    min-height: 32px;
}
SourceTreeItem {
    padding: 5px 6px;
    margin: 0px;
    border-radius: ${r}px;
    border: 0px solid transparent;
    font-size: var(--font_large);
    min-height: 0px; /* o widget se ajusta à linha (32px); nada pode ser mais alto que ela, senão o conteúdo escorrega */
    font-weight: 600;
}
SourceTreeItem QLabel { font-size: var(--font_large); font-weight: 600; }
.checkbox-icon { padding: 2px; margin-top: 0px; margin-bottom: 0px; }

/* Foco (clique/teclado): o OBS usa borda BRANCA aqui; troca pela cor do tema (ex.: menu Configurações) */
QListView::item:focus:!selected, QListWidget::item:focus:!selected, SceneTree::item:focus:!selected { border: 1.5px solid transparent; }
QListView::item:selected:focus, QListWidget::item:selected:focus, SceneTree::item:selected:focus { border: 1.5px solid ${A}; }

/* Fonte selecionada: mesma borda/tint do tema, com ou sem foco (sem isso o OBS deixa branca ao perder o foco) */
SourceTree::item:selected, SourceTree::item:selected:!focus, SourceTree::item:selected:!active, SourceTree::item:selected:focus {
    background-color: ${sel};
    border: 1.5px solid ${A};
}
SourceTree::item:selected:hover { background-color: ${selHover}; border: 1.5px solid ${aLight}; }
QListView::item:selected:!focus, QListWidget::item:selected:!focus, SceneTree::item:selected:!focus,
QListView::item:selected:!active, QListWidget::item:selected:!active, SceneTree::item:selected:!active {
    background-color: ${sel};
    border: 1.5px solid ${A};
}


/* Olho, cadeado e seta de grupo (Ã­cones prÃ³prios do tema) */
.checkbox-icon:hover, .checkbox-icon:focus {
    border-color: ${g3};
    background: ${g5};
}
.indicator-visibility::indicator:checked, .indicator-visibility::indicator:checked:hover { image: ${ic('visible')}; }
.indicator-visibility::indicator:unchecked, .indicator-visibility::indicator:unchecked:hover { image: ${ic('invisible')}; }
.indicator-lock::indicator:checked, .indicator-lock::indicator:checked:hover { image: ${ic('locked')}; }
.indicator-lock::indicator:unchecked, .indicator-lock::indicator:unchecked:hover { image: ${ic('unlocked')}; }
.indicator-expand::indicator:checked, .indicator-expand::indicator:checked:hover { image: ${ic('expand')}; }
.indicator-expand::indicator:unchecked, .indicator-expand::indicator:unchecked:hover { image: ${ic('collapse')}; }

/* Ãcones por tipo de fonte (lidos pelo OBS a partir do tema) */
OBSBasic {
    qproperty-imageIcon: ${ic('sources/image')};
    qproperty-colorIcon: ${ic('sources/brush')};
    qproperty-slideshowIcon: ${ic('sources/slideshow')};
    qproperty-audioInputIcon: ${ic('sources/microphone')};
    qproperty-audioOutputIcon: ${ic('sources/audio')};
    qproperty-desktopCapIcon: ${ic('sources/video')};
    qproperty-windowCapIcon: ${ic('sources/window')};
    qproperty-gameCapIcon: ${ic('sources/gamepad')};
    qproperty-cameraIcon: ${ic('sources/camera')};
    qproperty-textIcon: ${ic('sources/text')};
    qproperty-mediaIcon: ${ic('sources/media')};
    qproperty-browserIcon: ${ic('sources/globe')};
    qproperty-groupIcon: ${ic('sources/group')};
    qproperty-sceneIcon: ${ic('sources/scene')};
    qproperty-defaultIcon: ${ic('sources/default')};
    qproperty-audioProcessOutputIcon: ${ic('sources/windowaudio')};
}

/* ---------- Mixer de Ã¡udio ---------- */
#stackedMixerArea, #vMixerScrollArea, #hMixerScrollArea {
    background-color: ${g7};
}

VolumeControl {
    background-color: ${g6};
    border: 1px solid ${borda};
    border-radius: ${rb}px;
    margin: 3px 4px;
    padding: 4px 6px;
}

VolumeControl .mixer-category,
VolumeControl.volume-pinned .mixer-category {
    background: ${g5};
    color: ${A};
    border-bottom: 2px solid ${A};
    font-weight: 700;
    border-radius: 3px;
}

VolumeControl .mixer-name, VolumeName QLabel {
    color: ${t.text};
    font-weight: 700;
}

/* Valor em dB como "pÃ­lula" */
VolumeControl #volLabel {
    background: ${g5};
    border: 1px solid ${g4};
    border-radius: ${r}px;
    color: ${t.text};
    font-family: "JetBrains Mono", "Consolas", monospace;
    font-weight: 700;
    padding: 2px 6px;
}

/* Medidor VU: verde -> amarelo -> vermelho sobre fundo escuro */
VolumeMeter {
    background: ${g6};
    qproperty-backgroundNominalColor: ${medidorFundo};
    qproperty-backgroundWarningColor: ${medidorFundo};
    qproperty-backgroundErrorColor: ${medidorFundo};
    qproperty-foregroundNominalColor: ${t.medidor[0]};
    qproperty-foregroundWarningColor: ${t.medidor[1]};
    qproperty-foregroundErrorColor: ${t.medidor[2]};
    qproperty-magnitudeColor: ${t.text};
    qproperty-majorTickColor: ${t.muted};
    qproperty-minorTickColor: ${g3};
}

/* ---------- Sliders (fader do mixer, duraÃ§Ã£o, etc.) ---------- */
QSlider::groove:horizontal { background: ${g4}; height: 4px; border-radius: 2px; border: none; }
QSlider::groove:vertical   { background: ${g4}; width: 4px;  border-radius: 2px; border: none; }
QSlider::sub-page:horizontal { background: ${A}; border-radius: 2px; }
QSlider::add-page:vertical   { background: ${A}; border-radius: 2px; }
QSlider::handle:horizontal {
    background: ${A};
    border: 2px solid ${aLighter};
    width: 12px; height: 12px;
    margin: -6px 0;
    border-radius: 8px;
}
QSlider::handle:vertical {
    background: ${A};
    border: 2px solid ${aLighter};
    width: 12px; height: 12px;
    margin: 0 -6px;
    border-radius: 8px;
}
QSlider::handle:hover   { background: ${aLight}; }
QSlider::handle:pressed { background: ${aDark}; }

/* ---------- BotÃµes ---------- */
QPushButton {
    background-color: ${g5};
    border: 1px solid ${g4};
    border-radius: ${r}px;
    color: ${t.text};
    font-weight: 600;
}
QPushButton:hover { background-color: ${g4}; border-color: ${A}; color: ${t.dark ? aLighter : A}; }
QPushButton:pressed { background-color: ${g7}; border-color: ${aDark}; }
QPushButton:checked { background-color: ${sel}; border: 1.5px solid ${A}; color: ${t.dark ? '#FFFFFF' : t.text}; font-weight: 700; }
QPushButton:disabled { background-color: ${g6}; border-color: ${g5}; color: ${t.muted}; }

/* BotÃ£o principal "Executar" / transiÃ§Ã£o */
#transitionButton, QPushButton[class~="btn-primary"], .button-primary {
    background-color: ${A};
    color: ${onAccent};
    border: none;
    font-weight: 800;
}
#transitionButton:hover, .button-primary:hover { background-color: ${aLight}; color: ${onAccent}; }

/* ---------- Controles (Ã­cone + texto, como no preview) ---------- */
#controlsFrame QPushButton {
    text-align: left;
    padding: 7px 12px;
    icon-size: 16px;
}
#streamButton      { qproperty-icon: ${ic('btn/stream')}; }
#recordButton      { qproperty-icon: ${ic('btn/record')}; }
#virtualCamButton  { qproperty-icon: ${ic('btn/virtualcam')}; }
#modeSwitch        { qproperty-icon: ${ic('btn/studio')}; }
#settingsButton    { qproperty-icon: ${ic('btn/settings')}; }
#exitButton        { qproperty-icon: ${ic('btn/exit')}; }

#streamButton:!hover:!pressed.state-active,
#recordButton:!hover:!pressed.state-active,
#virtualCamButton:!hover:!pressed.state-active,
#modeSwitch:!hover:!pressed.state-active {
    background-color: ${A};
    border-color: ${A};
    color: ${onAccent};
}

/* ---------- Campos, combos e caixas ---------- */
QLineEdit, QComboBox, QSpinBox, QDoubleSpinBox, QTextEdit, QPlainTextEdit {
    background-color: ${g5};
    border: 1px solid ${g4};
    border-radius: ${r}px;
    color: ${t.text};
    selection-background-color: ${A};
    selection-color: ${onAccent};
}
QLineEdit:focus, QComboBox:focus, QSpinBox:focus, QDoubleSpinBox:focus { border-color: ${A}; }
QComboBox QAbstractItemView {
    background-color: ${g6};
    border: 1px solid ${g4};
    selection-background-color: ${sel};
    selection-color: ${t.text};
}

/* ---------- Menus, abas, barra de status ---------- */
QMenuBar::item:selected { background-color: ${g5}; color: ${t.dark ? aLighter : A}; border-radius: ${r}px; }
QMenu { background-color: ${g6}; border: 1px solid ${g4}; border-radius: ${r}px; }
/* Largura da borda IGUAL em todos os estados: se mudar no hover, o texto 'pula' */
QMenu::item, QMenu > QWidget { border: 1px solid transparent; border-left: 3px solid transparent; }
QMenu::item:hover, QMenu::item:selected, QMenu::item:selected:hover, QMenu::item:focus, QMenu::item:selected:focus,
QMenu > QWidget:selected {
    background-color: ${sel};
    color: ${t.text};
    border: 1px solid transparent;
    border-left: 3px solid ${A};
}

QTabBar::tab:selected { color: ${A}; border-bottom: 2px solid ${A}; font-weight: 700; }

OBSBasicStatusBar { background: ${g7}; border-top: 1px solid ${borda}; }
QStatusBar QLabel, StatusBarWidget QLabel {
    font-family: "JetBrains Mono", "Consolas", monospace;
    color: ${t.muted};
}

/* ---------- Barras de rolagem finas ---------- */
QScrollBar::handle { border-radius: 3px; }
QScrollBar::handle:hover { background: ${A}; }
`;
}

// ---------- execuÃ§Ã£o ----------
fs.mkdirSync(saida, { recursive: true });

// remove restos do formato antigo (.qss/.ovt que o OBS 30+ nÃ£o carregava direito)
for (const f of fs.readdirSync(saida)) {
  if (/\.(qss|ovt)$/i.test(f)) fs.rmSync(path.join(saida, f));
}

const nosCache = {};
for (const t of TEMAS) {
  fs.writeFileSync(path.join(saida, `${t.id}.obt`), gerarObt(t), 'utf-8');
  const pasta = path.join(saida, `Lumina-${t.id}`);
  for (const [nome, lucide] of Object.entries(ICONES)) {
    nosCache[lucide] ??= await carregarNos(lucide);
    const arq = path.join(pasta, `${nome}.svg`);
    fs.mkdirSync(path.dirname(arq), { recursive: true });
    fs.writeFileSync(arq, svg(nosCache[lucide], COR_ICONE(t, nome)), 'utf-8');
  }
  console.log(`OK  ${t.id}.obt + ${Object.keys(ICONES).length} Ã­cones`);
}










