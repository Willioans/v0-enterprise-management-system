'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Search } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function POSSystem() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Mock products
  const products = [
    { id: '1', name: 'Producto A', price: 29.99 },
    { id: '2', name: 'Producto B', price: 49.99 },
    { id: '3', name: 'Producto C', price: 19.99 },
    { id: '4', name: 'Producto D', price: 89.99 },
  ];

  const addToCart = (product: any) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Productos Disponibles</CardTitle>
            <CardDescription>Selecciona productos para agregar al carrito</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 border rounded-lg hover:bg-muted transition-colors">
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  <p className="text-primary font-bold mt-2">${product.price.toFixed(2)}</p>
                  <Button size="sm" className="w-full mt-3" onClick={() => addToCart(product)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Carrito</CardTitle>
            <CardDescription>{cartItems.length} artículos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Carrito vacío</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-12 text-center h-8"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Método de Pago</p>
                    <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="cash">Efectivo</TabsTrigger>
                        <TabsTrigger value="card">Tarjeta</TabsTrigger>
                        <TabsTrigger value="transfer">Transferencia</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <Button className="w-full" size="lg">
                    Procesar Pago
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
