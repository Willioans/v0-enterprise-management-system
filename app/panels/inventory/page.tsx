'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { InventorySystem } from '@/components/InventorySystem';

export default function InventoryPage() {
  return (
    <PanelLayout
      title="Control de Inventario"
      subtitle="Gestiona tu stock, ubicaciones y movimientos"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Inventario' }]}
    >
      <InventorySystem />
    </PanelLayout>
  );
}
