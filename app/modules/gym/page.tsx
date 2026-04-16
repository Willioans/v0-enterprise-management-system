'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { GymModule } from '@/components/modules/GymModule';

export default function GymModulePage() {
  return (
    <PanelLayout title="Módulo Gimnasio" subtitle="Gestión integral de tu gimnasio">
      <GymModule />
    </PanelLayout>
  );
}
