// ====================================================================
// APLICAÇÃO INTERATIVA - LUMINA OBS
// Efeitos 3D Tilt, Showcase Dinâmico no Hero, Slider Antes/Depois,
// Simulador de VU Meter em tempo real e Lightbox Full HD.
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Showcase do Hero com Seletor Rápido
  const heroTabs = document.querySelectorAll('.hero-tab');
  const heroImg = document.getElementById('hero-mockup-img');
  const heroNome = document.getElementById('hero-mockup-nome');
  const heroTag = document.getElementById('hero-mockup-tag');
  const heroMockupWrap = document.querySelector('.hero-mockup-wrap');

  const temasDados = {
    'lumina-slate': {
      nome: 'Lumina Slate (Recomendado)',
      tag: '#3B82F6 · Ardósia Escura & Safira',
      src: 'assets/lumina-slate.jpg',
      glow: 'rgba(59, 130, 246, 0.4)'
    },
    'lumina-oled': {
      nome: 'Lumina OLED Obsidian',
      tag: '#10B981 · Preto Absoluto 0.0% GPU',
      src: 'assets/lumina-oled.jpg',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    'cyber-amber': {
      nome: 'Cyber Amber Broadcast',
      tag: '#F59E0B · Console Profissional Rádio/TV',
      src: 'assets/cyber-amber.jpg',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    'midnight-violet': {
      nome: 'Midnight Creator',
      tag: '#8B5CF6 · Neon Twitch & Kick',
      src: 'assets/midnight-violet.jpg',
      glow: 'rgba(139, 92, 246, 0.4)'
    },
    'nordic-light': {
      nome: 'Nordic Clean Studio',
      tag: '#2563EB · Modo Claro de Alto Contraste',
      src: 'assets/nordic-light.jpg',
      glow: 'rgba(37, 99, 235, 0.4)'
    }
  };

  heroTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      heroTabs.forEach(t => t.classList.remove('ativo'));
      tab.classList.add('ativo');

      const id = tab.dataset.tema;
      const dado = temasDados[id];
      if (!dado || !heroImg) return;

      heroImg.style.opacity = '0.3';
      heroImg.style.transform = 'scale(0.98)';

      setTimeout(() => {
        heroImg.src = dado.src;
        if (heroNome) heroNome.textContent = dado.nome;
        if (heroTag) heroTag.textContent = dado.tag;
        if (heroMockupWrap) heroMockupWrap.style.setProperty('--mockup-glow', dado.glow);

        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // 2. Efeito 3D Tilt nos Cards e no Mockup do Hero
  const tiltElements = document.querySelectorAll('.card-modelo, .hero-mockup-wrap');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotX = ((y - midY) / midY) * -5;
      const rotY = ((x - midX) / midX) * 5;

      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // 3. Slider Interativo de Antes vs Depois (Comparador com arraste)
  const compContainer = document.querySelector('.split-comparador');
  const compHandle = document.querySelector('.split-handle');
  const compDepois = document.querySelector('.split-depois');

  if (compContainer && compHandle && compDepois) {
    let isDragging = false;

    function atualizarSlider(x) {
      const rect = compContainer.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));

      compHandle.style.left = `${percent}%`;
      compDepois.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
    }

    compHandle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        atualizarSlider(e.clientX);
      }
    });

    // Suporte a Touch em Celulares
    compHandle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) {
        atualizarSlider(e.touches[0].clientX);
      }
    });
  }

  // 4. Simulador Interativo de Medidor de Áudio VU Meter
  const vuBar1 = document.getElementById('sim-vu-1');
  const vuBar2 = document.getElementById('sim-vu-2');
  // 4. Simulador Interativo do Mixer de Áudio e Personalizador de Temas
  const custVu1 = document.getElementById('customizer-vu1');
  const custVu2 = document.getElementById('customizer-vu2');
  const custPeak1 = document.getElementById('customizer-peak1');
  const custPeak2 = document.getElementById('customizer-peak2');
  const custDb1 = document.getElementById('customizer-db1');
  const custDb2 = document.getElementById('customizer-db2');

  let peakHold1 = 80;
  let peakHold2 = 54;

  function simularAudioObs() {
    const time = Date.now();
    // Simulação orgânica de fala no canal 1 e música no canal 2
    const baseFala = 72 + (Math.sin(time / 140) * 15) + (Math.cos(time / 90) * 8);
    const baseMusica = 48 + (Math.cos(time / 220) * 10) + (Math.sin(time / 160) * 5);

    const val1 = Math.max(8, Math.min(97, baseFala + (Math.random() * 4)));
    const val2 = Math.max(6, Math.min(88, baseMusica + (Math.random() * 3)));

    if (custVu1) custVu1.style.width = `${val1}%`;
    if (custVu2) custVu2.style.width = `${val2}%`;

    // Peak Hold marcador dinâmico
    if (val1 > peakHold1) peakHold1 = val1;
    else peakHold1 = Math.max(val1, peakHold1 - 0.45);

    if (val2 > peakHold2) peakHold2 = val2;
    else peakHold2 = Math.max(val2, peakHold2 - 0.35);

    if (custPeak1) custPeak1.style.left = `${peakHold1}%`;
    if (custPeak2) custPeak2.style.left = `${peakHold2}%`;

    // Atualização de dB calibrada com taxa estável (evita layout flicker)
    if (time - lastDbTime > 90) {
      lastDbTime = time;
      const db1 = ((val1 / 100) * 48 - 48).toFixed(1);
      const db2 = ((val2 / 100) * 48 - 48).toFixed(1);

      if (custDb1) custDb1.textContent = `${db1} dB`;
      if (custDb2) custDb2.textContent = `${db2} dB`;
    }

    requestAnimationFrame(simularAudioObs);
  }
  let lastDbTime = 0;
  simularAudioObs();

  // 4.1 Gerenciador de Presets e Padrões de Cores do Personalizador
  const obsWindow = document.getElementById('obs-preview-window');
  const presetBoxes = document.querySelectorAll('.preset-box');
  const btnCustDownload = document.getElementById('btn-cust-baixar-qss');
  const btnCustImage = document.getElementById('btn-cust-ver-imagem');
  const btnCustCompare = document.getElementById('btn-cust-antes-depois');
  const btnCustErgo = document.getElementById('btn-cust-ergonomia');
  const btnExecutarTrans = document.getElementById('btn-executar-transicao');

  const presetsConfig = {
    'midnight': {
      themeAttr: 'midnight',
      downloadHref: 'temas/midnight-violet.obt',
      downloadName: 'Midnight-Violet.obt',
      color: '#8B5CF6',
      borderColor: '#A78BFA',
      glow: 'rgba(139, 92, 246, 0.4)',
      imgSrc: 'assets/midnight-violet.jpg',
      title: 'Midnight Creator (Violeta Neon)'
    },
    'amber': {
      themeAttr: 'amber',
      downloadHref: 'temas/cyber-amber.obt',
      downloadName: 'Cyber-Amber.obt',
      color: '#F59E0B',
      borderColor: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.4)',
      imgSrc: 'assets/cyber-amber.jpg',
      title: 'Cyber Amber Broadcast (Âmbar)'
    },
    'oled': {
      themeAttr: 'oled',
      downloadHref: 'temas/lumina-oled.obt',
      downloadName: 'Lumina-OLED.obt',
      color: '#10B981',
      borderColor: '#34D399',
      glow: 'rgba(16, 185, 129, 0.4)',
      imgSrc: 'assets/lumina-oled.jpg',
      title: 'Lumina OLED Obsidian (Verde Esmeralda)'
    },
    'slate': {
      themeAttr: 'slate',
      downloadHref: 'temas/lumina-slate.obt',
      downloadName: 'Lumina-Slate.obt',
      color: '#3B82F6',
      borderColor: '#60A5FA',
      glow: 'rgba(59, 130, 246, 0.4)',
      imgSrc: 'assets/lumina-slate.jpg',
      title: 'Lumina Slate (Safira & Ardósia)'
    },
    'nordic': {
      themeAttr: 'nordic',
      downloadHref: 'temas/nordic-light.obt',
      downloadName: 'Nordic-Light.obt',
      color: '#2563EB',
      borderColor: '#60A5FA',
      glow: 'rgba(37, 99, 235, 0.4)',
      imgSrc: 'assets/nordic-light.jpg',
      title: 'Nordic Clean Studio (Light Mode)'
    }
  };

  let activePresetKey = 'midnight';

  function aplicarPreset(presetKey) {
    const config = presetsConfig[presetKey];
    if (!config || !obsWindow) return;

    activePresetKey = presetKey;

    // Atualiza cards de seleção
    presetBoxes.forEach(box => {
      const isCurrent = box.dataset.preset === presetKey;
      box.classList.toggle('ativo', isCurrent);
      box.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Atualiza tema da janela do OBS
    obsWindow.setAttribute('data-active-theme', config.themeAttr);

    // Atualiza botão de download com estilo dinâmico correspondente
    if (btnCustDownload) {
      btnCustDownload.href = config.downloadHref;
      btnCustDownload.download = config.downloadName;
      btnCustDownload.style.background = config.color;
      btnCustDownload.style.borderColor = config.borderColor;
      btnCustDownload.style.boxShadow = `0 4px 16px ${config.glow}`;
    }
  }

  presetBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const presetKey = box.dataset.preset;
      aplicarPreset(presetKey);
    });
  });

  // Ação Ver Imagem (PNG) -> Abre no Lightbox Full HD
  if (btnCustImage) {
    btnCustImage.addEventListener('click', (e) => {
      e.preventDefault();
      const cfg = presetsConfig[activePresetKey];
      if (cfg) abrirLightbox(cfg.imgSrc, cfg.title);
    });
  }

  // Ação Antes / Depois -> Rola suavemente até o comparador
  if (btnCustCompare) {
    btnCustCompare.addEventListener('click', (e) => {
      e.preventDefault();
      const compEl = document.getElementById('comparador');
      if (compEl) compEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Ação Ergonomia -> Rola suavemente até recursos
  if (btnCustErgo) {
    btnCustErgo.addEventListener('click', (e) => {
      e.preventDefault();
      const recEl = document.getElementById('recursos');
      if (recEl) recEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Ação Executar Transição -> Feedback tátil e sonoro visual
  if (btnExecutarTrans) {
    btnExecutarTrans.addEventListener('click', () => {
      btnExecutarTrans.style.transform = 'scale(0.95)';
      const sceneItem = document.querySelector('.obs-scene-item.ativo');
      if (sceneItem) {
        sceneItem.style.opacity = '0.4';
        setTimeout(() => sceneItem.style.opacity = '1', 200);
      }
      setTimeout(() => {
        btnExecutarTrans.style.transform = '';
      }, 150);
    });
  }

  // Interatividade nos botões de transição (Esmaecer, Cortar, Deslizar, Stinger)
  const transBtns = document.querySelectorAll('.trans-btn');
  transBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      transBtns.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
    });
  });

  // Interatividade nas Cenas
  const sceneItems = document.querySelectorAll('.obs-scene-item');
  sceneItems.forEach(item => {
    item.addEventListener('click', () => {
      sceneItems.forEach(i => i.classList.remove('ativo'));
      item.classList.add('ativo');
    });
  });

  // Inicializa no Midnight Creator (ou salvo)
  aplicarPreset('midnight');

  // 5. Filtros da Galeria por Categoria
  const botoesFiltro = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.card-modelo');

  botoesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
      botoesFiltro.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');

      const categoria = btn.dataset.filtro;
      cards.forEach(card => {
        if (categoria === 'todos' || card.dataset.categoria === categoria) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Cópia Rápida de Cores da Paleta com Tooltip
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', (e) => {
      e.stopPropagation();
      const cor = sw.getAttribute('data-cor') || sw.style.backgroundColor;
      navigator.clipboard.writeText(cor).then(() => {
        const originalTitle = sw.title;
        sw.title = '✓ Copiado: ' + cor;
        sw.style.transform = 'scale(1.35)';
        setTimeout(() => {
          sw.title = originalTitle;
          sw.style.transform = 'scale(1)';
        }, 1500);
      });
    });
  });

  // 7. Lightbox Modal de Zoom em Alta Definição
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitulo = document.getElementById('lightbox-titulo');
  const lightboxClose = document.getElementById('lightbox-close');

  function abrirLightbox(src, titulo) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxTitulo.textContent = titulo;
    lightbox.classList.add('ativo');
    document.body.style.overflow = 'hidden';
  }

  function fecharLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('ativo');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-zoom, .card-thumb, #hero-mockup-img').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const card = el.closest('.card-modelo') || el.closest('.hero-mockup-wrap');
      const img = card.querySelector('img');
      const titulo = card.querySelector('h3')?.textContent || 'Lumina OBS em Alta Definição';
      abrirLightbox(img.src, titulo);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', fecharLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-conteudo')) {
        fecharLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharLightbox();
  });
});
