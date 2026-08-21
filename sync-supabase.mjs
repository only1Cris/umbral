import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Leer .env directamente
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach((line) => {
  const [k, ...v] = line.split('=');
  if (k && v) {
    const key = k.trim();
    const val = v.join('=').trim();
    if (key === 'VITE_SUPABASE_URL') supabaseUrl = val;
    if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = val;
  }
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newDropsData = [
  {
    id: 'drop-01',
    number: '001',
    title: 'CORE TEE',
    tagline: 'HEAVYWEIGHT COTTON // 240 GSM',
    category: 'PRENDAS',
    status: 'ACTIVE',
    price: 25,
    currency: 'USD',
    color: 'Near Black (#0A0A0A)',
    origin: 'Caracas, VE',
    specs: ['240 GSM Algodón Peinado', 'Rib Collar 3.2 cm', 'Silueta Boxy Oversize'],
    sizes: ['S', 'M', 'L', 'XL'],
    hero_image: '/assets/drop01/core-hero.webp',
    route: '/merchandise/drop-01',
    is_interactive: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'drop-02',
    number: '002',
    title: 'SIGNATURE TEE [U]',
    tagline: 'OVERSIZE FIT // 80% ALGODÓN 20% POLIÉSTER JERSEY 30.1',
    category: 'PRENDAS',
    status: 'ACTIVE',
    price: 25,
    currency: 'USD',
    color: 'Pure White & Deep Black',
    origin: 'Caracas, VE',
    specs: [
      'Cuello Rib Grueso de Alta Densidad',
      'Estampado TPU Relieve Acabado Mate (4.5 - 5 cm)',
      '80% Algodón / 20% Poliéster Jersey 30.1',
      'Corte Boxy Oversize Arquitectónico'
    ],
    sizes: ['S', 'M'],
    hero_image: '/assets/drop02/white-hero.webp',
    route: '/merchandise/drop-02',
    is_interactive: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'drop-03',
    number: '003',
    title: 'COMING SOON',
    tagline: 'COMING SOON // EVERYDAY OBJECT',
    category: 'OBJETOS',
    status: 'COMING_SOON',
    price: 0,
    currency: 'USD',
    color: 'Matte Black / Carmine Accent',
    origin: 'Caracas, VE',
    specs: ['Nylon Balístico Impermeable', 'Herrajes Metálicos Mate', 'Capacidad 18 Litros'],
    sizes: ['ONE SIZE'],
    hero_image: '/assets/branding/tote-drop3.webp',
    route: '/#drops',
    is_interactive: false,
    updated_at: new Date().toISOString(),
  },
];

async function syncToSupabase() {
  console.log('Connecting and syncing to Supabase:', supabaseUrl);
  for (const d of newDropsData) {
    const { error } = await supabase.from('drops').upsert(d);
    if (error) {
      console.error(`Error updating ${d.id}:`, error.message);
    } else {
      console.log(`✓ Updated ${d.id} (${d.title}) in Supabase successfully!`);
    }
  }
}

syncToSupabase();
