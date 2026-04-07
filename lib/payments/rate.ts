// 💱 Proveedor de Tasa de Cambio (USD -> COP)
// Este servicio consulta la TRM para mostrar el precio exacto en Pesos Colombianos.

export interface ExchangeRate {
  rate: number;
  lastUpdate: string;
}

const FALLBACK_RATE = 4000; // Valor de seguridad si falla la API

export async function getUSDToCOP(): Promise<ExchangeRate> {
  try {
    // Usamos una API gratuita de tipos de cambio (ej. ExchangeRate-API o similar)
    // Para entornos de producción, se recomienda una llave de API paga o un proveedor oficial de la Superfinanciera.
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 } // Caché de 1 hora
    });
    
    const data = await res.json();
    
    if (data && data.rates && data.rates.COP) {
      return {
        rate: data.rates.COP,
        lastUpdate: new Date().toISOString()
      };
    }
    
    return { rate: FALLBACK_RATE, lastUpdate: new Date().toISOString() };
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return { rate: FALLBACK_RATE, lastUpdate: new Date().toISOString() };
  }
}

export function formatCOP(usd: number, rate: number): string {
  const cop = usd * rate;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(cop);
}
