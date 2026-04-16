'use client';

import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { PanelLayout } from '@/components/PanelLayout';
import { POSSystem } from '@/components/POSSystem';
import { Loader2 } from 'lucide-react';

export default function POSPage() {
  const { canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.POS],
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
    <PanelLayout title="Punto de Venta (POS)" subtitle="Gestiona ventas en tiempo real">
      <POSSystem />
    </PanelLayout>
  );
}
