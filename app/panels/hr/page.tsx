'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { HRSystem } from '@/components/HRSystem';

export default function HRPage() {
  return (
    <PanelLayout
      title="Recursos Humanos"
      subtitle="Gestion de personal, asistencias y nomina"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'RRHH' }]}
    >
      <HRSystem />
    </PanelLayout>
  );
}
