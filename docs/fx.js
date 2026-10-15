'use strict';
// ====================================================================
// LUMINA OBS - SISTEMA AVANÇADO DE BACKGROUNDS INTERATIVOS (FX)
// Baseado no design system oficial de compartilhar-tela com 4 motores:
// 1) Constelação Dinâmica (Hero): nós neon conectados por linhas com interação do mouse.
// 2) Grade Cibernética (Comparador): células em matriz que acendem e deixam rastro de luz sob o cursor.
// 3) Atração & Explosão Orbital (Simulador de Áudio): partículas atraídas pelo mouse que explodem em anéis de choque.
// 4) Malha Prismática 3D (Instalação): geometria reflexiva com feixe radial holográfico que persegue o mouse.
// ====================================================================

(function () {
  const html = document.documentElement;
  const body = document.body;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches || !!(navigator.connection && navigator.connection.saveData);
  const comMouse = matchMedia('(hover: hover)').matches;

  // Estado e auto-proteção
  const estado = { usuario: true, pesado: false };
  try { estado.usuario = localStorage.getItem('fx') !== 'off'; } catch {}
  try { estado.pesado = sessionStorage.getItem('fx-pesado') === '1'; } catch {}

  const habilitado = () => !reduzido && estado.usuario && !estado.pesado;
  const podeAnimar = () => habilitado() && !document.hidden;

  const fxs = [];
  function aplicarEstado() {
    html.classList.toggle('fx-off', !habilitado());
    fxs.forEach((f) => f.reavaliar && f.reavaliar());
  }

  function marcarPesado() {
    estado.pesado = true;
    try { sessionStorage.setItem('fx-pesado', '1'); } catch {}
    aplicarEstado();
  }

  // Laço com trava de 30-60 FPS e custo inteligente
  function criarLoop(quadro) {
    let id = 0, ult = 0;
    const custos = [];
    const tick = (t) => {
      id = requestAnimationFrame(tick);
      if (t - ult < 28) return; // ~35 FPS para fluidez cinematográfica sem pesar CPU
      const dt = Math.min(t - ult, 100);
      ult = t;
      if (!podeAnimar()) return parar();

      const inicio = performance.now();
      const seguir = quadro(dt);
      custos.push(performance.now() - inicio);

      if (custos.length >= 90) {
        const media = custos.reduce((x, y) => x + y, 0) / custos.length;
        custos.length = 0;
        if (media > 8) return marcarPesado();
      }
      if (seguir === false) parar();
    };

    function parar() {
      if (id) {
        cancelAnimationFrame(id);
        id = 0;
      }
    }

    return {
      iniciar() {
        if (!id && podeAnimar()) {
          ult = 0;
          id = requestAnimationFrame(tick);
        }
      },
      parar,
      ativo: () => !id
    };
  }

  function observar(el, fx) {
    fx.vis = true;
    if (!('IntersectionObserver' in window)) {
      return;
    }
    new IntersectionObserver(([e]) => {
      fx.vis = e.isIntersecting;
      fx.reavaliar && fx.reavaliar();
    }, { rootMargin: '60px' }).observe(el);
  }

  const exibido = (el) => el && el.getClientRects().length > 0;
  function ajustarCanvas(canvas, w, h) {
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);

  // --------------------------------------------------------------------
  // 1) CONSTELAÇÃO (Hero): Nós interativos conectados por linhas luminosas
  // --------------------------------------------------------------------
  function constelacao(canvas) {
    const ctx = canvas.getContext('2d');
    const fx = { aoMover: null };
    let w = 0, h = 0, nos = [];
    const mouse = { x: -1000, y: -1000, dentro: false };
    const DIST = 165, DIST_M = 220;

    function medir() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      ajustarCanvas(canvas, w, h);
      const n = Math.min(68, Math.max(24, Math.round((w * h) / 16000)));
      nos = Array.from({ length: n }, () => ({
        x: rnd(0, w),
        y: rnd(0, h),
        vx: rnd(-0.35, 0.35),
        vy: rnd(-0.35, 0.35),
        tipo: Math.random() > 0.4 ? 'safira' : 'esmeralda'
      }));
    }

    const loop = criarLoop((dt) => {
      const k = dt / 30;
      ctx.clearRect(0, 0, w, h);

      // Movimentação
      for (const n of nos) {
        n.x += n.vx * k;
        n.y += n.vy * k;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nos.length; i++) {
        const a = nos[i];
        // Conexões entre nós
        for (let j = i + 1; j < nos.length; j++) {
          const b = nos[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < DIST * DIST) {
            const op = (1 - Math.sqrt(d2) / DIST) * 0.42;
            ctx.strokeStyle = a.tipo === 'safira' ? `rgba(96, 165, 250, ${op})` : `rgba(52, 211, 153, ${op})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Conexão direta com o mouse
        if (mouse.dentro) {
          const dx = a.x - mouse.x, dy = a.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < DIST_M * DIST_M) {
            const op = (1 - Math.sqrt(d2) / DIST_M) * 0.8;
            ctx.strokeStyle = `rgba(147, 197, 253, ${op})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Desenhar nós luminosos
      for (const n of nos) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = n.tipo === 'safira' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(16, 185, 129, 0.9)';
        ctx.fill();
      }

      // Nó do mouse
      if (mouse.dentro) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#67e8f9';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    fx.aoMover = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.dentro = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= r.width && mouse.y <= r.height;
    };

    fx.reavaliar = () => {
      if (podeAnimar() && fx.vis && exibido(canvas)) {
        if (!nos.length) medir();
        loop.iniciar();
      } else {
        loop.parar();
        if (w) ctx.clearRect(0, 0, w, h);
      }
    };

    window.addEventListener('resize', () => { if (fx.vis) medir(); }, { passive: true });
    observar(canvas, fx);
    fxs.push(fx);
  }

  // --------------------------------------------------------------------
  // 2) GRADE CIBERNÉTICA (Comparador): Matriz de células que acendem sob o cursor
  // --------------------------------------------------------------------
  function grade(canvas, secao) {
    if (!canvas || !secao) return;
    const ctx = canvas.getContext('2d');
    const fx = {};
    const C = 68; // Tamanho das células
    const acesas = new Map();

    function medir() {
      ajustarCanvas(canvas, canvas.clientWidth, canvas.clientHeight);
    }

    const loop = criarLoop((dt) => {
      const k = dt / 30;
      const agora = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const [chave, c] of acesas) {
        if (agora - c.t > 300) c.a -= 0.035 * k;
        if (c.a <= 0) {
          acesas.delete(chave);
          continue;
        }
        const x = c.cx * C, y = c.cy * C;
        // Preenchimento neon
        ctx.fillStyle = `rgba(59, 130, 246, ${c.a * 0.12})`;
        ctx.fillRect(x, y, C, C);
        // Borda luminosa
        ctx.strokeStyle = `rgba(96, 165, 250, ${c.a * 0.8})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, C - 1, C - 1);
      }
      return acesas.size > 0;
    });

    fx.aoMover = (e) => {
      if (!podeAnimar() || !fx.vis) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      if (canvas.width !== Math.round(r.width)) medir();

      const cx = Math.floor(x / C), cy = Math.floor(y / C);
      const t = performance.now();

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const a = dx === 0 && dy === 0 ? 1 : (dx !== 0 && dy !== 0 ? 0.3 : 0.6);
          const chave = (cx + dx) + ',' + (cy + dy);
          const atual = acesas.get(chave);
          if (!atual || atual.a < a) {
            acesas.set(chave, { cx: cx + dx, cy: cy + dy, a, t });
          }
        }
      }
      loop.iniciar();
    };

    fx.reavaliar = () => {
      if (!(podeAnimar() && fx.vis)) {
        loop.parar();
        acesas.clear();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    observar(secao, fx);
    fxs.push(fx);
  }

  // --------------------------------------------------------------------
  // 3) ATRAÇÃO & EXPLOSÃO ORBITAL (Simulador): Partículas puxadas pelo mouse
  // --------------------------------------------------------------------
  function atracao(canvas, caixa) {
    if (!canvas || !caixa) return;
    const ctx = canvas.getContext('2d');
    const fx = {};
    let w = 0, h = 0, ps = [];
    let alvo = { x: 0, y: 0 };
    let ativoAte = 0;

    function nova() {
      return {
        x: rnd(0, w),
        y: rnd(0, h),
        tam: rnd(1.2, 4.5),
        v: 0,
        alpha: 0,
        tom: rnd(190, 260), // Tons azuis/violetas elétricos Lumina
        mudou: false,
        q: 0
      };
    }

    function medir() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      ajustarCanvas(canvas, w, h);
      ps = Array.from({ length: 48 }, nova);
      alvo = { x: w / 2, y: h / 2 };
      ps.forEach((p) => (p.v = p.tam * 0.5));
    }

    const loop = criarLoop(() => {
      const agora = performance.now();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0, 0.18)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      const parado = agora > ativoAte;
      for (const p of ps) {
        ctx.strokeStyle = `hsla(${p.tom}, 85%, 60%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tam, 0, Math.PI * 2);
        ctx.stroke();

        if (p.mudou) {
          p.alpha *= 0.92;
          p.tam += 2.2;
          p.q++;
          if (p.q > 38) Object.assign(p, nova());
        } else if (Math.hypot(alvo.x - p.x, alvo.y - p.y) < 36) {
          p.mudou = true;
        } else {
          const ang = Math.atan2(alvo.y - p.y, alvo.x - p.x);
          p.alpha = Math.min(0.9, p.alpha + 0.015);
          p.x += p.v * Math.cos(ang);
          p.y += p.v * Math.sin(ang);
          p.v += 0.024;
        }
      }

      if (parado && agora > ativoAte + 1600) {
        ctx.clearRect(0, 0, w, h);
        ps.forEach((p) => Object.assign(p, nova()));
        return false;
      }
    });

    fx.aoMover = (e) => {
      if (!podeAnimar() || !fx.vis) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      if (!w) medir();
      alvo.x = x;
      alvo.y = y;
      ativoAte = performance.now() + 2000;
      loop.iniciar();
    };

    fx.reavaliar = () => {
      if (!(podeAnimar() && fx.vis)) {
        loop.parar();
        if (w) ctx.clearRect(0, 0, w, h);
      }
    };

    observar(caixa, fx);
    fxs.push(fx);
  }

  // --------------------------------------------------------------------
  // 4) MALHA PRISMÁTICA 3D (Instalação): Triângulos com feixe radial interativo
  // --------------------------------------------------------------------
  function malha(caixa) {
    if (!caixa) return;
    const fx = {};
    let montado = false, brilho, pend = null;
    const BASE = 48, GAP = 2, LARG = BASE * 2 + GAP, ALT = 83;

    function montar() {
      if (montado) return;
      montado = true;
      caixa.textContent = '';
      brilho = document.createElement('div');
      brilho.className = 'fx-brilho';
      const grid = document.createElement('div');
      grid.className = 'fx-malha';
      const col = Math.ceil(caixa.clientWidth / LARG) + 1;
      const lin = Math.ceil(caixa.clientHeight / ALT) + 1;
      grid.style.setProperty('--col', col);

      for (let y = 0; y < lin; y++) {
        for (let x = 0; x < col; x++) {
          const t = document.createElement('div');
          t.className = 'fx-tri' + (y % 2 === 0 ? ' desl' : '');
          grid.append(t);
        }
      }
      caixa.append(brilho, grid);
      mover(caixa.clientWidth / 2, caixa.clientHeight / 2);
    }

    function mover(x, y) {
      if (brilho) brilho.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    fx.aoMover = (e) => {
      if (!podeAnimar() || !fx.vis) return;
      const r = caixa.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < -40 || y < -40 || x > r.width + 40 || y > r.height + 40) return;
      montar();
      if (!pend) {
        pend = requestAnimationFrame(() => {
          pend = null;
          mover(x, y);
        });
      }
    };

    fx.reavaliar = () => {
      if (podeAnimar() && fx.vis) montar();
    };

    window.addEventListener('resize', () => {
      montado = false;
      if (fx.vis) montar();
    }, { passive: true });

    observar(caixa, fx);
    fxs.push(fx);
  }

  // --------------------------------------------------------------------
  // Inicialização dos Seletores
  // --------------------------------------------------------------------
  const q = (s) => document.querySelector(s);
  if (q('.fx-hero')) constelacao(q('.fx-hero'));
  if (q('.fx-grid')) grade(q('.fx-grid'), q('#comparador'));
  if (q('.fx-atracao')) atracao(q('.fx-atracao'), q('.sim-audio-card'));
  if (q('.fx-malha-caixa')) malha(q('.fx-malha-caixa'));

  // Ouvinte mestre de mouse
  let ultimo = 0;
  window.addEventListener('mousemove', (e) => {
    const t = e.timeStamp;
    if (t - ultimo < 16) return;
    ultimo = t;
    if (!habilitado()) return;
    for (const f of fxs) {
      if (f.aoMover) f.aoMover(e);
    }
  }, { passive: true });

  window.addEventListener('blur', aplicarEstado);
  window.addEventListener('focus', aplicarEstado);
  document.addEventListener('visibilitychange', aplicarEstado);
  aplicarEstado();

  window.Fx = { estado, fxs };
})();
