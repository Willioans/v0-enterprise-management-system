// app/panels/super-admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PanelLayout } from '@/components/PanelLayout';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building2, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { OrganizationService } from '@/lib/services/organizationService';
import { Organization } from '@/lib/schemas';

export default function SuperAdminPage() {
  const { canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.SUPER_ADMIN],
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // In production, you'd fetch real data from Firestore
        // For now, we'll show placeholder data
        setStats({
          totalOrgs: 156,
          totalUsers: 2840,
          monthlyRevenue: 125000,
          activeSubscriptions: 142,
        });
        setOrganizations([]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (canAccess) {
      loadData();
    }
  }, [canAccess]);

  if (isLoading || !canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const orgColumns = [
    {
      key: 'name' as const,
      label: 'Nombre',
    },
    {
      key: 'industry' as const,
      label: 'Industria',
    },
    {
      key: 'country' as const,
      label: 'País',
    },
    {
      key: 'subscriptionLevel' as const,
      label: 'Suscripción',
      render: (value: any) => (
        <span className="px-2 py-1 rounded-full text-sm bg-accent/20 text-accent capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'usersCount' as const,
      label: 'Usuarios',
    },
  ];

  return (
    <PanelLayout
      title="Panel Super Administrador"
      description="Control total de la plataforma H&I System"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Super Admin' }]}
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Organizaciones Activas"
          value={stats.totalOrgs}
          icon={<Building2 className="h-5 w-5" />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Usuarios Totales"
          value={stats.totalUsers}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatCard
          title="Ingresos Mensuales"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 15, direction: 'up' }}
        />
        <StatCard
          title="Suscripciones Activas"
          value={stats.activeSubscriptions}
          icon={<AlertCircle className="h-5 w-5" />}
          trend={{ value: 5, direction: 'up' }}
        />
      </div>

      {/* Alerts & Notifications */}
      <Card className="mb-8 border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • 3 organizaciones próximas a vencer su suscripción en 7 días
            </p>
            <p className="text-sm text-muted-foreground">
              • 2 intentos de acceso fallido detectados
            </p>
            <p className="text-sm text-muted-foreground">
              • 1 reporte de error crítico pendiente de revisión
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <DataTable
        title="Organizaciones"
        columns={orgColumns}
        data={organizations}
        rowKey="id"
        pageSize={10}
      />

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Última actualización hace 2 minutos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Firestore</span>
              <span className="text-sm font-semibold text-green-600">Óptimo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Storage</span>
              <span className="text-sm font-semibold text-green-600">Óptimo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Authentication</span>
              <span className="text-sm font-semibold text-green-600">Óptimo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">API Gateway</span>
              <span className="text-sm font-semibold text-green-600">Óptimo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Administración general</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
              <p className="text-sm font-medium">Crear Nueva Organización</p>
            </div>
            <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
              <p className="text-sm font-medium">Ver Reportes de Sistema</p>
            </div>
            <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
              <p className="text-sm font-medium">Gestionar Suscripciones</p>
            </div>
            <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
              <p className="text-sm font-medium">Ver Logs de Auditoría</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}
