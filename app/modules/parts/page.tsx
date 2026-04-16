'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { PartsModule } from '@/components/modules/PartsModule';

export default function PartsModulePage() {
  return (
    <PanelLayout title="Módulo Repuestos" subtitle="Catálogo y gestión de repuestos para motos y autos">
      <PartsModule />
    </PanelLayout>
  );
}
