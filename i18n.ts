import {getRequestConfig} from 'next-intl/server';

const locales = ['es', 'en'];
 
export default getRequestConfig(async ({locale}) => {
  // Puente de Resiliencia: Validamos que el idioma exista en nuestra red Neural Nexus
  // Si el locale es undefined o inválido, forzamos la carga del español por defecto
  const validLocale = locales.includes(locale as string) ? (locale as string) : 'es';

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
