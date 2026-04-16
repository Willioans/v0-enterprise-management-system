'use client';

import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { PanelLayout } from '@/components/PanelLayout';
import { ClientPortal } from '@/components/ClientPortal';
import { Loader2 } from 'lucide-react';

export default function ClientPage() {
  const { canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.CLIENT],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <PanelLayout title="Mi Portal" subtitle="Gestiona tu membresía y compras">
      <ClientPortal />
    </PanelLayout>
  );
}
