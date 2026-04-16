// app/panels/super-admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PanelLayout } from '@/components/PanelLayout';
import { SuperAdminStats } from '@/components/SuperAdminStats';
import { CompanyApprovalManager } from '@/components/CompanyApprovalManager';
import { CompanyListManager } from '@/components/CompanyListManager';
import { useAuth } from '@/lib/auth/AuthContext';
import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { companyManagementService, Company } from '@/lib/services/companyManagementService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SuperAdminPage() {
  const { canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.SUPER_ADMIN],
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    pendingApprovals: 0,
    suspendedCompanies: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allCompanies = await companyManagementService.getAllCompanies('super-admin');
        
        setCompanies(allCompanies);
        
        const pending = allCompanies.filter((c) => c.status === 'pending');
        setPendingCompanies(pending);

        const active = allCompanies.filter((c) => c.status === 'approved');
        const suspended = allCompanies.filter((c) => c.status === 'suspended');

        setStats({
          totalCompanies: allCompanies.length,
          activeCompanies: active.length,
          pendingApprovals: pending.length,
          suspendedCompanies: suspended.length,
          monthlyRevenue: active.reduce((sum, c) => sum + 299, 0),
          totalUsers: active.reduce((sum, c) => sum + c.subscription.maxUsers, 0),
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (canAccess) {
      loadData();
    }
  }, [canAccess, refreshKey]);

  if (isLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  const chartData = [
    { name: 'Ene', empresas: 45 },
    { name: 'Feb', empresas: 52 },
    { name: 'Mar', empresas: 58 },
    { name: 'Abr', empresas: 65 },
    { name: 'May', empresas: 78 },
    { name: 'Jun', empresas: 89 },
  ];

  return (
    <PanelLayout title="Panel del Creador - Control Total" subtitle="Gestiona todas las empresas y suscripciones">
      <div className="space-y-8">
        {/* Stats Overview */}
        <SuperAdminStats
          totalCompanies={stats.totalCompanies}
          activeCompanies={stats.activeCompanies}
          pendingApprovals={stats.pendingApprovals}
          suspendedCompanies={stats.suspendedCompanies}
          monthlyRevenue={stats.monthlyRevenue}
          totalUsers={stats.totalUsers}
        />

        {/* Tabs for different sections */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Solicitudes Pendientes
              {stats.pendingApprovals > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="companies">Gestión de Empresas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <CompanyApprovalManager
              pendingCompanies={pendingCompanies}
              onApprovalComplete={() => setRefreshKey((k) => k + 1)}
            />
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <CompanyListManager
              companies={companies}
              onActionComplete={() => setRefreshKey((k) => k + 1)}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de Empresas</CardTitle>
                <CardDescription>Nuevas empresas aprobadas por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="empresas" fill="#1a1f36" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Planes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Basic</span>
                      <Badge>{Math.round(stats.activeCompanies * 0.4)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Professional</span>
                      <Badge variant="secondary">{Math.round(stats.activeCompanies * 0.4)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Enterprise</span>
                      <Badge variant="outline">{Math.round(stats.activeCompanies * 0.2)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Módulos Más Usados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tiendas</span>
                      <Badge>{Math.round(stats.activeCompanies * 0.35)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gimnasios</span>
                      <Badge variant="secondary">{Math.round(stats.activeCompanies * 0.28)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Restaurantes</span>
                      <Badge variant="outline">{Math.round(stats.activeCompanies * 0.22)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Repuestos</span>
                      <Badge variant="secondary">{Math.round(stats.activeCompanies * 0.15)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PanelLayout>
  );
}
