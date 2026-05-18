import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://neural-nexus-inky.vercel.app';
  const lastModified = new Date();

  // Listado de rutas estáticas principales en español e inglés
  const routes = [
    '',
    '/es',
    '/en',
    '/es/neural-sites',
    '/en/neural-sites',
    '/es/legal/terminos',
    '/en/legal/terminos',
    '/es/legal/eliminacion-de-datos',
    '/en/legal/eliminacion-de-datos',
    '/es/login',
    '/en/login',
    '/es/registro',
    '/en/registro',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route.includes('legal') ? 'monthly' : 'daily',
    priority: route === '' || route === '/es' ? 1.0 : route.includes('legal') ? 0.4 : 0.8,
  }));
}
