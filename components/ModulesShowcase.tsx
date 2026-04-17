'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dumbbell, ChefHat, ShoppingBag, Wrench, ChevronRight, Users, UtensilsCrossed, Package } from 'lucide-react';

const modules = [
  {
    id: 'gym',
    name: 'Modulo Gimnasio',
    tagline: 'Gestion integral de membresías y clases',
    description: 'Control de socios, check-in diario, clases grupales, rutinas y vencimientos automaticos.',
    icon: Dumbbell,
    href: '/modules/gym',
    badge: 'FITNESS',
    color: 'bg-orange-500',
    features: ['Miembros y membresias', 'Check-in biometrico', 'Clases y capacidad', 'Alertas de vencimiento'],
  },
  {
    id: 'restaurant',
    name: 'Modulo Restaurante',
    tagline: 'Comandera digital y gestion de salon',
    description: 'Mesas en tiempo real, ordenes a cocina, seguimiento de platos y cierre de cuenta rapido.',
    icon: ChefHat,
    href: '/modules/restaurant',
    badge: 'FOOD & BEVERAGE',
    color: 'bg-red-500',
    features: ['Mapa de salon interactivo', 'Comandas en tiempo real', 'Vista de cocina', 'Historial de ventas'],
  },
  {
    id: 'store',
    name: 'Modulo Tienda',
    tagline: 'Punto de venta con variantes',
    description: 'Catalogo con tallas, colores y variantes. POS integrado con historial de ventas.',
    icon: ShoppingBag,
    href: '/modules/store',
    badge: 'RETAIL',
    color: 'bg-pink-500',
    features: ['Variantes de producto', 'POS tactil', 'Historial de ventas', 'Ticket de cambio'],
  },
  {
    id: 'parts',
    name: 'Modulo Repuestos',
    tagline: 'Catalogo inteligente de piezas',
    description: 'Busqueda avanzada por vehiculo, marca y modelo. Soporte para motos y autos.',
    icon: Wrench,
    href: '/modules/parts',
    badge: 'AUTOMOTIVE',
    color: 'bg-blue-500',
    features: ['Busqueda por vehiculo', 'Moto y auto', 'Alertas de stock', 'Venta rapida'],
  },
];

export function ModulesShowcase() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground text-balance">Modulos Especializados por Rubro</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Cada modulo esta disenado a medida para tu tipo de negocio, con flujos de trabajo optimizados y datos relevantes para tu rubro.
        </p>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card key={mod.id} className="overflow-hidden hover:shadow-md transition-shadow border">
              <div className={`${mod.color} h-2 w-full`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 ${mod.color} bg-opacity-10 rounded-xl flex items-center justify-center`}
                      style={{ background: `color-mix(in srgb, var(--background) 85%, ${mod.color.replace('bg-', '')})` }}>
                      <Icon className="h-6 w-6" style={{ color: 'currentColor' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{mod.name}</h3>
                      <p className="text-xs text-muted-foreground">{mod.tagline}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{mod.badge}</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{mod.description}</p>

                <div className="grid grid-cols-2 gap-1.5 mb-5">
                  {mod.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <Button className="w-full gap-2" onClick={() => router.push(mod.href)}>
                  Acceder al Modulo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
