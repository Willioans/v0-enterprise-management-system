'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { StoreModule } from '@/components/modules/StoreModule';

export default function StoreModulePage() {
  return (
    <PanelLayout title="Módulo Tienda" subtitle="Gestión de tu tienda de ropa y accesorios">
      <StoreModule />
    </PanelLayout>
  );
}
