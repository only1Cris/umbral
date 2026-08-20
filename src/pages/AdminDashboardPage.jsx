import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDropsData, saveDropsData, getSiteConfig, saveSiteConfig } from '../data/store';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [drops, setDrops] = useState([]);
  const [config, setConfig] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('drops'); // 'drops' | 'config'

  useEffect(() => {
    setDrops(getDropsData());
    setConfig(getSiteConfig());
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Clave de acceso administrativa simple para el staff
    if (passcode === 'umbral2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Código de acceso incorrecto. Intenta con: umbral2026');
    }
  };

  const handleDropChange = (id, field, value) => {
    const updated = drops.map((d) => (d.id === id ? { ...d, [field]: value } : d));
    setDrops(updated);
  };

  const handleConfigChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSaveAll = () => {
    saveDropsData(drops);
    saveSiteConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <span className="brand-bracket">[U]</span>
            <h2>PORTAL STAFF UMBRAL®</h2>
            <p>Acceso administrativo para gestión de Drops y Contenido</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label>CLAVE DE SEGURIDAD</label>
              <input
                type="password"
                placeholder="Ingresa la clave..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="admin-input"
              />
            </div>

            {authError && <div className="admin-error-msg">{authError}</div>}

            <button type="submit" className="admin-btn-primary">
              INGRESAR AL PANEL
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/" className="admin-back-link">← Volver al sitio público</Link>
            <span className="hint-text">Clave de demostración: <strong>umbral2026</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Admin Topbar */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="brand-bracket">[U]</span>
          <span>UMBRAL STAFF PANEL</span>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'drops' ? 'active' : ''}`}
            onClick={() => setActiveTab('drops')}
          >
            Gestión de Drops ({drops.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Ajustes & Manifesto
          </button>
        </div>

        <div className="admin-actions">
          {savedSuccess && <span className="save-indicator">✓ CAMBIOS GUARDADOS</span>}
          <button onClick={handleSaveAll} className="btn-save-changes">
            GUARDAR CAMBIOS
          </button>
          <Link to="/" className="btn-view-site" target="_blank">
            Ver Sitio Web ↗
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main-content">
        {activeTab === 'drops' && (
          <div className="admin-section">
            <div className="section-title-row">
              <h3>CATÁLOGO DE LANZAMIENTOS</h3>
              <p>Modifica el estado, precios, nombres y características de cada Drop en vivo.</p>
            </div>

            <div className="admin-drops-list">
              {drops.map((drop) => (
                <div key={drop.id} className="admin-drop-card">
                  <div className="drop-card-top">
                    <span className="badge-drop-num">DROP {drop.number}</span>
                    <div className="status-selector-wrap">
                      <label>ESTADO:</label>
                      <select
                        value={drop.status}
                        onChange={(e) => handleDropChange(drop.id, 'status', e.target.value)}
                        className="admin-select"
                      >
                        <option value="ACTIVE">ACTIVE (Disponible para comprar)</option>
                        <option value="COMING_SOON">COMING SOON (Próximo lanzamiento)</option>
                        <option value="SOLD_OUT">SOLD OUT (Agotado)</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="form-group">
                      <label>TÍTULO DEL DROP</label>
                      <input
                        type="text"
                        value={drop.title}
                        onChange={(e) => handleDropChange(drop.id, 'title', e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>PRECIO (USD)</label>
                      <input
                        type="number"
                        value={drop.price}
                        onChange={(e) => handleDropChange(drop.id, 'price', parseFloat(e.target.value) || 0)}
                        className="admin-input"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>SUBTÍTULO / ESPECIFICACIÓN RÁPIDA</label>
                      <input
                        type="text"
                        value={drop.tagline}
                        onChange={(e) => handleDropChange(drop.id, 'tagline', e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>CATEGORÍA</label>
                      <select
                        value={drop.category}
                        onChange={(e) => handleDropChange(drop.id, 'category', e.target.value)}
                        className="admin-select"
                      >
                        <option value="PRENDAS">PRENDAS</option>
                        <option value="OBJETOS">OBJETOS</option>
                        <option value="ACCESORIOS">ACCESORIOS</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>COLOR OFICIAL</label>
                      <input
                        type="text"
                        value={drop.color}
                        onChange={(e) => handleDropChange(drop.id, 'color', e.target.value)}
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && config && (
          <div className="admin-section">
            <div className="section-title-row">
              <h3>CONFIGURACIÓN GLOBAL DE MARCA</h3>
              <p>Personaliza los textos del Hero, el Manifesto y los canales de venta oficiales.</p>
            </div>

            <div className="admin-config-card">
              <div className="form-group">
                <label>AVISO DE LANZAMIENTO (HERO BADGE)</label>
                <input
                  type="text"
                  value={config.activeDropAnnouncement}
                  onChange={(e) => handleConfigChange('activeDropAnnouncement', e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>SLOGAN OFICIAL</label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => handleConfigChange('tagline', e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>MANIFESTO DE MARCA (FILOSOFÍA DE TRANSICIÓN)</label>
                <textarea
                  rows="4"
                  value={config.manifesto}
                  onChange={(e) => handleConfigChange('manifesto', e.target.value)}
                  className="admin-textarea"
                />
              </div>

              <div className="form-group">
                <label>NÚMERO DE WHATSAPP (CON CÓDIGO DE PAÍS)</label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => handleConfigChange('whatsappNumber', e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>HANDLE DE INSTAGRAM</label>
                <input
                  type="text"
                  value={config.instagramHandle}
                  onChange={(e) => handleConfigChange('instagramHandle', e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>INFORMACIÓN DE ENVÍOS & LOCACIÓN</label>
                <input
                  type="text"
                  value={config.shippingInfo}
                  onChange={(e) => handleConfigChange('shippingInfo', e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
