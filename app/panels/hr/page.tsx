'use client';

import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { PanelLayout } from '@/components/PanelLayout';
import { HRSystem } from '@/components/HRSystem';
import { Loader2 } from 'lucide-react';

export default function HRPage() {
  const { canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.HR],
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
    <PanelLayout title="Panel de RRHH" subtitle="Gestión de personal, asistencia y nómina">
      <HRSystem />
    </PanelLayout>
  );
}
