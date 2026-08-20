import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const initialDropsData = [
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
    heroImage: '/assets/branding/1.webp',
    route: '/merchandise/drop-01',
    isInteractive: true,
  },
  {
    id: 'drop-02',
    number: '002',
    title: 'BRUTALIST HOODIE',
    tagline: 'FRENCH TERRY 460 GSM // DOUBLE LAYER HOOD',
    category: 'PRENDAS',
    status: 'COMING_SOON',
    price: 45,
    currency: 'USD',
    color: 'Concrete Gray (#6B6B68)',
    origin: 'Caracas, VE',
    specs: ['460 GSM French Terry', 'Corte Arquitectónico', 'Bolsillo Oculto Invisible'],
    sizes: ['M', 'L', 'XL'],
    heroImage: '/assets/branding/hoodie-drop2.webp',
    route: '/merchandise/drop-02',
    isInteractive: false,
  },
  {
    id: 'drop-03',
    number: '003',
    title: 'ARCHITECTURAL TOTE & CAPSULE',
    tagline: 'BALLISTIC NYLON // EVERYDAY OBJECT',
    category: 'OBJETOS',
    status: 'COMING_SOON',
    price: 20,
    currency: 'USD',
    color: 'Matte Black / Carmine Accent',
    origin: 'Caracas, VE',
    specs: ['Nylon Balístico Impermeable', 'Herrajes Metálicos Mate', 'Capacidad 18 Litros'],
    sizes: ['ONE SIZE'],
    heroImage: '/assets/branding/tote-drop3.webp',
    route: '#',
    isInteractive: false,
  },
];

export const initialSiteConfig = {
  brandName: 'UMBRAL®',
  tagline: 'OBJECTS FOR THE EVERYDAY.',
  manifesto:
    'UMBRAL representa el punto de transición entre un lugar y otro. Un espacio de paso, cambio y nuevas posibilidades donde la arquitectura brutalista, las sombras y el minimalismo textil convergen.',
  activeDropAnnouncement: 'FIRST OFFICIAL RELEASE / DROP 001 ACTIVE NOW',
  whatsappNumber: '584120000000',
  instagramHandle: '@umbral.brand',
  shippingInfo: 'CARACAS, VENEZUELA • ENVIOS A TODO EL PAÍS',
};

const DROPS_STORAGE_KEY = 'umbral_drops_data';
const CONFIG_STORAGE_KEY = 'umbral_site_config';

export async function fetchDropsData() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('drops').select('*').order('number', { ascending: true });
      if (!error && data && data.length > 0) {
        const formatted = data.map((d) => ({
          ...d,
          heroImage: d.hero_image || d.heroImage,
          isInteractive: d.is_interactive ?? d.isInteractive,
        }));
        saveDropsData(formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase fetch error, fallback to local:', err);
    }
  }
  return getDropsData();
}

export function getDropsData() {
  if (typeof window === 'undefined') return initialDropsData;
  const saved = localStorage.getItem(DROPS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialDropsData;
    }
  }
  return initialDropsData;
}

export async function saveDropsData(drops) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DROPS_STORAGE_KEY, JSON.stringify(drops));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      for (const d of drops) {
        await supabase.from('drops').upsert({
          id: d.id,
          number: d.number,
          title: d.title,
          tagline: d.tagline,
          category: d.category,
          status: d.status,
          price: d.price,
          currency: d.currency,
          color: d.color,
          origin: d.origin,
          specs: d.specs,
          sizes: d.sizes,
          hero_image: d.heroImage,
          route: d.route,
          is_interactive: d.isInteractive,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Error syncing drops to Supabase:', err);
    }
  }
}

export async function fetchSiteConfig() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('site_config').select('*').eq('id', 'global_config').single();
      if (!error && data) {
        const formatted = {
          brandName: data.brand_name || data.brandName,
          tagline: data.tagline,
          manifesto: data.manifesto,
          activeDropAnnouncement: data.active_drop_announcement || data.activeDropAnnouncement,
          whatsappNumber: data.whatsapp_number || data.whatsappNumber,
          instagramHandle: data.instagram_handle || data.instagramHandle,
          shippingInfo: data.shipping_info || data.shippingInfo,
        };
        saveSiteConfig(formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase config fetch error, fallback to local:', err);
    }
  }
  return getSiteConfig();
}

export function getSiteConfig() {
  if (typeof window === 'undefined') return initialSiteConfig;
  const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialSiteConfig;
    }
  }
  return initialSiteConfig;
}

export async function saveSiteConfig(config) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('site_config').upsert({
        id: 'global_config',
        brand_name: config.brandName,
        tagline: config.tagline,
        manifesto: config.manifesto,
        active_drop_announcement: config.activeDropAnnouncement,
        whatsapp_number: config.whatsappNumber,
        instagram_handle: config.instagramHandle,
        shipping_info: config.shippingInfo,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error syncing config to Supabase:', err);
    }
  }
}
