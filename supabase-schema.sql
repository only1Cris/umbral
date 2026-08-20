-- Script SQL para inicializar la base de datos de UMBRAL en Supabase

-- 1. Tabla de Drops
CREATE TABLE IF NOT EXISTS drops (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  category TEXT DEFAULT 'PRENDAS',
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMING_SOON', 'SOLD_OUT'
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  color TEXT,
  origin TEXT DEFAULT 'Caracas, VE',
  specs JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '["S","M","L","XL"]'::jsonb,
  hero_image TEXT,
  route TEXT,
  is_interactive BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Configuración Global de Marca
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  brand_name TEXT DEFAULT 'UMBRAL®',
  tagline TEXT DEFAULT 'OBJECTS FOR THE EVERYDAY.',
  manifesto TEXT,
  active_drop_announcement TEXT,
  whatsapp_number TEXT,
  instagram_handle TEXT,
  shipping_info TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- 4. Políticas: Lectura pública para cualquier visitante de la web
CREATE POLICY "Public Read Drops" ON drops FOR SELECT USING (true);
CREATE POLICY "Public Read Config" ON site_config FOR SELECT USING (true);

-- 5. Políticas: Escritura / Actualización (para el panel admin)
CREATE POLICY "Allow Insert Drops" ON drops FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update Drops" ON drops FOR UPDATE USING (true);
CREATE POLICY "Allow Update Config" ON site_config FOR UPDATE USING (true);

-- 6. Insertar datos iniciales
INSERT INTO drops (id, number, title, tagline, category, status, price, currency, color, origin, specs, sizes, hero_image, route, is_interactive)
VALUES 
('drop-01', '001', 'CORE TEE', 'HEAVYWEIGHT COTTON // 240 GSM', 'PRENDAS', 'ACTIVE', 25, 'USD', 'Near Black (#0A0A0A)', 'Caracas, VE', '["240 GSM Algodón Peinado", "Rib Collar 3.2 cm", "Silueta Boxy Oversize"]', '["S","M","L","XL"]', '/assets/branding/1.webp', '/merchandise/drop-01', true),
('drop-02', '002', 'BRUTALIST HOODIE', 'FRENCH TERRY 460 GSM // DOUBLE LAYER HOOD', 'PRENDAS', 'COMING_SOON', 45, 'USD', 'Concrete Gray (#6B6B68)', 'Caracas, VE', '["460 GSM French Terry", "Corte Arquitectónico", "Bolsillo Oculto Invisible"]', '["M","L","XL"]', '/assets/branding/2.webp', '/merchandise/drop-02', false),
('drop-03', '003', 'ARCHITECTURAL TOTE & CAPSULE', 'BALLISTIC NYLON // EVERYDAY OBJECT', 'OBJETOS', 'COMING_SOON', 20, 'USD', 'Matte Black / Carmine Accent', 'Caracas, VE', '["Nylon Balístico Impermeable", "Herrajes Metálicos Mate", "Capacidad 18 Litros"]', '["ONE SIZE"]', '/assets/branding/3.webp', '#', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO site_config (id, brand_name, tagline, manifesto, active_drop_announcement, whatsapp_number, instagram_handle, shipping_info)
VALUES (
  'global_config',
  'UMBRAL®',
  'OBJECTS FOR THE EVERYDAY.',
  'UMBRAL representa el punto de transición entre un lugar y otro. Un espacio de paso, cambio y nuevas posibilidades donde la arquitectura brutalista, las sombras y el minimalismo textil convergen.',
  'FIRST OFFICIAL RELEASE / DROP 001 ACTIVE NOW',
  '584120000000',
  '@umbral.brand',
  'CARACAS, VENEZUELA • ENVIOS A TODO EL PAÍS'
)
ON CONFLICT (id) DO NOTHING;
