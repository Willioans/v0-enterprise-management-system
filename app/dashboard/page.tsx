// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { 
  Crown, 
  Building2, 
  ShoppingCart, 
  Package2, 
  DollarSign, 
  Users, 
  UserCircle 
} from 'lucide-react';

interface PanelCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const panels: PanelCard[] = [
    {
      id: 'super-admin',
      title: 'Super Administrador',
      description: 'Control total de la plataforma y clientes empresariales',
      icon: <Crown className="h-8 w-8" />,
      href: '/panels/super-admin',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'admin',
      title: 'Administrador de Negocio',
      description: 'Gestión completa de tu empresa y sucursales',
      icon: <Building2 className="h-8 w-8" />,
      href: '/panels/admin',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'sales',
      title: 'Punto de Venta',
      description: 'Sistema POS rápido, intuitivo y profesional',
      icon: <ShoppingCart className="h-8 w-8" />,
      href: '/panels/sales',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'inventory',
      title: 'Inventario',
      description: 'Control exhaustivo de stock y movimientos',
      icon: <Package2 className="h-8 w-8" />,
      href: '/panels/inventory',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'finance',
      title: 'Financiero',
      description: 'Caja, bancos, reportes contables y análisis',
      icon: <DollarSign className="h-8 w-8" />,
      href: '/panels/finance',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'hr',
      title: 'Recursos Humanos',
      description: 'Gestión de personal, nómina y asistencias',
      icon: <Users className="h-8 w-8" />,
      href: '/panels/hr',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'customer',
      title: 'Portal del Cliente',
      description: 'Visualización de datos, compras e historial',
      icon: <UserCircle className="h-8 w-8" />,
      href: '/panels/customer',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Bienvenido a H&I System</h1>
          <p className="text-xl text-white/80">
            Hola, {user?.name}. Selecciona el panel que deseas acceder
          </p>
        </div>
      </div>

      {/* Panels Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {panels.map((panel) => (
            <Card
              key={panel.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden"
              onClick={() => router.push(panel.href)}
            >
              <div className={`h-2 bg-gradient-to-r ${panel.color}`}></div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${panel.color} text-white`}>
                    {panel.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{panel.title}</CardTitle>
                <CardDescription className="text-sm">
                  {panel.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(panel.href);
                  }}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Información Rápida</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Paneles Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">4</div>
              <div className="text-sm text-muted-foreground">Módulos Especializados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">13+</div>
              <div className="text-sm text-muted-foreground">Monedas Soportadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Idiomas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
