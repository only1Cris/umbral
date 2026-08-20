import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDropsData, getSiteConfig } from '../data/store';

export default function HomePage() {
  const [drops, setDrops] = useState([]);
  const [config, setConfig] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isFilterFading, setIsFilterFading] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
  const [vipSuccess, setVipSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setDrops(getDropsData());
    setConfig(getSiteConfig());
  }, []);

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setIsFilterFading(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setIsFilterFading(false);
    }, 180);
  };

  const filteredDrops =
    activeCategory === 'ALL'
      ? drops
      : drops.filter((d) => d.category === activeCategory);

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (!vipEmail) return;
    setVipSuccess(true);
    setVipEmail('');
    setTimeout(() => setVipSuccess(false), 5000);
  };

  if (!config) return null;

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <div className="home-wrapper">
      {/* Brand Navigation Header */}
      <header className="home-header">
        <div className="home-nav-container">
          <Link to="/" className="home-brand">
            <span className="brand-bracket">[U]</span>
            <span className="brand-name">UMBRAL</span>
          </Link>

          <nav className="home-nav-desktop">
            <a href="#drops" className="home-nav-item">
              <span>Colección / Drops</span>
            </a>
            <a href="#manifesto" className="home-nav-item">
              <span>Concepto</span>
            </a>
            <a href="#editorial" className="home-nav-item">
              <span>Editorial</span>
            </a>
            <a href="#vip" className="home-nav-item">
              <span>Acceso VIP</span>
            </a>
          </nav>

          <div className="home-nav-right">
            <Link to="/merchandise/drop-01" className="btn-drop-active">
              <span className="pulse-dot"></span>
              <span className="btn-drop-text">DROP 001 3D</span>
            </Link>
            <button
              className="home-menu-toggle"
              aria-label="Abrir menú"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className={`menu-bars ${isMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`home-mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
          <div className="drawer-links">
            <a href="#drops" onClick={() => setIsMenuOpen(false)}>
              <span>01 / Catálogo de Drops</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#manifesto" onClick={() => setIsMenuOpen(false)}>
              <span>02 / Manifesto de Marca</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#editorial" onClick={() => setIsMenuOpen(false)}>
              <span>03 / Galería Editorial</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#vip" onClick={() => setIsMenuOpen(false)}>
              <span>04 / Registro VIP</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <div className="drawer-divider"></div>
            <Link to="/merchandise/drop-01" className="drawer-highlight-link" onClick={() => setIsMenuOpen(false)}>
              <span>★ DROP 001 CORE TEE (3D)</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/admin" className="drawer-admin-link" onClick={() => setIsMenuOpen(false)}>
              <span>⚙ Portal Staff [Admin]</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Portal Section */}
      <section className="home-hero">
        <div className="hero-backdrop">
          {/* Background visual portal simulating cinematic lighting */}
          <div className="hero-portal-visual">
            <div className="portal-frame">
              <div className="portal-monolith"></div>
              <div className="portal-carmine-door"></div>
              <div className="portal-light-beam"></div>
            </div>
          </div>
          <div className="hero-scrim"></div>
        </div>

        <div className="hero-content">
          <div className="hero-status-pill">
            <span className="pill-dot"></span>
            <span>{config.activeDropAnnouncement}</span>
          </div>

          <h1 className="hero-brand-title">
            UMBRAL<span className="brand-trademark">®</span>
          </h1>

          <p className="hero-philosophy">
            OBJECTS FOR THE EVERYDAY.
          </p>

          <div className="hero-manifesto-snippet">
            <span className="quote-bracket">[</span>
            El punto de transición entre un lugar y otro. Un espacio de paso, cambio y nuevas posibilidades.
            <span className="quote-bracket">]</span>
          </div>

          <div className="hero-cta-group">
            <a href="#drops" className="btn-explore-drops">
              <span>EXPLORAR ARCHIVO DE DROPS</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <Link to="/merchandise/drop-01" className="btn-experience-3d">
              <span>VER DROP 001 EN 3D</span>
            </Link>
          </div>
        </div>

        <div className="hero-bottom-bar">
          <div className="meta-cell">
            <span className="meta-lbl">LOCACIÓN</span>
            <span className="meta-val">CARACAS, VE</span>
          </div>
          <div className="meta-cell">
            <span className="meta-lbl">DISCIPLINA</span>
            <span className="meta-val">BRUTALISMO & MODA</span>
          </div>
          <div className="meta-cell">
            <span className="meta-lbl">ESTADO</span>
            <span className="meta-val highlight-red">DROP 001 DISPONIBLE</span>
          </div>
        </div>
      </section>

      {/* Drops Archive & Showroom Section */}
      <section className="home-drops-section" id="drops">
        <div className="section-head-wrap">
          <div className="head-left">
            <span className="sub-tag">[01 // CATÁLOGO & ARCHIVO]</span>
            <h2 className="main-title">RELEASES & DROPS</h2>
          </div>

          <div className="category-filters">
            {['ALL', 'PRENDAS', 'OBJETOS'].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`drops-grid ${isFilterFading ? 'is-fading' : ''}`}>
          {filteredDrops.map((drop) => (
            <div key={drop.id} className={`drop-card ${drop.status.toLowerCase()}`}>
              <div className="card-media-wrap">
                <img
                  src={`${baseUrl}${drop.heroImage}`}
                  alt={drop.title}
                  className="card-img"
                  loading="lazy"
                />
                <div className="card-badge-status">
                  {drop.status === 'ACTIVE' && <span className="status-tag active">DISPONIBLE // ${drop.price} {drop.currency}</span>}
                  {drop.status === 'COMING_SOON' && <span className="status-tag coming">PRÓXIMO DROP</span>}
                  {drop.status === 'SOLD_OUT' && <span className="status-tag sold">SOLD OUT</span>}
                </div>
                <span className="drop-num-watermark">DROP {drop.number}</span>
              </div>

              <div className="card-body">
                <div className="card-header-row">
                  <span className="drop-code">DROP {drop.number} // {drop.category}</span>
                  <span className="drop-price">${drop.price} {drop.currency}</span>
                </div>

                <h3 className="card-title">{drop.title}</h3>
                <p className="card-tagline">{drop.tagline}</p>

                <ul className="card-specs">
                  {drop.specs.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>

                <div className="card-actions">
                  {drop.isInteractive ? (
                    <Link to={drop.route} className="btn-card-primary">
                      <span>EXPERIENCIA 3D COMPLETA</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  ) : (
                    <a
                      href={`https://wa.me/${config.whatsappNumber}?text=Hola%20UMBRAL%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20${encodeURIComponent(drop.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-card-secondary"
                    >
                      <span>RESERVAR ACCESO ANTICIPADO</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Manifesto Section */}
      <section className="home-manifesto-section" id="manifesto">
        <div className="manifesto-inner">
          <div className="manifesto-col-left">
            <span className="sub-tag">[02 // MANIFESTO DE MARCA]</span>
            <h2 className="manifesto-heading">
              LA FILOSOFÍA DEL <br />
              <span className="accent-text">UMBRAL.</span>
            </h2>
            <p className="manifesto-lead">
              No diseñamos prendas convencionales; conceptualizamos objetos de transición para la cotidianidad bajo una estética brutalista e industrial.
            </p>
          </div>

          <div className="manifesto-col-right">
            <div className="pillar-box">
              <span className="pillar-num">01</span>
              <h4>TRANSICIÓN ESPACIAL</h4>
              <p>Inspirados en la arquitectura donde el concreto y el juego de sombras crean un portal entre el exterior y el espacio íntimo.</p>
            </div>
            <div className="pillar-box">
              <span className="pillar-num">02</span>
              <h4>EL ROJO COMO ACENTO</h4>
              <p>El color Carmín Profundo (#C1121F) nunca es protagonista excesivo; actúa con intención milimétrica en detalles y sellos [U].</p>
            </div>
            <div className="pillar-box">
              <span className="pillar-num">03</span>
              <h4>CONSTRUCCIÓN HEAVYWEIGHT</h4>
              <p>Prendas de alto gramaje con costuras reforzadas diseñadas para resistir el tiempo y el uso diario ininterrumpido.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Gallery (Inspired by umbralbrd3) */}
      <section className="home-editorial-section" id="editorial">
        <div className="editorial-head">
          <span className="sub-tag">[03 // CAMPAÑA FOTOGRÁFICA]</span>
          <h2 className="main-title">SOMBRAS, TEXTURA & LUZ NATURAL</h2>
        </div>

        <div className="editorial-mosaic">
          <div className="mosaic-item large">
            <img src={`${baseUrl}/assets/branding/umbralbrd1.jpg`} alt="Umbral Editorial 1" loading="lazy" />
            <div className="mosaic-caption">
              <span>FIGURA & CONCRETO BRUTALISTA</span>
              <span>CARACAS, VE</span>
            </div>
          </div>
          <div className="mosaic-item">
            <img src={`${baseUrl}/assets/branding/umbralbrd3.jpg`} alt="Umbral Editorial 2" loading="lazy" />
            <div className="mosaic-caption">
              <span>ESTILO FOTOGRÁFICO TONAL</span>
              <span>DROP 001</span>
            </div>
          </div>
          <div className="mosaic-item">
            <img src={`${baseUrl}/assets/branding/umbralbrd4.jpg`} alt="Umbral Editorial 3" loading="lazy" />
            <div className="mosaic-caption">
              <span>APLICACIONES & PACKAGING</span>
              <span>OBJECTS FOR THE EVERYDAY</span>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Access Newsletter */}
      <section className="home-vip-section" id="vip">
        <div className="vip-card">
          <span className="sub-tag">[04 // ACCESO ANTICIPADO]</span>
          <h2 className="vip-title">CLUB PRIVADO UMBRAL</h2>
          <p className="vip-desc">
            Sé el primero en acceder a los próximos lanzamientos limitados (Drop 002 & Accesorios) antes de la apertura pública.
          </p>

          {vipSuccess ? (
            <div className="vip-success-box">
              <span>✓ REGISTRO CONFIRMADO. TE NOTIFICAREMOS AL LANZAMIENTO.</span>
            </div>
          ) : (
            <form onSubmit={handleVipSubmit} className="vip-form">
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico..."
                value={vipEmail}
                onChange={(e) => setVipEmail(e.target.value)}
                required
                className="vip-input"
              />
              <button type="submit" className="vip-btn">
                REGISTRARME
              </button>
            </form>
          )}

          <span className="vip-note">
            Sin spam. Solo coordenadas y claves de acceso para drops oficiales.
          </span>
        </div>
      </section>

      {/* Global Footer */}
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
            <a href="#drops">Drop 002 Brutalist Hoodie</a>
            <a href="#drops">Objetos & Accesorios</a>
          </div>

          <div className="f-col-nav">
            <h4>Marca</h4>
            <a href="#manifesto">Concepto de Transición</a>
            <a href="#editorial">Galería Editorial</a>
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
