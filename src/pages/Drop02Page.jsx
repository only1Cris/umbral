import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { config, drops } from '../data/store';
import '../drop02.css';

export default function Drop02Page() {
  const [selectedColor, setSelectedColor] = useState('WHITE'); // 'WHITE' | 'BLACK'
  const [displayColor, setDisplayColor] = useState('WHITE');
  const [isFading, setIsFading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M'); // 'S' | 'M'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenisRef = useRef(null);

  const handleColorChange = (newColor) => {
    if (newColor === selectedColor || isFading) return;
    setIsFading(true);
    setSelectedColor(newColor);
    setTimeout(() => {
      setDisplayColor(newColor);
      setIsFading(false);
    }, 280);
  };

  const dropData = drops.find((d) => d.id === 'drop-02') || {
    title: 'SIGNATURE TEE [U]',
    price: 30,
    currency: 'USD',
  };

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

  // Inicializar smooth scroll con Lenis idéntico a Drop01
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollToSection = (id, e) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -70 });
    }
  };

  const orderWhatsAppUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hola UMBRAL, deseo ordenar el ${dropData.title} en color ${selectedColor} (Talla ${selectedSize}). Precio: $${dropData.price} ${dropData.currency}.`
  )}`;

  return (
    <div className={`drop02-root theme-${selectedColor.toLowerCase()}-active`}>
      {/* 100% Consistent Floating Header (Drop 01 & Home Pattern) */}
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
              <a href="#showcase" className="nav-link" onClick={(e) => scrollToSection('showcase', e)}>
                Vista
              </a>
            </li>
            <li>
              <a href="#details" className="nav-link" onClick={(e) => scrollToSection('details', e)}>
                Construcción
              </a>
            </li>
            <li>
              <a href="#specs" className="nav-link" onClick={(e) => scrollToSection('specs', e)}>
                Specs
              </a>
            </li>
            <li>
              <a href="#checkout" className="nav-link" onClick={(e) => scrollToSection('checkout', e)}>
                Checkout
              </a>
            </li>
          </ul>

          <div className="nav-right">
            <a href="#checkout" className="btn-pill-cta" onClick={(e) => scrollToSection('checkout', e)}>
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

      {/* Mobile Drawer (Consistent with Drop 01) */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span>← Volver a Colección / Drops</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </li>
          <li>
            <a href="#showcase" className="mobile-nav-link" onClick={(e) => scrollToSection('showcase', e)}>
              <span>01 / Vista Dual (White & Black)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#details" className="mobile-nav-link" onClick={(e) => scrollToSection('details', e)}>
              <span>02 / Construcción & TPU</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#specs" className="mobile-nav-link" onClick={(e) => scrollToSection('specs', e)}>
              <span>03 / Especificaciones Técnicas</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
          <li>
            <a href="#checkout" className="mobile-nav-link" onClick={(e) => scrollToSection('checkout', e)}>
              <span>04 / Adquirir Signature Tee</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </li>
        </ul>
        <div className="mobile-nav-divider"></div>
        <div className="mobile-nav-footer">
          <span>DROP 002 // ${dropData.price} USD</span>
          <span>CARACAS, VE</span>
        </div>
      </div>

      {/* Marquee Banner Consistent with Brand Identity */}
      <div className="d2-marquee-strip">
        <div className="d2-marquee-text">
          SIGNATURE TEE • DROP 002 • UMBRAL [U] • PURE WHITE & DEEP BLACK • OBJECTS FOR THE EVERYDAY • JERSEY 30.1 •
        </div>
      </div>

      {/* Main Experience */}
      <main className="d2-main-content">
        {/* Hero Section & Dual Monolith Showcase */}
        <section className="d2-hero" id="showcase">
          <div className="d2-hero-meta">
            <span className="badge-live">SEGUNDO LANZAMIENTO OFICIAL</span>
            <span>DROP 002 // SIGNATURE TEE</span>
          </div>

          <h1 className="d2-hero-title">
            DUAL<br />
            <span className="bracket">[</span>MONOLITH<span className="bracket">]</span>
          </h1>

          <p className="d2-hero-sub">
            DOS MANIFESTACIONES CROMÁTICAS DE UNA MISMA SILUETA ARQUITECTÓNICA. PURE WHITE & DEEP BLACK.
          </p>

          {/* Interactive Color Switcher */}
          <div className="d2-color-switcher">
            <button
              type="button"
              className={`d2-color-btn ${selectedColor === 'WHITE' ? 'active' : ''}`}
              onClick={() => handleColorChange('WHITE')}
            >
              <span className="color-swatch white"></span>
              <span>PURE WHITE [U]</span>
            </button>
            <button
              type="button"
              className={`d2-color-btn ${selectedColor === 'BLACK' ? 'active' : ''}`}
              onClick={() => handleColorChange('BLACK')}
            >
              <span className="color-swatch black"></span>
              <span>DEEP BLACK [U]</span>
            </button>
          </div>

          {/* Showcase Display Container */}
          <div className="d2-showcase-container">
            <div className="d2-showcase-wrapper">
              <div className={`d2-hero-image-wrap ${isFading ? 'is-color-fading' : ''}`}>
                <img
                  src={
                    displayColor === 'WHITE'
                      ? `${baseUrl}/assets/drop02/white-hero.webp`
                      : `${baseUrl}/assets/drop02/black-hero.webp`
                  }
                  alt={`Umbral Signature Tee ${displayColor}`}
                  className="d2-hero-image"
                />
                <div className="d2-floating-badge">
                  <span>EDICIÓN LIMITADA</span>
                  <strong>{displayColor === 'WHITE' ? 'BLANCO ÓPTICO // JERSEY 30.1' : 'NEGRO PROFUNDO // JERSEY 30.1'}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Macro Technical Details Section */}
        <section className="d2-details-section" id="details">
          <div className="d2-section-head">
            <span className="d2-section-tag">[02 // CONSTRUCCIÓN & DETALLES]</span>
            <h2 className="d2-section-title">INGENIERÍA DEL OBJETO</h2>
            <p className="d2-section-desc">
              Cada costura, grosor y acabado ha sido diseñado bajo estándares de alta durabilidad y estética brutalista.
            </p>
          </div>

          <div className="d2-cards-grid">
            {/* 01: Cuello Rib */}
            <div className="d2-macro-card">
              <div className={`d2-macro-media ${isFading ? 'is-color-fading' : ''}`}>
                <span className="d2-macro-num">01 / CONSTRUCTION</span>
                <img
                  src={
                    displayColor === 'WHITE'
                      ? `${baseUrl}/assets/drop02/white-neck.webp`
                      : `${baseUrl}/assets/drop02/black-neck.webp`
                  }
                  alt="Cuello Rib Grueso Umbral"
                  loading="lazy"
                />
              </div>
              <div className="d2-macro-body">
                <h3 className="d2-macro-title">CUELLO RIB GRUESO</h3>
                <p className="d2-macro-text">
                  Diseñado con rib de alta densidad que mantiene la estructura y tensión del cuello intacta uso tras uso, evitando deformaciones.
                </p>
                <ul className="d2-macro-spec-list">
                  <li>Ribbing de 3.2 cm estructurado</li>
                  <li>Costura de refuerzo interna oculta</li>
                </ul>
              </div>
            </div>

            {/* 02: Estampado TPU */}
            <div className="d2-macro-card">
              <div className={`d2-macro-media ${isFading ? 'is-color-fading' : ''}`}>
                <span className="d2-macro-num">02 / DETAIL</span>
                <img
                  src={
                    displayColor === 'WHITE'
                      ? `${baseUrl}/assets/drop02/white-tpu.webp`
                      : `${baseUrl}/assets/drop02/black-tpu.webp`
                  }
                  alt="Estampado TPU Relieve Umbral"
                  loading="lazy"
                />
              </div>
              <div className="d2-macro-body">
                <h3 className="d2-macro-title">ESTAMPADO TPU RELIEVE</h3>
                <p className="d2-macro-text">
                  Emblema minimalista en termopoliuretano (TPU) de alto relieve con acabado mate táctil de 4.5 a 5 cm.
                </p>
                <ul className="d2-macro-spec-list">
                  <li>Alto relieve micro-inyectado</li>
                  <li>Acabado mate de textura suave</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Spec Sheet & Composition */}
        <section className="d2-specs-section" id="specs">
          <div className="d2-specs-layout">
            <div className="d2-spec-card-media">
              <img
                src={`${baseUrl}/assets/drop02/spec-card.webp`}
                alt="Ficha Técnica Drop 002 Umbral"
                loading="lazy"
              />
            </div>

            <div className="d2-specs-info">
              <span className="d2-section-tag">[03 // ESPECIFICACIONES TÉCNICAS]</span>
              <h2 className="d2-section-title">FICHA DE COMPOSICIÓN</h2>

              <table className="d2-specs-table">
                <tbody>
                  <tr>
                    <td>MODELO</td>
                    <td>SIGNATURE TEE [U]</td>
                  </tr>
                  <tr>
                    <td>COMPOSICIÓN</td>
                    <td>80% ALGODÓN / 20% POLIÉSTER</td>
                  </tr>
                  <tr>
                    <td>TEJIDO</td>
                    <td>JERSEY 30.1 DE ALTO RENDIMIENTO</td>
                  </tr>
                  <tr>
                    <td>FIT / CORTE</td>
                    <td>BOXY OVERSIZE ARQUITECTÓNICO</td>
                  </tr>
                  <tr>
                    <td>TALLAS</td>
                    <td>S / M (AMPLIAS)</td>
                  </tr>
                  <tr>
                    <td>COLORES</td>
                    <td>WHITE [U] / BLACK [U]</td>
                  </tr>
                  <tr>
                    <td>ORIGEN</td>
                    <td>CARACAS / VENEZUELA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Reactive Checkout & Order Box */}
        <section className="d2-checkout-section" id="checkout">
          <div className="d2-checkout-box">
            <div className="d2-checkout-tag">[04 // ORDENAR DROP 002]</div>
            <h2 className="d2-checkout-title">ADQUIRIR SIGNATURE TEE</h2>
            <div className="d2-checkout-price">
              ${dropData.price} <span>{dropData.currency} // ENVÍOS NACIONALES & CARACAS</span>
            </div>

            <div className="d2-selectors-grid">
              {/* Selector Color */}
              <div className="d2-selector-group">
                <label>COLORWAY SELECCIONADO:</label>
                <div className="d2-btn-group">
                  <button
                    type="button"
                    className={`d2-btn-option ${selectedColor === 'WHITE' ? 'selected' : ''}`}
                    onClick={() => handleColorChange('WHITE')}
                  >
                    PURE WHITE
                  </button>
                  <button
                    type="button"
                    className={`d2-btn-option ${selectedColor === 'BLACK' ? 'selected' : ''}`}
                    onClick={() => handleColorChange('BLACK')}
                  >
                    DEEP BLACK
                  </button>
                </div>
              </div>

              {/* Selector Talla */}
              <div className="d2-selector-group">
                <label>TALLA OVERSIZE:</label>
                <div className="d2-btn-group">
                  <button
                    type="button"
                    className={`d2-btn-option ${selectedSize === 'S' ? 'selected' : ''}`}
                    onClick={() => setSelectedSize('S')}
                  >
                    TALLA S
                  </button>
                  <button
                    type="button"
                    className={`d2-btn-option ${selectedSize === 'M' ? 'selected' : ''}`}
                    onClick={() => setSelectedSize('M')}
                  >
                    TALLA M
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Order Button via WhatsApp */}
            <a
              href={orderWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d2-main-order-btn"
            >
              <span>ORDENAR VÍA WHATSAPP // {selectedColor} (TALLA {selectedSize})</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <div className="d2-checkout-guarantee">
              ! ORDERS VIA DM @umbral.archive001 & WHATSAPP DIRECTO. EDICIÓN LIMITADA.
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer 100% Consistent with HomePage & Drop01 */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="f-col-brand">
            <div className="f-logo">
              <span>[U]</span>
              <span>UMBRAL®</span>
            </div>
            <p className="f-tagline">OBJECTS FOR THE EVERYDAY.</p>
            <p className="f-desc">{config.manifesto}</p>
          </div>

          <div className="f-col-nav">
            <h4>Colección</h4>
            <Link to="/merchandise/drop-01">Drop 001 Core Tee (3D)</Link>
            <Link to="/merchandise/drop-02">Drop 002 Signature Tee (3D)</Link>
            <Link to="/#drops">Objetos & Accesorios</Link>
          </div>

          <div className="f-col-nav">
            <h4>Marca</h4>
            <Link to="/#manifesto">Concepto de Transición</Link>
            <Link to="/#editorial">Galería Editorial</Link>
            <Link to="/admin">Portal de Gestión [Admin]</Link>
          </div>

          <div className="f-col-nav">
            <h4>Contacto</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram {config.instagramHandle}</a>
            <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp Directo</a>
            <span>{config.shippingInfo}</span>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© {new Date().getFullYear()} UMBRAL®. TODOS LOS DERECHOS RESERVADOS.</span>
          <span>DISEÑADO & FABRICADO EN CARACAS, VENEZUELA</span>
        </div>
      </footer>
    </div>
  );
}
