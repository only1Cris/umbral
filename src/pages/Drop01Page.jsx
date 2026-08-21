import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 198;
const DEFAULT_BG = '#EBE7DF';

export default function Drop01Page() {
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const darkOverlayRef = useRef(null);

  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [statValues, setStatValues] = useState({
    gsm: 0,
    cotton: 0,
    drop: 0,
    price: 0,
  });

  const framesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const timelinesRef = useRef(new Map());
  const countersAnimatedRef = useRef(false);
  const lenisRef = useRef(null);

  // Navegación suave por porcentaje a secciones específicas del scroll container
  const scrollToSection = (sectionId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileMenuOpen(false);

    // Mapeo preciso al porcentaje óptimo de visualización de cada sección
    const sectionPercents = {
      concept: 0.22,
      craft: 0.44,
      specs: 0.65,
      lookbook: 0.80,
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

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    const img = framesRef.current[index];
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

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
      ctx.scale(dpr, dpr);
      if (framesRef.current[currentFrameRef.current]) {
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let loadedCount = 0;
    const loadedFrames = [];
    const baseUrl = import.meta.env.BASE_URL;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      const frameNum = String(i).padStart(3, '0');
      img.src = `${baseUrl}assets/drop01-frames/ezgif-frame-${frameNum}.webp`;

      img.onload = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadPercent(pct);

        if (loadedCount === 1) {
          framesRef.current = loadedFrames;
          drawFrame(0);
        }

        if (loadedCount === TOTAL_FRAMES) {
          framesRef.current = loadedFrames;
          drawFrame(0);
          setTimeout(() => {
            setIsLoaded(true);
            drawFrame(0);
          }, 200);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          framesRef.current = loadedFrames;
          setIsLoaded(true);
        }
      };

      loadedFrames.push(img);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    drawFrame(0);

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
          drawFrame(Math.round(next));
        } else if (current !== target) {
          currentFrameRef.current = target;
          drawFrame(target);
        }

        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      };
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };
    startRafLoop();

    gsap.to('#hero', {
      opacity: 0,
      y: -50,
      pointerEvents: 'none',
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: '13% top',
        scrub: true,
      },
    });

    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section) => {
      const type = section.dataset.animation || 'fade-up';
      const targets = section.querySelectorAll(
        '.section-label, .section-heading, .section-body, .section-spec-list, .stats-grid, .lookbook-inner, .cta-box, .transition-divider'
      );
      const tl = gsap.timeline({ paused: true });

      switch (type) {
        case 'slide-left':
          tl.fromTo(
            targets,
            { x: -60, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }
          );
          break;
        case 'clip-reveal':
          tl.fromTo(
            targets,
            { clipPath: 'inset(100% 0 0 0)', y: 35, opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power4.out' }
          );
          break;
        case 'stagger-up':
          tl.fromTo(
            targets,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, duration: 0.75, ease: 'power3.out' }
          );
          break;
        case 'scale-up':
          tl.fromTo(
            targets,
            { scale: 0.92, y: 30, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
          );
          break;
        case 'fade-up':
        default:
          tl.fromTo(
            targets,
            { y: 45, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.75, ease: 'power3.out' }
          );
          break;
      }
      timelinesRef.current.set(section, tl);
    });

    const triggerInstance = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: isMobile ? 0.3 : true,
      onUpdate: (self) => {
        // Rotación continua uniforme y 100% fluida
        const frameProgress = Math.min(self.progress / 0.85, 1);
        const nextTarget = Math.min(
          Math.floor(frameProgress * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );
        targetFrameRef.current = nextTarget;

        const pPercent = self.progress * 100;
        let overlayOpacity = 0.15;

        if (pPercent >= 48) {
          overlayOpacity = 0.15 + Math.min((pPercent - 48) / 8, 0.80);
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

              if (section.classList.contains('section-stats') && !countersAnimatedRef.current) {
                countersAnimatedRef.current = true;
                const statsObj = { gsm: 0, cotton: 0, drop: 0, price: 0 };
                gsap.to(statsObj, {
                  gsm: 240,
                  cotton: 100,
                  drop: 1,
                  price: 25,
                  duration: 1.6,
                  ease: 'power2.out',
                  onUpdate: () => {
                    setStatValues({
                      gsm: Math.round(statsObj.gsm),
                      cotton: Math.round(statsObj.cotton),
                      drop: Math.round(statsObj.drop),
                      price: Math.round(statsObj.price),
                    });
                  },
                });
              }
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

    const marqueeEl = document.querySelector('.marquee-wrap');
    if (marqueeEl) {
      const marqueeText = marqueeEl.querySelector('.marquee-text');
      if (marqueeText) {
        const updateMarqueeAnimation = () => {
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

        updateMarqueeAnimation();
        window.addEventListener('resize', updateMarqueeAnimation);
      }
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      triggerInstance.kill();
    };
  }, [isLoaded]);

  const whatsappMessage = encodeURIComponent(
    `Hola UMBRAL, quiero ordenar la CORE TEE (Drop 001) en Talla ${selectedSize}.`
  );

  return (
    <>
      <div id="loader" className={isLoaded ? 'loaded' : ''}>
        <div className="loader-brand">
          <div className="loader-logo-bracket">[U]</div>
          <div className="loader-title">UMBRAL®</div>
          <div className="loader-tagline">OBJECTS FOR THE EVERYDAY.</div>
        </div>
        <div className="loader-bar-wrap">
          <div id="loader-bar" style={{ width: `${loadPercent}%` }}></div>
        </div>
        <div className="loader-meta">
          <span>OPTIMIZANDO EXPERIENCIA</span>
          <span id="loader-percent">{loadPercent}%</span>
        </div>
      </div>

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
            <li><Link to="/" className="nav-link nav-link-home">← Colección</Link></li>
            <li><a href="#concept" className="nav-link" onClick={(e) => scrollToSection('concept', e)}>Concepto</a></li>
            <li><a href="#craft" className="nav-link" onClick={(e) => scrollToSection('craft', e)}>Construcción</a></li>
            <li><a href="#specs" className="nav-link" onClick={(e) => scrollToSection('specs', e)}>Specs</a></li>
            <li><a href="#lookbook" className="nav-link" onClick={(e) => scrollToSection('lookbook', e)}>Editorial</a></li>
          </ul>
          <div className="nav-right">
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

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span>← Volver a Home / Drops</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </li>
          <li>
            <a href="#concept" className="mobile-nav-link" onClick={(e) => scrollToSection('concept', e)}>
              <span>01 / Concepto</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#craft" className="mobile-nav-link" onClick={(e) => scrollToSection('craft', e)}>
              <span>02 / Construcción</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#specs" className="mobile-nav-link" onClick={(e) => scrollToSection('specs', e)}>
              <span>03 / Especificaciones</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#lookbook" className="mobile-nav-link" onClick={(e) => scrollToSection('lookbook', e)}>
              <span>04 / Editorial Lookbook</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
        </ul>
        <div className="mobile-nav-divider"></div>
        <div className="mobile-nav-footer">
          <span>DROP 001 // $25 USD</span>
          <span>CARACAS, VE</span>
        </div>
      </div>

      <div className="canvas-wrap">
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
      <div ref={darkOverlayRef} id="dark-overlay"></div>
      <div className="noise-overlay"></div>

      <div className="marquee-wrap" data-scroll-speed="-35">
        <div className="marquee-text">
          CORE TEE • UMBRAL [U] • OBJECTS FOR THE EVERYDAY •
        </div>
      </div>

      <main ref={scrollContainerRef} id="scroll-container">
        <section className="hero-standalone" id="hero">
          <div className="hero-main">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span className="hero-badge-text">FIRST OFFICIAL RELEASE / DROP 001</span>
            </div>
            <h1 className="hero-title">
              CORE<br />
              <span className="bracket">[</span>TEE<span className="bracket">]</span>
            </h1>
            <p className="hero-tagline">OBJECTS FOR THE EVERYDAY.</p>
          </div>

          <div className="hero-footer">
            <div className="hero-meta-block">
              <div className="hero-meta-item">
                <span className="hero-meta-label">EDICIÓN</span>
                <span className="hero-meta-val">DROP 001</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">DISPONIBILIDAD</span>
                <span className="hero-meta-val">LIMITADA</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">ORIGEN</span>
                <span className="hero-meta-val">CARACAS, VE</span>
              </div>
            </div>

            <div className="scroll-indicator">
              <span>SCROLL PARA EXPLORAR</span>
              <div className="scroll-line"></div>
            </div>
          </div>
        </section>

        <section
          className="scroll-section section-content align-left"
          id="concept"
          data-enter="12"
          data-leave="32"
          data-animation="slide-left"
        >
          <div className="section-inner">
            <span className="section-label">01 / CONCEPTO</span>
            <h2 className="section-heading">
              EL PUNTO DE <br />
              <span className="highlight">TRANSICIÓN.</span>
            </h2>
            <p className="section-body">
              UMBRAL representa el punto de transición entre un lugar y otro. Un espacio de paso, cambio y nuevas posibilidades donde la arquitectura brutalista y el minimalismo textil convergen.
            </p>
            <ul className="section-spec-list">
              <li className="section-spec-item">Silueta <strong>Boxy Oversize</strong> estructurada</li>
              <li className="section-spec-item">Acabado <strong>Near Black (#0A0A0A)</strong> mate profundo</li>
              <li className="section-spec-item">Corte diseñado para el uso cotidiano de alta resistencia</li>
            </ul>
          </div>
        </section>

        <section
          className="scroll-section section-content align-right"
          id="craft"
          data-enter="34"
          data-leave="54"
          data-animation="clip-reveal"
        >
          <div className="section-inner">
            <span className="section-label">02 / CONSTRUCCIÓN</span>
            <h2 className="section-heading">
              CUELLO ACANALADO <br />
              <span className="highlight">DE ALTA DENSIDAD.</span>
            </h2>
            <p className="section-body">
              Diseño milimétrico con doble pespunte y canalé reforzado que mantiene la forma prenda tras prenda. Diseñado para no deformarse con el tiempo y ofrecer un ajuste imponente.
            </p>
            <ul className="section-spec-list">
              <li className="section-spec-item">Rib collar de <strong>3.2 cm</strong> de grosor óptimo</li>
              <li className="section-spec-item">Costuras invisibles con hilo de alta tenacidad</li>
              <li className="section-spec-item">Isotipo tonal <strong>[U]</strong> micro-estampado en bajo</li>
            </ul>
          </div>
        </section>

        <section
          className="scroll-section section-stats align-center"
          id="specs"
          data-enter="56"
          data-leave="74"
          data-animation="stagger-up"
        >
          <div className="transition-divider">
            <div className="divider-line"></div>
            <span className="divider-tag">[03 // ESPECIFICACIONES TÉCNICAS]</span>
            <div className="divider-line"></div>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-val-wrap">
                <span className="stat-number">{statValues.gsm}</span>
                <span className="stat-suffix">GSM</span>
              </div>
              <span className="stat-label">Heavyweight Cotton</span>
            </div>

            <div className="stat-item">
              <div className="stat-val-wrap">
                <span className="stat-number">{statValues.cotton}</span>
                <span className="stat-suffix">%</span>
              </div>
              <span className="stat-label">Algodón Peinado</span>
            </div>

            <div className="stat-item">
              <div className="stat-val-wrap">
                <span className="stat-number">{statValues.drop}</span>
                <span className="stat-suffix">ST</span>
              </div>
              <span className="stat-label">Official Drop</span>
            </div>

            <div className="stat-item">
              <div className="stat-val-wrap">
                <span className="stat-currency">$</span>
                <span className="stat-number">{statValues.price}</span>
                <span className="stat-suffix">USD</span>
              </div>
              <span className="stat-label">Precio Drop</span>
            </div>
          </div>
        </section>

        <section
          className="scroll-section section-lookbook align-center"
          id="lookbook"
          data-enter="74"
          data-leave="86"
          data-animation="scale-up"
        >
          <div className="lookbook-inner">
            <span className="section-label">04 / CAMPAÑA EDITORIAL</span>
            <h2 className="section-heading">SOMBRAS & ARQUITECTURA</h2>
            <div className="lookbook-grid">
              <div className="lookbook-card">
                <img src={`${import.meta.env.BASE_URL}assets/drop01/core-hero.webp`} alt="Umbral Lookbook 01" className="lookbook-img" />
                <div className="lookbook-meta">
                  <span className="lookbook-tag">PERSPECTIVA FRONTAL</span>
                  <span className="lookbook-coord">10°29'N 66°53'W</span>
                </div>
              </div>
              <div className="lookbook-card">
                <img src={`${import.meta.env.BASE_URL}assets/drop01/core-neck.webp`} alt="Umbral Lookbook 02" className="lookbook-img" />
                <div className="lookbook-meta">
                  <span className="lookbook-tag">DETALLE CONSTRUCCIÓN</span>
                  <span className="lookbook-coord">HEAVY RIB COLLAR</span>
                </div>
              </div>
              <div className="lookbook-card">
                <img src={`${import.meta.env.BASE_URL}assets/drop01/core-back.webp`} alt="Umbral Lookbook 03" className="lookbook-img" />
                <div className="lookbook-meta">
                  <span className="lookbook-tag">SILUETA POSTERIOR</span>
                  <span className="lookbook-coord">BOXY OVERSIZE FIT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="scroll-section section-cta"
          id="acquire"
          data-enter="88"
          data-leave="100"
          data-animation="fade-up"
        >
          <div className="cta-box">
            <span className="section-label">DROP 001 // DISPONIBLE AHORA</span>
            <h2 className="section-heading">
              ADQUIERE TU <br />
              <span className="highlight">CORE TEE</span>
            </h2>

            <div className="cta-price-tag">
              <span className="cta-price-currency">$</span>
              <span className="cta-price-amount">25</span>
            </div>

            <div className="size-selector">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="cta-actions">
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-order"
              >
                <span>ORDENAR DROP 001</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="https://www.instagram.com/umbral.archive001/" target="_blank" rel="noopener noreferrer" className="btn-secondary-dm">
                O consultar vía Direct Message [Instagram]
              </a>
            </div>

            <div className="cta-location">
              <span>CARACAS, VENEZUELA • ENVIOS A TODO EL PAÍS</span>
            </div>
          </div>
        </section>
      </main>

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
              <li><a href="#hero" className="footer-link">Drop 001 Core Tee</a></li>
              <li><a href="#concept" className="footer-link">Concepto de Marca</a></li>
              <li><a href="#specs" className="footer-link">Especificaciones</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Umbral</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Manifesto</Link></li>
              <li><a href="#lookbook" className="footer-link">Editorial 2026</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contacto</h4>
            <ul className="footer-links">
              <li><a href="https://www.instagram.com/umbral.archive001/" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram [@umbral.archive001/]</a></li>
              <li><a href={`https://wa.me/?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp Orders</a></li>
              <li><span className="footer-link">Caracas, Venezuela</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} UMBRAL®. TODOS LOS DERECHOS RESERVADOS.</span>
          <span className="footer-credits">OBJECTS FOR THE EVERYDAY</span>
        </div>
      </footer>
    </>
  );
}
