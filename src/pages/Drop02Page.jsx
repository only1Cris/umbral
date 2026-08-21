import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { config, drops } from '../data/store';
import '../drop02.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES_WHITE = 192;
const TOTAL_FRAMES_BLACK = 184;
const DEFAULT_BG = '#0A0A0A';

export default function Drop02Page() {
  const [selectedColor, setSelectedColor] = useState(null); // null = modal inicial de selección
  const [activeColor, setActiveColor] = useState('WHITE'); // 'WHITE' | 'BLACK'
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isColorTransitioning, setIsColorTransitioning] = useState(false);
  const [isScreenFadingOut, setIsScreenFadingOut] = useState(false);
  const [isTransitionLoaderVisible, setIsTransitionLoaderVisible] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const darkOverlayRef = useRef(null);
  const framesWhiteRef = useRef([]);
  const framesBlackRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const activeColorRef = useRef('WHITE');
  const lenisRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const timelinesRef = useRef(new Map());

  const dropData = drops.find((d) => d.id === 'drop-02') || {
    title: 'SIGNATURE TEE [U]',
    price: 25,
    currency: 'USD',
  };

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';

  // Mantener activeColorRef sincronizado
  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  // Precargar frames de ambos colorways
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    let loadedWhite = 0;
    let loadedBlack = 0;
    const totalToLoad = TOTAL_FRAMES_WHITE + TOTAL_FRAMES_BLACK;
    const whiteImgs = [];
    const blackImgs = [];

    // Cargar frames White
    for (let i = 1; i <= TOTAL_FRAMES_WHITE; i++) {
      const img = new Image();
      img.decoding = 'async';
      const frameNum = String(i).padStart(3, '0');
      img.src = `${baseUrl}assets/drop02-frames-white/ezgif-frame-${frameNum}.webp`;

      img.onload = () => {
        loadedWhite++;
        const totalLoaded = loadedWhite + loadedBlack;
        setLoadPercent(Math.round((totalLoaded / totalToLoad) * 100));
        if (totalLoaded === totalToLoad) {
          framesWhiteRef.current = whiteImgs;
          framesBlackRef.current = blackImgs;
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedWhite++;
        const totalLoaded = loadedWhite + loadedBlack;
        setLoadPercent(Math.round((totalLoaded / totalToLoad) * 100));
        if (totalLoaded === totalToLoad) {
          framesWhiteRef.current = whiteImgs;
          framesBlackRef.current = blackImgs;
          setIsLoaded(true);
        }
      };
      whiteImgs.push(img);
    }

    // Cargar frames Black
    for (let i = 1; i <= TOTAL_FRAMES_BLACK; i++) {
      const img = new Image();
      img.decoding = 'async';
      const frameNum = String(i).padStart(3, '0');
      img.src = `${baseUrl}assets/drop02-frames-black/ezgif-frame-${frameNum}.webp`;

      img.onload = () => {
        loadedBlack++;
        const totalLoaded = loadedWhite + loadedBlack;
        setLoadPercent(Math.round((totalLoaded / totalToLoad) * 100));
        if (totalLoaded === totalToLoad) {
          framesWhiteRef.current = whiteImgs;
          framesBlackRef.current = blackImgs;
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedBlack++;
        const totalLoaded = loadedWhite + loadedBlack;
        setLoadPercent(Math.round((totalLoaded / totalToLoad) * 100));
        if (totalLoaded === totalToLoad) {
          framesWhiteRef.current = whiteImgs;
          framesBlackRef.current = blackImgs;
          setIsLoaded(true);
        }
      };
      blackImgs.push(img);
    }

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
      ctx.scale(dpr, dpr);
      drawFrame(currentFrameRef.current, activeColorRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const drawFrame = (index, color = activeColorRef.current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    const frames = color === 'WHITE' ? framesWhiteRef.current : framesBlackRef.current;
    const totalFrames = color === 'WHITE' ? TOTAL_FRAMES_WHITE : TOTAL_FRAMES_BLACK;
    const safeIndex = Math.max(0, Math.min(index, totalFrames - 1));
    const img = frames[safeIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    ctx.fillStyle = DEFAULT_BG;
    ctx.fillRect(0, 0, cw, ch);

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Inicializar animaciones de scroll y ScrollTrigger
  useEffect(() => {
    if (!isLoaded || !selectedColor) return;

    drawFrame(0, activeColor);

    const isMobile = window.innerWidth < 768;
    const lenis = new Lenis({
      duration: isMobile ? 0.9 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const startRafLoop = () => {
      const renderLoop = () => {
        const target = targetFrameRef.current;
        const current = currentFrameRef.current;

        if (Math.abs(target - current) > 0.05) {
          const next = current + (target - current) * 0.25;
          currentFrameRef.current = next;
          drawFrame(Math.round(next), activeColorRef.current);
        } else if (current !== target) {
          currentFrameRef.current = target;
          drawFrame(target, activeColorRef.current);
        }

        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      };
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };
    startRafLoop();

    // Fade out Hero
    gsap.to('#d2-hero', {
      opacity: 0,
      y: -50,
      pointerEvents: 'none',
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: '12% top',
        scrub: true,
      },
    });

    // Secciones de contenido animadas con GSAP Timelines y ScrollTrigger
    const sections = document.querySelectorAll('.d2-scroll-section');
    sections.forEach((section) => {
      const type = section.dataset.animation || 'fade-up';
      const targets = section.querySelectorAll(
        '.section-label, .section-heading, .section-body, .section-spec-list, .d2-spec-table-compact, .lookbook-inner, .cta-box'
      );
      const tl = gsap.timeline({ paused: true });

      if (type === 'slide-left') {
        tl.fromTo(targets, { x: -60, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' });
      } else if (type === 'clip-reveal') {
        tl.fromTo(targets, { clipPath: 'inset(100% 0 0 0)', y: 35, opacity: 0 }, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power4.out' });
      } else if (type === 'stagger-up') {
        tl.fromTo(targets, { y: 45, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' });
      } else if (type === 'scale-up') {
        tl.fromTo(targets, { scale: 0.92, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' });
      } else {
        tl.fromTo(targets, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' });
      }

      timelinesRef.current.set(section, tl);
    });

    // ScrollTrigger principal para frames y secciones
    ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: isMobile ? 0.3 : true,
      onUpdate: (self) => {
        const totalFrames = activeColorRef.current === 'WHITE' ? TOTAL_FRAMES_WHITE : TOTAL_FRAMES_BLACK;
        const frameProgress = Math.min(self.progress / 0.88, 1);
        const nextTarget = Math.min(Math.floor(frameProgress * totalFrames), totalFrames - 1);
        targetFrameRef.current = nextTarget;

        const pPercent = self.progress * 100;
        let overlayOpacity = 0.15;
        // El fondo se mantiene visible durante Sección 01, 02 y 03 (Cuello Rib). Oscurece al entrar a Sección 04 (Editorial).
        if (pPercent >= 76) {
          overlayOpacity = 0.15 + Math.min((pPercent - 76) / 8, 0.82);
        }
        if (darkOverlayRef.current) {
          darkOverlayRef.current.style.opacity = overlayOpacity;
        }

        sections.forEach((section) => {
          const enter = parseFloat(section.dataset.enter);
          const leave = parseFloat(section.dataset.leave);
          const tl = timelinesRef.current.get(section);
          const isInRange = pPercent >= enter && pPercent <= leave;

          if (isInRange) {
            if (!section.classList.contains('is-active')) {
              section.classList.add('is-active');
              if (tl) tl.play();
            }
          } else {
            if (section.classList.contains('is-active')) {
              section.classList.remove('is-active');
              if (tl) tl.reverse();
            }
          }
        });
      },
    });

    // Animación de Marquee sincronizado con el scroll (idéntico al Drop 01)
    const marqueeEl = document.querySelector('.marquee-wrap');
    if (marqueeEl) {
      const marqueeText = marqueeEl.querySelector('.marquee-text');
      if (marqueeText) {
        const updateMarquee = () => {
          const textWidth = marqueeText.scrollWidth;
          const windowWidth = window.innerWidth;
          const totalDistance = Math.max(textWidth - windowWidth + 150, 0);

          gsap.fromTo(
            marqueeText,
            { x: 0 },
            {
              x: -totalDistance,
              ease: 'none',
              scrollTrigger: {
                trigger: scrollContainerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        };
        updateMarquee();
        window.addEventListener('resize', updateMarquee);
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove(tickerCallback);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      lenis.destroy();
    };
  }, [isLoaded, selectedColor]);

  // Selección inicial con micro pantalla de carga y transición fluida
  const handleSelectInitialColor = (color) => {
    setIsScreenFadingOut(true);
    setTimeout(() => {
      setIsTransitionLoaderVisible(true);
      setIsScreenFadingOut(false);
      setTransitionProgress(20);

      // Simular progreso rápido y elegante
      const timer1 = setTimeout(() => setTransitionProgress(65), 180);
      const timer2 = setTimeout(() => setTransitionProgress(100), 380);

      setTimeout(() => {
        setSelectedColor(color);
        setActiveColor(color);
        activeColorRef.current = color;
        drawFrame(0, color);

        // Desvanecer loader
        setTimeout(() => {
          setIsTransitionLoaderVisible(false);
        }, 320);
      }, 520);
    }, 380);
  };

  // Cambio de colorway rápido con apagón de luces (fade-out a negro -> render instantáneo -> fade-in)
  const handleSwitchColor = (color) => {
    if (color === activeColor || isColorTransitioning) return;
    setIsColorTransitioning(true);

    setTimeout(() => {
      setActiveColor(color);
      activeColorRef.current = color;
      // Redibujar inmediatamente el frame actual con la nueva paleta
      drawFrame(Math.round(currentFrameRef.current), color);
      ScrollTrigger.refresh();

      setTimeout(() => {
        setIsColorTransitioning(false);
      }, 150);
    }, 280);
  };

  const scrollToSection = (sectionId, e) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);

    const sectionPercents = {
      hero: 0,
      tpu: 0.18,
      specs: 0.45,
      craft: 0.68,
      lookbook: 0.82,
      acquire: 0.94,
    };

    const targetPct = sectionPercents[sectionId];
    if (targetPct === undefined || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const maxScroll = container.scrollHeight - window.innerHeight;
    const targetScrollY = container.offsetTop + maxScroll * targetPct;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScrollY, { duration: 1.2, immediate: false });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  const orderWhatsAppUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hola UMBRAL, deseo ordenar el ${dropData.title} en color ${activeColor} (Talla ${selectedSize}). Precio: $${dropData.price} ${dropData.currency}.`
  )}`;

  return (
    <div className={`drop02-page-root theme-${activeColor.toLowerCase()}-active ${selectedColor ? 'is-entered' : ''}`}>
      {/* Preloader */}
      <div id="loader" className={isLoaded ? 'loaded' : ''}>
        <div className="loader-brand">
          <div className="loader-brand-title">
            <span className="bracket">[</span>UMBRAL<span className="bracket">]</span>
          </div>
          <span className="loader-sub">DROP 002 // SIGNATURE TEE</span>
        </div>
        <div className="loader-bar-wrap">
          <div id="loader-bar" style={{ width: `${loadPercent}%` }}></div>
        </div>
        <div className="loader-meta">
          <span>CARGANDO SECUENCIA DUAL</span>
          <span id="loader-percent">{loadPercent}%</span>
        </div>
      </div>

      {/* Pantalla Inicial de Selección de Colorway con animación */}
      {isLoaded && !selectedColor && (
        <div className={`d2-color-selection-screen ${isScreenFadingOut ? 'is-fading-out' : ''}`}>
          <div className="d2-selection-content">
            <div className="d2-selection-badge">[DROP 002 // SIGNATURE TEE]</div>
            <h1 className="d2-selection-title">SELECCIONA COLORWAY</h1>
            <p className="d2-selection-desc">
              Explora la transición cinemática desde el relieve TPU hasta el cuello Rib en dos expresiones brutales.
            </p>

            <div className="d2-selection-cards">
              <button
                type="button"
                className="d2-select-card white-card"
                onClick={() => handleSelectInitialColor('WHITE')}
              >
                <div className="d2-select-preview">
                  <img src={`${baseUrl}assets/drop02/white-hero-sq.webp`} alt="Pure White Preview" />
                </div>
                <div className="d2-select-info">
                  <span className="d2-select-name">PURE WHITE [U]</span>
                  <span className="d2-select-sub">ALGODÓN BLANCO // TPU NEGRO</span>
                  <span className="d2-select-btn">EXPLORAR DROP →</span>
                </div>
              </button>

              <button
                type="button"
                className="d2-select-card black-card"
                onClick={() => handleSelectInitialColor('BLACK')}
              >
                <div className="d2-select-preview">
                  <img src={`${baseUrl}assets/drop02/black-hero-sq.webp`} alt="Deep Black Preview" />
                </div>
                <div className="d2-select-info">
                  <span className="d2-select-name">DEEP BLACK [U]</span>
                  <span className="d2-select-sub">ALGODÓN NEGRO // TPU BLANCO</span>
                  <span className="d2-select-btn">EXPLORAR DROP →</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Micro Pantalla de Carga de Transición al seleccionar color */}
      {isTransitionLoaderVisible && (
        <div className="d2-transition-loader-screen">
          <div className="d2-loader-box">
            <div className="d2-loader-brand">
              <span className="bracket">[</span>UMBRAL<span className="bracket">]</span>
            </div>
            <span className="d2-loader-tag">CONFIGURANDO SECUENCIA 3D</span>
            <div className="d2-loader-bar-wrap">
              <div className="d2-loader-bar-fill" style={{ width: `${transitionProgress}%` }}></div>
            </div>
            <span className="d2-loader-sub">CARGANDO TEXTURAS // {activeColor} EDITION</span>
          </div>
        </div>
      )}

      {/* Header flotante unificado */}
      <header className="site-header">
        <nav>
          <div className="nav-left">
            <Link to="/" className="nav-brand" title="Volver al inicio de UMBRAL">
              <span className="nav-isotipo">[U]</span>
              <span>UMBRAL</span>
            </Link>
            <span className="nav-tagline">OBJECTS FOR THE EVERYDAY</span>
          </div>

          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link nav-link-home">
                ← Colección
              </Link>
            </li>
            <li>
              <a href="#tpu" className="nav-link" onClick={(e) => scrollToSection('tpu', e)}>
                TPU
              </a>
            </li>
            <li>
              <a href="#specs" className="nav-link" onClick={(e) => scrollToSection('specs', e)}>
                Specs
              </a>
            </li>
            <li>
              <a href="#craft" className="nav-link" onClick={(e) => scrollToSection('craft', e)}>
                Cuello Rib
              </a>
            </li>
            <li>
              <a href="#lookbook" className="nav-link" onClick={(e) => scrollToSection('lookbook', e)}>
                Editorial
              </a>
            </li>
          </ul>

          <div className="nav-right">
            {/* Switcher Rápido de Colorway */}
            <div className="d2-nav-color-toggle">
              <button
                type="button"
                className={`d2-color-pill ${activeColor === 'WHITE' ? 'active' : ''}`}
                onClick={() => handleSwitchColor('WHITE')}
                title="Cambiar a Blanco"
              >
                W
              </button>
              <button
                type="button"
                className={`d2-color-pill ${activeColor === 'BLACK' ? 'active' : ''}`}
                onClick={() => handleSwitchColor('BLACK')}
                title="Cambiar a Negro"
              >
                B
              </button>
            </div>

            <a href="#acquire" className="btn-pill-cta" onClick={(e) => scrollToSection('acquire', e)}>
              <span>ORDENAR</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <button
              type="button"
              className="menu-toggle-btn"
              aria-label="Abrir menú de navegación"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`menu-icon ${isMobileMenuOpen ? 'is-open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span>← Volver a Colección</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </li>
          <li>
            <a href="#tpu" className="mobile-nav-link" onClick={(e) => scrollToSection('tpu', e)}>
              <span>01 / Relieve TPU Mate</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#specs" className="mobile-nav-link" onClick={(e) => scrollToSection('specs', e)}>
              <span>02 / Ficha de Composición</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#craft" className="mobile-nav-link" onClick={(e) => scrollToSection('craft', e)}>
              <span>03 / Cuello Rib Grueso</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#lookbook" className="mobile-nav-link" onClick={(e) => scrollToSection('lookbook', e)}>
              <span>04 / Campaña Editorial</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#acquire" className="mobile-nav-link" onClick={(e) => scrollToSection('acquire', e)}>
              <span>05 / Adquirir Signature Tee</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
        </ul>
        <div className="mobile-nav-divider"></div>
        <div className="mobile-nav-footer">
          <span>DROP 002 // $25 USD</span>
          <span>{activeColor} EDITION</span>
        </div>
      </div>

      {/* Canvas Wrap */}
      <div className="canvas-wrap">
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
      <div ref={darkOverlayRef} id="dark-overlay"></div>
      <div className="noise-overlay"></div>

      {/* Marquee Banner */}
      <div className="marquee-wrap" data-scroll-speed="-35">
        <div className="marquee-text">
          SIGNATURE TEE • DROP 002 • UMBRAL [U] • {activeColor} EDITION • OBJECTS FOR THE EVERYDAY • JERSEY 30.1 •
        </div>
      </div>

      {/* Scroll Container */}
      <main ref={scrollContainerRef} id="scroll-container" style={{ height: '900vh' }}>
        {/* Section 00: Hero */}
        <section className="hero-standalone" id="d2-hero">
          <div className="hero-main">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span className="hero-badge-text">DROP 002 // {activeColor} EDITION</span>
            </div>
            <h1 className="hero-title">
              SIGNATURE<br />
              <span className="bracket">[</span>TEE<span className="bracket">]</span>
            </h1>
            <p className="hero-tagline">OBJECTS FOR THE EVERYDAY. TPU RELIEF & HEAVY RIB.</p>
          </div>

          <div className="hero-footer">
            <div className="hero-meta-block">
              <div className="hero-meta-item">
                <span className="hero-meta-label">TEJIDO</span>
                <span className="hero-meta-val">JERSEY 30.1</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">FIT</span>
                <span className="hero-meta-val">BOXY OVERSIZE</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">COLORWAY</span>
                <span className="hero-meta-val">{activeColor} [U]</span>
              </div>
            </div>

            <div className="scroll-indicator">
              <span>SCROLL PARA EXPLORAR</span>
              <div className="scroll-line"></div>
            </div>
          </div>
        </section>

        {/* Section 01: TPU */}
        <section
          className="scroll-section d2-scroll-section section-content align-left"
          id="tpu"
          data-enter="14"
          data-leave="32"
          data-animation="slide-left"
        >
          <div className="section-inner">
            <span className="section-label">01 / DETALLE TÁCTIL</span>
            <h2 className="section-heading">
              ESTAMPADO TPU <br />
              <span className="highlight">EN ALTO RELIEVE.</span>
            </h2>
            <p className="section-body">
              Emblema brutalista [U] microinyectado en termopoliuretano (TPU) de alta densidad. Su acabado mate suave ofrece un relieve tridimensional de 4.5 a 5 cm con bordes de precisión arquitectónica.
            </p>
            <ul className="section-spec-list">
              <li className="section-spec-item">Microinyección 3D de <strong>alto relieve</strong></li>
              <li className="section-spec-item">Acabado <strong>mate táctil</strong> ultra resistente</li>
              <li className="section-spec-item">Contraste cromático ({activeColor === 'WHITE' ? 'TPU Negro / Base Blanca' : 'TPU Blanco / Base Negra'})</li>
            </ul>
          </div>
        </section>

        {/* Section 02: Ficha Técnica & Composición (Movida a Sección 02) */}
        <section
          className="scroll-section d2-scroll-section section-content align-right"
          id="specs"
          data-enter="38"
          data-leave="56"
          data-animation="clip-reveal"
        >
          <div className="section-inner">
            <span className="section-label">02 / ESPECIFICACIONES</span>
            <h2 className="section-heading">
              FICHA DE <br />
              <span className="highlight">COMPOSICIÓN.</span>
            </h2>

            <div className="d2-spec-table-compact">
              <div className="spec-row">
                <span>COMPOSICIÓN</span>
                <strong>80% ALGODÓN / 20% POLIÉSTER</strong>
              </div>
              <div className="spec-row">
                <span>TEJIDO</span>
                <strong>JERSEY 30.1 DE ALTO RENDIMIENTO</strong>
              </div>
              <div className="spec-row">
                <span>SILUETA</span>
                <strong>BOXY OVERSIZE FIT</strong>
              </div>
              <div className="spec-row">
                <span>TALLAS DISPONIBLES</span>
                <strong>S / M (AMPLIAS)</strong>
              </div>
              <div className="spec-row">
                <span>COLORWAY</span>
                <strong>{activeColor === 'WHITE' ? 'PURE WHITE' : 'DEEP BLACK'} [U]</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Cuello Rib (Movida a Sección 03) */}
        <section
          className="scroll-section d2-scroll-section section-content align-left"
          id="craft"
          data-enter="62"
          data-leave="76"
          data-animation="stagger-up"
        >
          <div className="section-inner">
            <span className="section-label">03 / CONSTRUCCIÓN</span>
            <h2 className="section-heading">
              CUELLO RIB <br />
              <span className="highlight">GRUESO 3.2 CM.</span>
            </h2>
            <p className="section-body">
              Desarrollado para mantener su tensión y estructura uso tras uso. Diseñado con ribeteado grueso de alta elasticidad y costura de refuerzo interna invisible.
            </p>
            <ul className="section-spec-list">
              <li className="section-spec-item">Ribbing grueso de <strong>3.2 cm</strong> indeformable</li>
              <li className="section-spec-item">Costura oculta con <strong>cinta tapa costura</strong> interna</li>
              <li className="section-spec-item">Caída estructurada sobre hombros y cuello</li>
            </ul>
          </div>
        </section>

        {/* Section 04: Campaña Editorial 16:9 */}
        <section
          className="scroll-section d2-scroll-section section-lookbook align-center"
          id="lookbook"
          data-enter="78"
          data-leave="89"
          data-animation="scale-up"
        >
          <div className="lookbook-inner">
            <span className="section-label">04 / CAMPAÑA EDITORIAL</span>
            <h2 className="section-heading">DETALLES EN ALTA DEFINICIÓN</h2>
            <div className="lookbook-grid">
              <div className="lookbook-card">
                <img
                  src={
                    activeColor === 'WHITE'
                      ? `${baseUrl}assets/drop02/white-hero.webp`
                      : `${baseUrl}assets/drop02/black-hero.webp`
                  }
                  alt="Umbral Signature Tee Hero"
                  className="lookbook-img"
                />
                <div className="lookbook-meta">
                  <span className="lookbook-tag">SILUETA COMPLETA</span>
                  <span className="lookbook-coord">SIGNATURE TEE 16:9</span>
                </div>
              </div>
              <div className="lookbook-card">
                <img
                  src={
                    activeColor === 'WHITE'
                      ? `${baseUrl}assets/drop02/white-neck.webp`
                      : `${baseUrl}assets/drop02/black-neck.webp`
                  }
                  alt="Umbral Cuello Rib"
                  className="lookbook-img"
                />
                <div className="lookbook-meta">
                  <span className="lookbook-tag">CUELLO RIB GRUESO</span>
                  <span className="lookbook-coord">HEAVY RIB COLLAR</span>
                </div>
              </div>
              <div className="lookbook-card">
                <img
                  src={
                    activeColor === 'WHITE'
                      ? `${baseUrl}assets/drop02/white-tpu.webp`
                      : `${baseUrl}assets/drop02/black-tpu.webp`
                  }
                  alt="Umbral TPU Relieve"
                  className="lookbook-img"
                />
                <div className="lookbook-meta">
                  <span className="lookbook-tag">LOGO TPU RELIEVE</span>
                  <span className="lookbook-coord">MATTE RELIEF EMBLEM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: Checkout & Adquirir (100% Homogéneo al Drop 01) */}
        <section
          className="scroll-section d2-scroll-section section-cta align-center"
          id="acquire"
          data-enter="91"
          data-leave="100"
          data-animation="scale-up"
        >
          <div className="cta-box">
            <span className="section-label">DROP 002 // DISPONIBLE AHORA</span>
            <h2 className="section-heading">
              ADQUIERE TU <br />
              <span className="highlight">SIGNATURE TEE.</span>
            </h2>

            <div className="cta-price-tag">
              <span className="cta-price-currency">$</span>
              <span className="cta-price-amount">{dropData.price}</span>
              <span className="stat-suffix">{dropData.currency} // {activeColor} EDITION</span>
            </div>

            <div className="size-selector">
              <button
                type="button"
                className={`size-btn ${selectedSize === 'S' ? 'active' : ''}`}
                onClick={() => setSelectedSize('S')}
              >
                S
              </button>
              <button
                type="button"
                className={`size-btn ${selectedSize === 'M' ? 'active' : ''}`}
                onClick={() => setSelectedSize('M')}
              >
                M
              </button>
            </div>

            <div className="cta-actions">
              <a
                href={orderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-order"
              >
                <span>ORDENAR DROP 002 ({activeColor})</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="https://instagram.com/umbral.archive001/" target="_blank" rel="noopener noreferrer" className="btn-secondary-dm">
                O consultar vía Direct Message [Instagram]
              </a>
            </div>

            <div className="cta-location">
              <span>CARACAS, VENEZUELA • ENVIOS A TODO EL PAÍS</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer 100% Consistente con Drop 01 y Homepage */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-brand-title">
              <span>[U]</span>
              <span>UMBRAL</span>
            </div>
            <p className="footer-brand-desc">
              El punto de transición entre un lugar y otro. Objetos y piezas textiles con enfoque brutalista y minimalista diseñadas en Caracas.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Colección</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home / Catálogo</Link></li>
              <li><Link to="/merchandise/drop-01" className="footer-link">Drop 001 Core Tee</Link></li>
              <li><Link to="/merchandise/drop-02" className="footer-link">Drop 002 Signature Tee</Link></li>
              <li><Link to="/#drops" className="footer-link">Objetos & Accesorios</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Umbral</h4>
            <ul className="footer-links">
              <li><Link to="/#manifesto" className="footer-link">Manifesto</Link></li>
              <li><a href="#lookbook" className="footer-link">Editorial 2026</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contacto</h4>
            <ul className="footer-links">
              <li><a href="https://www.instagram.com/umbral.archive001/" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram [@umbral.archive001/]</a></li>
              <li><a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp Orders</a></li>
              <li><span className="footer-link">Caracas, Venezuela</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} UMBRAL®. TODOS LOS DERECHOS RESERVADOS.</span>
          <span className="footer-credits">OBJECTS FOR THE EVERYDAY</span>
        </div>
      </footer>
    </div>
  );
}
