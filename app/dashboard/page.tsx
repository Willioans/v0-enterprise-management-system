'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, Building2, ShoppingCart, Package2, DollarSign, Users, UserCircle, Dumbbell, UtensilsCrossed, ShoppingBag, Wrench, LogOut, Bell, Settings, ChevronRight } from 'lucide-react';
import { AuthService } from '@/lib/auth/authService';

const panels = [
  {
    id: 'super-admin',
    title: 'Super Admin',
    subtitle: 'Control Total',
    description: 'Gestión global de la plataforma, empresas y suscripciones',
    icon: Crown,
    href: '/panels/super-admin',
    bg: 'bg-[#0f1629]',
    accent: 'bg-[#c9a84c]',
    badge: 'MAESTRO',
  },
  {
    id: 'admin',
    title: 'Administrador',
    subtitle: 'Tu Empresa',
    description: 'Gestión completa de sucursales, usuarios y configuraciones',
    icon: Building2,
    href: '/panels/admin',
    bg: 'bg-slate-800',
    accent: 'bg-blue-500',
    badge: 'NEGOCIO',
  },
  {
    id: 'pos',
    title: 'Punto de Venta',
    subtitle: 'POS Táctil',
    description: 'Ventas rápidas, carrito inteligente y múltiples métodos de pago',
    icon: ShoppingCart,
    href: '/panels/pos',
    bg: 'bg-emerald-800',
    accent: 'bg-emerald-400',
    badge: 'VENTAS',
  },
  {
    id: 'inventory',
    title: 'Inventario',
    subtitle: 'Control de Stock',
    description: 'Productos, existencias, alertas de stock y movimientos',
    icon: Package2,
    href: '/panels/inventory',
    bg: 'bg-amber-800',
    accent: 'bg-amber-400',
    badge: 'STOCK',
  },
  {
    id: 'financial',
    title: 'Financiero',
    subtitle: 'Contabilidad',
    description: 'Ingresos, gastos, caja diaria y reportes contables',
    icon: DollarSign,
    href: '/panels/financial',
    bg: 'bg-violet-800',
    accent: 'bg-violet-400',
    badge: 'FINANZAS',
  },
  {
    id: 'hr',
    title: 'Recursos Humanos',
    subtitle: 'Personal',
    description: 'Empleados, nómina, asistencias y evaluaciones',
    icon: Users,
    href: '/panels/hr',
    bg: 'bg-rose-800',
    accent: 'bg-rose-400',
    badge: 'RRHH',
  },
  {
    id: 'client',
    title: 'Portal Cliente',
    subtitle: 'Mi Cuenta',
    description: 'Historial de compras, membresías y datos personales',
    icon: UserCircle,
    href: '/panels/client',
    bg: 'bg-cyan-800',
    accent: 'bg-cyan-400',
    badge: 'CLIENTE',
  },
];

const modules = [
  { id: 'gym', title: 'Gimnasio', icon: Dumbbell, href: '/modules/gym', color: 'text-orange-500', desc: 'Membresías, rutinas y control de acceso biométrico' },
  { id: 'restaurant', title: 'Restaurante', icon: UtensilsCrossed, href: '/modules/restaurant', color: 'text-red-500', desc: 'Comandera digital, mesas y delivery' },
  { id: 'store', title: 'Tienda', icon: ShoppingBag, href: '/modules/store', color: 'text-pink-500', desc: 'Control de tallas, colores y variantes de productos' },
  { id: 'parts', title: 'Repuestos', icon: Wrench, href: '/modules/parts', color: 'text-blue-500', desc: 'Búsqueda inteligente por marca, modelo y año' },
];

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

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-[#0f1629] text-white sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c9a84c] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">H&I System</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-white/20 mx-1" />
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 bg-[#c9a84c] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <span className="text-sm text-white/80 hidden sm:block">{user?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/70 hover:text-white hover:bg-white/10 ml-1">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Hola, <span className="text-[#0f1629]">{user?.name ?? 'Usuario'}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Selecciona el panel o módulo que deseas gestionar</p>
        </div>

        {/* Panels Grid */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Paneles de Acceso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {panels.map((panel) => {
              const Icon = panel.icon;
              return (
                <button
                  key={panel.id}
                  onClick={() => router.push(panel.href)}
                  className={`${panel.bg} text-white rounded-2xl p-5 text-left hover:opacity-90 active:scale-[0.98] transition-all duration-150 group relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-10 h-10 ${panel.accent} bg-opacity-20 rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-white/15 text-white text-[10px] border-0 hover:bg-white/20">
                      {panel.badge}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{panel.subtitle}</p>
                    <h3 className="text-lg font-bold mt-0.5">{panel.title}</h3>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">{panel.description}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-white/40 group-hover:text-white/80 transition-colors">
                    <span className="text-xs">Acceder</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Modules */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Modulos Especializados por Rubro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => router.push(mod.href)}
                  className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all duration-150 group"
                >
                  <div className="mb-4">
                    <Icon className={`w-8 h-8 ${mod.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground">{mod.title}</h3>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{mod.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="text-xs font-medium">Ver modulo</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#0f1629] rounded-2xl p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Paneles Disponibles', value: '7', sub: 'Totalmente funcionales' },
              { label: 'Modulos de Negocio', value: '4', sub: 'Gym, Restaurante, Tienda, Repuestos' },
              { label: 'Monedas Soportadas', value: '13+', sub: 'Toda Latinoamerica' },
              { label: 'Idiomas', value: '3', sub: 'ES / EN / PT' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-[#c9a84c]">{stat.value}</div>
                <div className="text-white/80 text-sm font-medium mt-1">{stat.label}</div>
                <div className="text-white/40 text-xs mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
