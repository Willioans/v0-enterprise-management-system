'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { ClientPortal } from '@/components/ClientPortal';

export default function ClientPage() {
  return (
    <PanelLayout
      title="Mi Portal"
      subtitle="Gestiona tu membresia, pedidos y beneficios"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Portal Cliente' }]}
    >
      <ClientPortal />
    </PanelLayout>
  );
}
