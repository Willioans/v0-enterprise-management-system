'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Plus, Minus, X, Search, Receipt, CreditCard, Banknote, Package, TrendingUp, ShoppingBag } from 'lucide-react';

interface CartItem { id: string; name: string; price: number; qty: number; size: string; color: string; }

interface Product {
  id: string; name: string; category: string; price: number;
  sizes: string[]; colors: string[];
  stock: Record<string, number>; image?: string;
}

const CATALOG: Product[] = [
  { id: '1', name: 'Camisa Polo Azul', category: 'Ropa', price: 35.99, sizes: ['S', 'M', 'L', 'XL'], colors: ['Azul', 'Blanco', 'Negro'], stock: { S: 5, M: 8, L: 12, XL: 4 } },
  { id: '2', name: 'Pantalon Casual', category: 'Ropa', price: 55.00, sizes: ['28', '30', '32', '34', '36'], colors: ['Negro', 'Gris', 'Azul'], stock: { '28': 3, '30': 7, '32': 9, '34': 5, '36': 2 } },
  { id: '3', name: 'Zapatillas Running', category: 'Calzado', price: 89.99, sizes: ['36', '37', '38', '39', '40', '41', '42'], colors: ['Blanco', 'Negro', 'Rojo'], stock: { '36': 2, '37': 4, '38': 6, '39': 5, '40': 3, '41': 4, '42': 2 } },
  { id: '4', name: 'Mochila Premium', category: 'Accesorios', price: 45.50, sizes: ['Unica'], colors: ['Negro', 'Gris'], stock: { Unica: 25 } },
  { id: '5', name: 'Gorra Deportiva', category: 'Accesorios', price: 18.00, sizes: ['Unica'], colors: ['Negro', 'Blanco', 'Rojo', 'Azul'], stock: { Unica: 60 } },
  { id: '6', name: 'Camiseta Basica', category: 'Ropa', price: 22.00, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blanco', 'Negro', 'Gris', 'Azul'], stock: { XS: 5, S: 8, M: 10, L: 7, XL: 4 } },
];

const SALES_HISTORY = [
  { id: 'V-089', date: '2025-04-16', items: 3, total: 145.50, method: 'tarjeta' },
  { id: 'V-088', date: '2025-04-16', items: 1, total: 89.99, method: 'efectivo' },
  { id: 'V-087', date: '2025-04-15', items: 4, total: 213.00, method: 'tarjeta' },
  { id: 'V-086', date: '2025-04-15', items: 2, total: 74.00, method: 'efectivo' },
  { id: 'V-085', date: '2025-04-14', items: 5, total: 289.49, method: 'tarjeta' },
];

export function StoreModule() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<'efectivo' | 'tarjeta'>('efectivo');
  const [received, setReceived] = useState('');
  const [sales, setSales] = useState(SALES_HISTORY);

  const categories = ['Todos', ...Array.from(new Set(CATALOG.map(p => p.category)))];
  const filtered = CATALOG.filter(p =>
    (categoryFilter === 'Todos' || p.category === categoryFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const change = Number(received) - cartTotal;

  const addToCart = (product: Product, size: string, color: string) => {
    const key = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const ex = prev.find(i => i.id === key);
      if (ex) return prev.map(i => i.id === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: key, name: product.name, price: product.price, qty: 1, size, color }];
    });
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const handleFinalizeSale = () => {
    const newSale = {
      id: `V-${String(sales.length + 90).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      items: cartCount, total: cartTotal, method: payMethod,
    };
    setSales(prev => [newSale, ...prev]);
    setCart([]);
    setPayOpen(false);
    setReceived('');
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-green-500" /><p className="text-xs text-muted-foreground">Ventas Hoy</p></div>
          <p className="text-2xl font-bold">${sales.filter(s => s.date === '2025-04-16').reduce((a, s) => a + s.total, 0).toFixed(0)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Receipt className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Transacciones</p></div>
          <p className="text-2xl font-bold">{sales.filter(s => s.date === '2025-04-16').length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><ShoppingBag className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Ticket Promedio</p></div>
          <p className="text-2xl font-bold">${(sales.reduce((a, s) => a + s.total, 0) / sales.length).toFixed(0)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Package className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Productos</p></div>
          <p className="text-2xl font-bold">{CATALOG.length}</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="pos">
        <TabsList>
          <TabsTrigger value="pos">Punto de Venta</TabsTrigger>
          <TabsTrigger value="ventas">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="mt-4">
          <div className="flex gap-4">
            {/* Catalog */}
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar producto..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.map(p => (
                  <Card key={p.id} className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => { setSelectedProduct(p); setSelectedSize(p.sizes[0]); setSelectedColor(p.colors[0]); }}>
                    <CardContent className="p-3">
                      <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center mb-2">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                      <p className="font-medium text-sm line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                      <p className="font-bold text-primary mt-1">${p.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="w-64 flex flex-col gap-3">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />Carrito ({cartCount})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  {cart.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">Selecciona productos del catalogo</p>
                  ) : (
                    <div className="space-y-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.size} · {item.color}</p>
                            <p className="text-xs font-bold">${(item.price * item.qty).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                            <span className="text-xs w-4 text-center font-bold">{item.qty}</span>
                            <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex justify-between font-bold text-base mb-3">
                    <span>Total</span><span className="text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full gap-2" disabled={cart.length === 0} onClick={() => setPayOpen(true)}>
                    <Receipt className="h-4 w-4" />Cobrar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ventas" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Venta</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Metodo</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-sm font-medium">{s.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.date}</TableCell>
                    <TableCell className="text-sm">{s.items} productos</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize gap-1">
                        {s.method === 'tarjeta' ? <CreditCard className="h-3 w-3" /> : <Banknote className="h-3 w-3" />}
                        {s.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">${s.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product selector */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{selectedProduct?.name}</DialogTitle></DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <p className="text-2xl font-bold text-primary">${selectedProduct.price.toFixed(2)}</p>
              <div className="space-y-1">
                <Label className="text-xs">Talla</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map(s => (
                    <Button key={s} size="sm" variant={selectedSize === s ? 'default' : 'outline'}
                      className="h-8 w-10 p-0 text-xs" onClick={() => setSelectedSize(s)}>{s}</Button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Color</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map(c => (
                    <Button key={c} size="sm" variant={selectedColor === c ? 'default' : 'outline'}
                      className="h-8 text-xs" onClick={() => setSelectedColor(c)}>{c}</Button>
                  ))}
                </div>
              </div>
              <Button className="w-full gap-2" onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}>
                <Plus className="h-4 w-4" />Agregar al Carrito
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Confirmar Pago</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-1">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.qty}x {item.name} ({item.size})</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold"><span>TOTAL</span><span className="text-primary">${cartTotal.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant={payMethod === 'efectivo' ? 'default' : 'outline'} className="flex-1 gap-1" onClick={() => setPayMethod('efectivo')}>
                <Banknote className="h-4 w-4" />Efectivo
              </Button>
              <Button variant={payMethod === 'tarjeta' ? 'default' : 'outline'} className="flex-1 gap-1" onClick={() => setPayMethod('tarjeta')}>
                <CreditCard className="h-4 w-4" />Tarjeta
              </Button>
            </div>
            {payMethod === 'efectivo' && (
              <div className="space-y-1">
                <Label className="text-xs">Monto recibido</Label>
                <Input type="number" value={received} onChange={e => setReceived(e.target.value)} placeholder={`$${cartTotal.toFixed(2)}`} />
                {Number(received) >= cartTotal && Number(received) > 0 && (
                  <p className="text-sm text-green-600 font-medium">Cambio: ${change.toFixed(2)}</p>
                )}
              </div>
            )}
            <Button className="w-full gap-2" onClick={handleFinalizeSale}
              disabled={payMethod === 'efectivo' && (Number(received) < cartTotal || !received)}>
              <Receipt className="h-4 w-4" />Finalizar Venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
