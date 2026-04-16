// app/panels/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { PanelLayout } from '@/components/PanelLayout';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/lib/auth/AuthContext';
import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, Users, Package2, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {
  const { user, canAccess, isLoading } = useProtectedRoute({
    requiredRoles: [UserRole.ADMIN],
  });

  const [stats, setStats] = useState({
    branches: 0,
    employees: 0,
    products: 0,
    monthlySales: 0,
  });

  useEffect(() => {
    if (canAccess) {
      // Load organization data
      setStats({
        branches: 2,
        employees: 15,
        products: 240,
        monthlySales: 45000,
      });
    }
  }, [canAccess]);

  if (isLoading || !canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PanelLayout
      title="Administrador de Negocio"
      description="Gestión completa de tu empresa, sucursales y operaciones"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin Negocio' }]}
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Sucursales"
          value={stats.branches}
          icon={<Building2 className="h-5 w-5" />}
          description="Activas"
        />
        <StatCard
          title="Empleados"
          value={stats.employees}
          icon={<Users className="h-5 w-5" />}
          description="En plantilla"
        />
        <StatCard
          title="Productos"
          value={stats.products}
          icon={<Package2 className="h-5 w-5" />}
          description="En stock"
        />
        <StatCard
          title="Ventas del Mes"
          value={`$${stats.monthlySales.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12, direction: 'up' }}
        />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="sucursales">Sucursales</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tareas Pendientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Revisar inventario bajo</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Procesar nómina mensual</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Enviar reportes al contador</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  Crear Nueva Venta
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Agregar Producto
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Registrar Gasto
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Ver Reportes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branches Tab */}
        <TabsContent value="sucursales" className="space-y-4">
          <Button className="mb-4">Agregar Nueva Sucursal</Button>
          <Card>
            <CardHeader>
              <CardTitle>Mis Sucursales</CardTitle>
              <CardDescription>Gestiona todas tus sucursales aquí</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Sucursal Principal</h4>
                    <p className="text-sm text-muted-foreground">Av. Principal 123, Ciudad</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Sucursal Centro</h4>
                    <p className="text-sm text-muted-foreground">Calle Centro 456, Ciudad</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="empleados" className="space-y-4">
          <Button className="mb-4">Agregar Nuevo Empleado</Button>
          <Card>
            <CardHeader>
              <CardTitle>Equipo de Trabajo</CardTitle>
              <CardDescription>Gestiona tu personal aquí</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Carlos Rodríguez</h4>
                    <p className="text-sm text-muted-foreground">Gerente de Ventas</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Perfil
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">María García</h4>
                    <p className="text-sm text-muted-foreground">Cajera</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Perfil
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Juan López</h4>
                    <p className="text-sm text-muted-foreground">Jefe de Inventario</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reportes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
              <CardDescription>Descarga reportes y análisis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Reporte de Ventas</h4>
                  <p className="text-sm text-muted-foreground">Ventas mensual y anual</p>
                </div>
                <Button variant="outline" size="sm">
                  Descargar
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Reporte Financiero</h4>
                  <p className="text-sm text-muted-foreground">Balance y estado de resultados</p>
                </div>
                <Button variant="outline" size="sm">
                  Descargar
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Reporte de Inventario</h4>
                  <p className="text-sm text-muted-foreground">Stock actual y movimientos</p>
                </div>
                <Button variant="outline" size="sm">
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PanelLayout>
  );
}
