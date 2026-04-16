'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const products = [
  { id: '1', name: 'Camiseta Azul', size: ['S', 'M', 'L', 'XL'], color: ['Azul', 'Negro'], stock: 45, price: 29.99 },
  { id: '2', name: 'Pantalón Negro', size: ['30', '32', '34', '36'], color: ['Negro', 'Gris'], stock: 32, price: 59.99 },
  { id: '3', name: 'Zapatos Deportivos', size: ['36', '38', '40', '42'], color: ['Blanco', 'Negro'], stock: 18, price: 89.99 },
];

export function StoreModule() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catálogo de Productos</CardTitle>
              <CardDescription>Gestión de tallas, colores y stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">${product.price}</p>
                      </div>
                      <Badge variant={product.stock > 20 ? 'default' : 'secondary'}>
                        {product.stock} unidades
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Tallas</p>
                        <div className="flex gap-1 mt-1">
                          {product.size.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Colores</p>
                        <div className="flex gap-1 mt-1">
                          {product.color.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button size="sm">Editar Producto</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Ventas</CardTitle>
              <CardDescription>Hoy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Total de Ventas</span>
                  <Badge>$2,450</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Transacciones</span>
                  <Badge variant="secondary">23</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Ticket Promedio</span>
                  <Badge variant="outline">$106.52</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
