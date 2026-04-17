'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ShoppingCart, Search, Trash2, Plus, Minus, CreditCard,
  Banknote, Smartphone, ReceiptText, ArrowLeft, Package, Tag
} from 'lucide-react';
import Link from 'next/link';

interface CartItem { id: string; name: string; price: number; qty: number; }
interface Product { id: string; name: string; price: number; stock: number; category: string; sku: string; }

const PRODUCTS: Product[] = [
  { id: '1', name: 'Camisa Polo Azul', price: 35.99, stock: 42, category: 'Ropa', sku: 'CAM-001' },
  { id: '2', name: 'Pantalon Casual', price: 55.00, stock: 18, category: 'Ropa', sku: 'PAN-002' },
  { id: '3', name: 'Zapatillas Running', price: 89.99, stock: 12, category: 'Calzado', sku: 'ZAP-003' },
  { id: '4', name: 'Mochila Premium', price: 45.50, stock: 25, category: 'Accesorios', sku: 'MOC-004' },
  { id: '5', name: 'Gorra Deportiva', price: 18.00, stock: 60, category: 'Accesorios', sku: 'GOR-005' },
  { id: '6', name: 'Camiseta Basica', price: 22.00, stock: 80, category: 'Ropa', sku: 'CAM-006' },
  { id: '7', name: 'Shorts Deportivo', price: 28.50, stock: 35, category: 'Ropa', sku: 'SHO-007' },
  { id: '8', name: 'Medias Pack x3', price: 12.00, stock: 100, category: 'Accesorios', sku: 'MED-008' },
  { id: '9', name: 'Cinturon Cuero', price: 32.00, stock: 20, category: 'Accesorios', sku: 'CIN-009' },
  { id: '10', name: 'Chaleco Polar', price: 65.00, stock: 15, category: 'Ropa', sku: 'CHA-010' },
  { id: '11', name: 'Lentes de Sol', price: 48.00, stock: 22, category: 'Accesorios', sku: 'LEN-011' },
  { id: '12', name: 'Bolso de Mano', price: 38.00, stock: 28, category: 'Accesorios', sku: 'BOL-012' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' },
  { code: 'MXN', symbol: 'MX$' }, { code: 'COP', symbol: 'COL$' },
  { code: 'BRL', symbol: 'R$' }, { code: 'ARS', symbol: 'AR$' },
  { code: 'CLP', symbol: 'CL$' }, { code: 'PEN', symbol: 'S/' },
];

const CATEGORIES = ['Todos', 'Ropa', 'Calzado', 'Accesorios'];

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [currency, setCurrency] = useState('USD');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? '$';

  const filtered = PRODUCTS.filter(p => {
    const matchCat = category === 'Todos' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  const updateQty = (id: string, d: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discAmt = subtotal * (discount / 100);
  const tax = (subtotal - discAmt) * 0.12;
  const total = subtotal - discAmt + tax;
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const processSale = () => {
    if (!paymentMethod || cart.length === 0) return;
    setReceiptOpen(true);
  };

  const newSale = () => {
    setCart([]); setDiscount(0); setPaymentMethod(''); setReceiptOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" />Dashboard</Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <p className="font-bold text-primary">H&I System</p>
            <p className="text-xs text-muted-foreground">Punto de Venta</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="gap-1">
            <ShoppingCart className="h-3 w-3" />{itemCount}
          </Badge>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Products */}
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
          <div className="flex gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar producto o SKU..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1">
              {CATEGORIES.map(cat => (
                <Button key={cat} size="sm" variant={category === cat ? 'default' : 'outline'} onClick={() => setCategory(cat)}>{cat}</Button>
              ))}
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pr-2">
              {filtered.map(product => (
                <Card key={product.id} className="cursor-pointer hover:border-primary hover:shadow-md transition-all active:scale-95 select-none" onClick={() => addToCart(product)}>
                  <CardContent className="p-3">
                    <div className="w-full h-16 bg-muted rounded-md flex items-center justify-center mb-2">
                      <Package className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <p className="font-semibold text-sm leading-tight truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-bold text-primary text-sm">{sym}{product.price.toFixed(2)}</span>
                      <Badge variant={product.stock < 20 ? 'destructive' : 'secondary'} className="text-xs px-1.5">{product.stock}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Cart */}
        <div className="w-80 border-l bg-card flex flex-col shrink-0">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2"><ShoppingCart className="h-4 w-4" />Venta Actual</h2>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCart([])} className="text-destructive h-7 px-2 text-xs">Limpiar</Button>
            )}
          </div>

          <ScrollArea className="flex-1 p-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Toca un producto para agregarlo</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{sym}{item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setCart(c => c.filter(i => i.id !== item.id))}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input type="number" placeholder="Descuento %" className="h-8 text-sm" min={0} max={100}
                value={discount || ''} onChange={e => setDiscount(Number(e.target.value))} />
            </div>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{sym}{subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento ({discount}%)</span><span>-{sym}{discAmt.toFixed(2)}</span></div>}
              <div className="flex justify-between text-muted-foreground"><span>IVA 12%</span><span>{sym}{tax.toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base text-primary"><span>TOTAL</span><span>{sym}{total.toFixed(2)}</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ id: 'cash', label: 'Efectivo', Icon: Banknote }, { id: 'card', label: 'Tarjeta', Icon: CreditCard }, { id: 'digital', label: 'Digital', Icon: Smartphone }].map(({ id, label, Icon }) => (
                <Button key={id} variant={paymentMethod === id ? 'default' : 'outline'} size="sm"
                  className="flex flex-col h-14 gap-1 text-xs" onClick={() => setPaymentMethod(id)}>
                  <Icon className="h-4 w-4" />{label}
                </Button>
              ))}
            </div>
            <Button className="w-full font-bold" disabled={cart.length === 0 || !paymentMethod} onClick={processSale}>
              <ReceiptText className="mr-2 h-4 w-4" />Procesar Venta — {sym}{total.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader><DialogTitle className="text-center text-green-600">Venta Completada</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="text-center border-b pb-3">
              <p className="font-bold text-base">H&I System</p>
              <p className="text-xs text-muted-foreground">{new Date().toLocaleString('es-ES')}</p>
            </div>
            {cart.map(i => (
              <div key={i.id} className="flex justify-between">
                <span className="text-muted-foreground">{i.name} x{i.qty}</span>
                <span className="font-medium">{sym}{(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>TOTAL</span><span>{sym}{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground capitalize">
              <span>Metodo de pago</span><span>{paymentMethod}</span>
            </div>
            <Button className="w-full mt-2" onClick={newSale}>Nueva Venta</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
