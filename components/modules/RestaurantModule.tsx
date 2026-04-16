'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Clock, Users } from 'lucide-react';

const tables = [
  { id: '1', number: 1, capacity: 4, status: 'occupied', orders: 2, time: '15 min' },
  { id: '2', number: 2, capacity: 2, status: 'empty', orders: 0, time: '-' },
  { id: '3', number: 3, capacity: 6, status: 'occupied', orders: 3, time: '45 min' },
  { id: '4', number: 4, capacity: 4, status: 'reserved', orders: 0, time: '-' },
];

const orders = [
  { id: '1', table: 1, items: 'Ensalada César, Filete', status: 'pending', time: '10 min' },
  { id: '2', table: 3, items: 'Pasta Carbonara, Camarones', status: 'cooking', time: '5 min' },
  { id: '3', table: 1, items: 'Agua mineral, 2 Cervezas', status: 'delivered', time: 'Entregado' },
];

export function RestaurantModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mesas Ocupadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.filter((t) => t.status === 'occupied').length}
            </div>
            <p className="text-xs text-muted-foreground">De {tables.length} disponibles</p>
            <Users className="w-4 h-4 text-primary mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status !== 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">En proceso</p>
            <ChefHat className="w-4 h-4 text-primary mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34 min</div>
            <p className="text-xs text-muted-foreground">Desde orden a entrega</p>
            <Clock className="w-4 h-4 text-primary mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tables">Gestión de Mesas</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Mesas</CardTitle>
              <CardDescription>Visualización en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${
                      table.status === 'occupied'
                        ? 'bg-red-50 border-red-300'
                        : table.status === 'reserved'
                          ? 'bg-yellow-50 border-yellow-300'
                          : 'bg-green-50 border-green-300'
                    }`}
                  >
                    <p className="text-lg font-bold">Mesa {table.number}</p>
                    <p className="text-xs text-muted-foreground">{table.capacity} personas</p>
                    <Badge className="mt-2" variant={table.status === 'empty' ? 'outline' : 'secondary'}>
                      {table.status === 'occupied' ? 'Ocupada' : table.status === 'reserved' ? 'Reservada' : 'Disponible'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comandera Digital</CardTitle>
              <CardDescription>Órdenes en la cocina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 border rounded-lg ${
                      order.status === 'pending'
                        ? 'bg-yellow-50'
                        : order.status === 'cooking'
                          ? 'bg-blue-50'
                          : 'bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Mesa {order.table}</p>
                      <Badge variant="outline">{order.time}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{order.items}</p>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button size="sm" className="flex-1">
                          Enviar a Cocina
                        </Button>
                      )}
                      {order.status === 'cooking' && (
                        <Button size="sm" className="flex-1">
                          Listo
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Entregado
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
