import { useParams, Navigate } from 'react-router-dom';
import { getTemplateById } from '@/data/templates';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/sections/HeroSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { NeuralFeedSection } from '@/sections/NeuralFeedSection';
import { Footer } from '@/components/Footer';
import { useEffect } from 'react';

export function TemplatePage() {
  const { id } = useParams<{ id: string }>();
  const template = id ? getTemplateById(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!template) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-void min-h-screen">
      <Navigation templateId={template.id} templateName={template.name} />
      <HeroSection template={template} />
      <ServicesSection template={template} />
      <NeuralFeedSection template={template} />
      <Footer />
    </div>
  );
}
