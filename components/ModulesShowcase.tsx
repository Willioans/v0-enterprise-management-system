'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, ChefHat, ShoppingBag, Wrench } from 'lucide-react';

const modules = [
  {
    id: 'gym',
    name: 'Módulo Gimnasio',
    description: 'Gestión de miembros, clases y rutinas de entrenamiento',
    icon: Dumbbell,
    color: 'bg-blue-50 border-blue-300',
  },
  {
    id: 'restaurant',
    name: 'Módulo Restaurante',
    description: 'Comandera digital, gestión de mesas y órdenes',
    icon: ChefHat,
    color: 'bg-orange-50 border-orange-300',
  },
  {
    id: 'store',
    name: 'Módulo Tienda',
    description: 'Control de productos, tallas, colores y ventas',
    icon: ShoppingBag,
    color: 'bg-green-50 border-green-300',
  },
  {
    id: 'parts',
    name: 'Módulo Repuestos',
    description: 'Catálogo de piezas por marca, modelo y año',
    icon: Wrench,
    color: 'bg-purple-50 border-purple-300',
  },
];

export function ModulesShowcase() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Módulos Especializados</h1>
        <p className="text-muted-foreground mt-2">Elige el módulo que necesitas para tu negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className={`border-2 ${module.color}`}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-8 h-8 text-primary" />
                  <CardTitle>{module.name}</CardTitle>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => router.push(`/modules/${module.id}`)}>
                  Acceder al Módulo
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
