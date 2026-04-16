'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { ModulesShowcase } from '@/components/ModulesShowcase';

export default function ModulesPage() {
  return (
    <PanelLayout title="Módulos Especializados" subtitle="Soluciones por rubro de negocio">
      <ModulesShowcase />
    </PanelLayout>
  );
}
