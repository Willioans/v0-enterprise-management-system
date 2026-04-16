'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export function SuperAdminStats({
  totalCompanies,
  activeCompanies,
  pendingApprovals,
  suspendedCompanies,
  monthlyRevenue,
  totalUsers,
}: SuperAdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Empresas"
        value={totalCompanies}
        icon={<Building2 className="h-5 w-5" />}
        trend={{ value: 12, direction: 'up' }}
      />
      <StatCard
        title="Empresas Activas"
        value={activeCompanies}
        icon={<CheckCircle2 className="h-5 w-5" />}
        trend={{ value: 8, direction: 'up' }}
      />
      <StatCard
        title="Aprobaciones Pendientes"
        value={pendingApprovals}
        icon={<Clock className="h-5 w-5" />}
      />
      <StatCard
        title="Empresas Suspendidas"
        value={suspendedCompanies}
        icon={<AlertCircle className="h-5 w-5" />}
      />
      <StatCard
        title="Ingresos Mensuales"
        value={`$${monthlyRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: 15, direction: 'up' }}
      />
      <StatCard
        title="Usuarios Totales"
        value={totalUsers}
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 5, direction: 'up' }}
      />
    </div>
  );
}
        value={props.totalCompanies}
        change="+12%"
        icon="building2"
        trend="up"
      />
      <StatCard
        label="Empresas Activas"
        value={props.activeCompanies}
        change="+8%"
        icon="check-circle"
        trend="up"
      />
      <StatCard
        label="Pendientes de Aprobación"
        value={props.pendingApprovals}
        change="Nueva solicitud"
        icon="clock"
        trend="neutral"
      />
      <StatCard
        label="Empresas Suspendidas"
        value={props.suspendedCompanies}
        change="-2%"
        icon="alert-circle"
        trend="down"
      />
      <StatCard
        label="Ingresos del Mes"
        value={`$${props.monthlyRevenue.toLocaleString()}`}
        change="+15%"
        icon="trending-up"
        trend="up"
      />
      <StatCard
        label="Usuarios Totales"
        value={props.totalUsers}
        change="+25%"
        icon="users"
        trend="up"
      />
    </div>
  );
}
