'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { POSSystem } from '@/components/POSSystem';

export default function POSPage() {
  return (
    <PanelLayout
      title="Punto de Venta"
      subtitle="Ventas rapidas, carrito inteligente y multiples metodos de pago"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Punto de Venta' }]}
    >
      <POSSystem />
    </PanelLayout>
  );
}
