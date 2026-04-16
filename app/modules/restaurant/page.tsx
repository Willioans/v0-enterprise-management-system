'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { RestaurantModule } from '@/components/modules/RestaurantModule';

export default function RestaurantModulePage() {
  return (
    <PanelLayout title="Módulo Restaurante" subtitle="Control digital de tu negocio gastronómico">
      <RestaurantModule />
    </PanelLayout>
  );
}
