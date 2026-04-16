'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench } from 'lucide-react';

const parts = [
  {
    id: '1',
    name: 'Pastillas de Freno',
    model: 'Moto Honda 150cc',
    year: '2020-2024',
    sku: 'BRK-001',
    stock: 28,
    price: 45.99,
  },
  {
    id: '2',
    name: 'Correa de Distribución',
    model: 'Auto Toyota Corolla',
    year: '2015-2022',
    sku: 'BLT-002',
    stock: 12,
    price: 89.99,
  },
  {
    id: '3',
    name: 'Aceite Sintético 10W-40',
    model: 'Universal',
    year: 'Todos',
    sku: 'OIL-003',
    stock: 156,
    price: 24.99,
  },
];

export function PartsModule() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="catalog">Catálogo de Repuestos</TabsTrigger>
          <TabsTrigger value="search">Búsqueda Avanzada</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repuestos Disponibles</CardTitle>
              <CardDescription>Búsqueda por marca, modelo y año</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parts.map((part) => (
                  <div key={part.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-2 items-start">
                        <Wrench className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-semibold">{part.name}</h3>
                          <p className="text-sm text-muted-foreground">{part.model}</p>
                          <p className="text-xs text-muted-foreground">Años: {part.year}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${part.price}</p>
                        <Badge className="mt-1">{part.stock} unidades</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{part.sku}</code>
                      <Button size="sm">Ver Detalles</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Avanzada</CardTitle>
              <CardDescription>Filtra por marca, modelo y año del vehículo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Marca del Vehículo</label>
                  <select className="w-full mt-2 p-2 border rounded">
                    <option>Honda</option>
                    <option>Yamaha</option>
                    <option>Toyota</option>
                    <option>Chevrolet</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Modelo</label>
                  <select className="w-full mt-2 p-2 border rounded">
                    <option>150cc</option>
                    <option>200cc</option>
                    <option>250cc</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Año</label>
                  <select className="w-full mt-2 p-2 border rounded">
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
                <Button className="w-full">Buscar Repuestos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
