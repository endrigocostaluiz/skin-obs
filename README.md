# Lumina OBS — skins para OBS Studio

Cinco temas (`.obt`) para o OBS Studio 30+, com ícones próprios, mixer, listas e botões redesenhados.

**Site:** https://endrigocostaluiz.github.io/skin-obs/

| Tema | Destaque |
|---|---|
| Lumina Slate | azul safira |
| Lumina OLED Obsidian | verde esmeralda, preto puro |
| Cyber Amber Broadcast | âmbar |
| Midnight Creator | violeta |
| Nordic Clean Studio | tema claro |

## Instalar (Windows)
Baixe `Instalador-Skin-Lumina-OBS.zip` no site, extraia e rode `Instalar-Skin-Lumina-OBS.bat`.
Manualmente: copie `temas/*` para `%APPDATA%\obs-studio\themes` e escolha o tema em *Configurações → Aparência*.

## Desenvolvimento
- `obs-modern-skin/` — simulador/preview (Vite + React).
- `gerar-temas.mjs` — gera os `.obt` e os ícones SVG (`node gerar-temas.mjs`).
- `sync-temas.ps1` — gera temas, atualiza `galeria-skins/`, o ZIP e a pasta `docs/` (site publicado).
- `galeria-skins/` — código-fonte do site; `docs/` — cópia publicada pelo GitHub Pages.
