'use client';

import { StatCard } from '@/components/StatCard';
import { Building2, CheckCircle2, Clock, AlertCircle, DollarSign, Users } from 'lucide-react';

interface SuperAdminStatsProps {
  totalCompanies: number;
  activeCompanies: number;
  pendingApprovals: number;
  suspendedCompanies: number;
  monthlyRevenue: number;
  totalUsers: number;
}

export function SuperAdminStats(props: SuperAdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Empresas"
        value={props.totalCompanies}
        icon={<Building2 className="h-5 w-5" />}
        trend={{ value: 12, direction: 'up' }}
      />
      <StatCard
        title="Empresas Activas"
        value={props.activeCompanies}
        icon={<CheckCircle2 className="h-5 w-5" />}
        trend={{ value: 8, direction: 'up' }}
      />
      <StatCard
        title="Aprobaciones Pendientes"
        value={props.pendingApprovals}
        icon={<Clock className="h-5 w-5" />}
      />
      <StatCard
        title="Empresas Suspendidas"
        value={props.suspendedCompanies}
        icon={<AlertCircle className="h-5 w-5" />}
      />
      <StatCard
        title="Ingresos Mensuales"
        value={`$${props.monthlyRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: 15, direction: 'up' }}
      />
      <StatCard
        title="Usuarios Totales"
        value={props.totalUsers}
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 5, direction: 'up' }}
      />
    </div>
  );
}
