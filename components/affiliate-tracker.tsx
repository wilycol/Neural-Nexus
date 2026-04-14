'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function AffiliateTracker() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      console.log('--- NEURAL NEXUS AFFILIATE DETECTED ---');
      console.log('Code:', ref);
      localStorage.setItem('neural_nexus_ref', ref);
    }
  }, [searchParams]);

  return null; // Componente invisible de rastreo
}
