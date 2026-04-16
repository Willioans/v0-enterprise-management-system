'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, AlertCircle, Package } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  price: number;
  location: string;
}

export function InventorySystem() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Producto A', sku: 'SKU001', quantity: 45, minQuantity: 10, price: 29.99, location: 'Estante 1' },
    { id: '2', name: 'Producto B', sku: 'SKU002', quantity: 8, minQuantity: 15, price: 49.99, location: 'Estante 2' },
    { id: '3', name: 'Producto C', sku: 'SKU003', quantity: 120, minQuantity: 20, price: 19.99, location: 'Estante 3' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const lowStockItems = items.filter((item) => item.quantity < item.minQuantity);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="alerts">
            Alertas
            {lowStockItems.length > 0 && <Badge className="ml-2">{lowStockItems.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Control de Stock</CardTitle>
              <CardDescription>Gestiona tus productos e inventario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Producto
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Producto</th>
                      <th className="text-left py-3 px-4 font-semibold">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold">Ubicación</th>
                      <th className="text-left py-3 px-4 font-semibold">Precio</th>
                      <th className="text-right py-3 px-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.sku}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={item.quantity < item.minQuantity ? 'destructive' : 'secondary'}
                          >
                            {item.quantity}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{item.location}</td>
                        <td className="py-3 px-4 font-semibold">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Stock Bajo</CardTitle>
              <CardDescription>{lowStockItems.length} productos por reabastecer</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Todo el stock está en niveles óptimos</p>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-destructive/5">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {item.quantity} (Mínimo: {item.minQuantity})
                        </p>
                      </div>
                      <Button size="sm">Reabastecer</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
