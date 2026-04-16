'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';

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
        label="Total Empresas"
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
