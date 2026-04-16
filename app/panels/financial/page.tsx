'use client';

import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { PanelLayout } from '@/components/PanelLayout';
import { FinancialSystem } from '@/components/FinancialSystem';
import { Loader2 } from 'lucide-react';

export default function FinancialPage() {
  const { canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.FINANCIAL],
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
    <PanelLayout title="Panel Financiero" subtitle="Análisis de ingresos, gastos y rentabilidad">
      <FinancialSystem />
    </PanelLayout>
  );
}
