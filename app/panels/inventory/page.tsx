'use client';

import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { PanelLayout } from '@/components/PanelLayout';
import { InventorySystem } from '@/components/InventorySystem';
import { Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const { canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.INVENTORY],
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
    <PanelLayout title="Control de Inventario" subtitle="Gestiona tu stock y ubicaciones">
      <InventorySystem />
    </PanelLayout>
  );
}
