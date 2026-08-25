'use client';

import React from 'react';

export default function NeuralSitesGuiaPage() {
  return (
    <div className="w-full h-screen min-h-screen bg-[#05070e] text-white overflow-hidden flex flex-col">
      <iframe
        src="/guia.html"
        className="w-full flex-1 border-none min-h-screen"
        title="Guía Interactiva Neural Sites | Tu Web Inteligente Autónoma"
      />
    </div>
  );
}
