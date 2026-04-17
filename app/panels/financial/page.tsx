'use client';

import { PanelLayout } from '@/components/PanelLayout';
import { FinancialSystem } from '@/components/FinancialSystem';

export default function FinancialPage() {
  return (
    <PanelLayout
      title="Panel Financiero"
      subtitle="Analisis de ingresos, gastos y rentabilidad"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Financiero' }]}
    >
      <FinancialSystem />
    </PanelLayout>
  );
}
