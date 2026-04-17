'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChefHat, Clock, Users, Plus, Minus, X, UtensilsCrossed, CheckCircle2, Timer, Receipt } from 'lucide-react';

type TableStatus = 'libre' | 'ocupada' | 'reservada';
type OrderStatus = 'pendiente' | 'en_cocina' | 'listo' | 'entregado';

interface TableItem {
  id: string; number: number; capacity: number; status: TableStatus;
  occupiedSince?: string; currentOrderId?: string;
}

interface OrderItem { name: string; qty: number; price: number; note?: string; }

interface Order {
  id: string; tableId: string; tableNumber: number;
  items: OrderItem[]; status: OrderStatus;
  createdAt: string; total: number;
}

const MENU = [
  { category: 'Entradas', items: [{ name: 'Ensalada Cesar', price: 8.50 }, { name: 'Tabla de fiambres', price: 12.00 }, { name: 'Bruschetta', price: 7.00 }] },
  { category: 'Principales', items: [{ name: 'Pasta Carbonara', price: 14.00 }, { name: 'Filete de res', price: 18.50 }, { name: 'Salmon a la plancha', price: 16.00 }, { name: 'Milanesa napolitana', price: 13.50 }] },
  { category: 'Bebidas', items: [{ name: 'Agua mineral', price: 2.50 }, { name: 'Cerveza', price: 4.00 }, { name: 'Limonada', price: 3.50 }, { name: 'Gaseosa', price: 2.50 }] },
  { category: 'Postres', items: [{ name: 'Tiramisu', price: 7.00 }, { name: 'Flan casero', price: 5.50 }, { name: 'Helado 3 bochas', price: 6.00 }] },
];

const INIT_TABLES: TableItem[] = [
  { id: '1', number: 1, capacity: 2, status: 'ocupada', occupiedSince: '19:30', currentOrderId: 'ord-1' },
  { id: '2', number: 2, capacity: 4, status: 'libre' },
  { id: '3', number: 3, capacity: 4, status: 'ocupada', occupiedSince: '20:00', currentOrderId: 'ord-2' },
  { id: '4', number: 4, capacity: 6, status: 'reservada' },
  { id: '5', number: 5, capacity: 2, status: 'libre' },
  { id: '6', number: 6, capacity: 8, status: 'ocupada', occupiedSince: '19:00', currentOrderId: 'ord-3' },
  { id: '7', number: 7, capacity: 4, status: 'libre' },
  { id: '8', number: 8, capacity: 4, status: 'reservada' },
];

const INIT_ORDERS: Order[] = [
  { id: 'ord-1', tableId: '1', tableNumber: 1, items: [{ name: 'Ensalada Cesar', qty: 1, price: 8.50 }, { name: 'Pasta Carbonara', qty: 2, price: 14.00 }], status: 'en_cocina', createdAt: '19:31', total: 36.50 },
  { id: 'ord-2', tableId: '3', tableNumber: 3, items: [{ name: 'Agua mineral', qty: 2, price: 2.50 }, { name: 'Filete de res', qty: 2, price: 18.50 }], status: 'pendiente', createdAt: '20:02', total: 42.00 },
  { id: 'ord-3', tableId: '6', tableNumber: 6, items: [{ name: 'Cerveza', qty: 4, price: 4.00 }, { name: 'Milanesa napolitana', qty: 3, price: 13.50 }, { name: 'Tiramisu', qty: 2, price: 7.00 }], status: 'listo', createdAt: '19:05', total: 70.50 },
];

const STATUS_STYLES: Record<OrderStatus, { label: string; badge: 'default' | 'secondary' | 'outline' | 'destructive'; card: string }> = {
  pendiente: { label: 'Pendiente', badge: 'destructive', card: 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20' },
  en_cocina: { label: 'En Cocina', badge: 'default', card: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20' },
  listo: { label: 'Listo para Servir', badge: 'secondary', card: 'border-green-500/50 bg-green-50 dark:bg-green-950/20' },
  entregado: { label: 'Entregado', badge: 'outline', card: '' },
};

const TABLE_STYLES: Record<TableStatus, string> = {
  libre: 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800',
  ocupada: 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800',
  reservada: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-800',
};

export function RestaurantModule() {
  const [tables, setTables] = useState<TableItem[]>(INIT_TABLES);
  const [orders, setOrders] = useState<Order[]>(INIT_ORDERS);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [newOrderItems, setNewOrderItems] = useState<OrderItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);

  const occupied = tables.filter(t => t.status === 'ocupada').length;
  const activeOrders = orders.filter(o => o.status !== 'entregado').length;
  const dailyTotal = orders.reduce((s, o) => s + o.total, 0);

  const addItem = (name: string, price: number) => {
    setNewOrderItems(prev => {
      const ex = prev.find(i => i.name === name);
      if (ex) return prev.map(i => i.name === name ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { name, qty: 1, price }];
    });
  };

  const removeItem = (name: string) => {
    setNewOrderItems(prev => {
      const ex = prev.find(i => i.name === name);
      if (!ex) return prev;
      if (ex.qty === 1) return prev.filter(i => i.name !== name);
      return prev.map(i => i.name === name ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const handleOpenOrder = (table: TableItem) => {
    setSelectedTable(table);
    setNewOrderItems([]);
    setOrderOpen(true);
  };

  const handleSendOrder = () => {
    if (!selectedTable || newOrderItems.length === 0) return;
    const total = newOrderItems.reduce((s, i) => s + i.qty * i.price, 0);
    const newOrder: Order = {
      id: `ord-${Date.now()}`, tableId: selectedTable.id, tableNumber: selectedTable.number,
      items: newOrderItems, status: 'pendiente',
      createdAt: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      total,
    };
    setOrders(prev => [newOrder, ...prev]);
    setTables(prev => prev.map(t => t.id === selectedTable.id
      ? { ...t, status: 'ocupada', currentOrderId: newOrder.id, occupiedSince: newOrder.createdAt }
      : t
    ));
    setOrderOpen(false);
    setNewOrderItems([]);
  };

  const advanceOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const next: Record<OrderStatus, OrderStatus> = { pendiente: 'en_cocina', en_cocina: 'listo', listo: 'entregado', entregado: 'entregado' };
      return { ...o, status: next[o.status] };
    }));
  };

  const newOrderTotal = newOrderItems.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Mesas Ocupadas</p></div>
          <p className="text-2xl font-bold">{occupied}<span className="text-sm font-normal text-muted-foreground">/{tables.length}</span></p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><ChefHat className="h-4 w-4 text-orange-500" /><p className="text-xs text-muted-foreground">Ordenes Activas</p></div>
          <p className="text-2xl font-bold">{activeOrders}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Receipt className="h-4 w-4 text-green-500" /><p className="text-xs text-muted-foreground">Ventas Hoy</p></div>
          <p className="text-2xl font-bold">${dailyTotal.toFixed(0)}</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="mesas">
        <TabsList>
          <TabsTrigger value="mesas">Salon</TabsTrigger>
          <TabsTrigger value="cocina">Cocina <Badge variant="destructive" className="ml-1 text-xs px-1">{orders.filter(o => o.status === 'pendiente' || o.status === 'en_cocina').length}</Badge></TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>

        {/* SALON */}
        <TabsContent value="mesas" className="mt-4">
          <div className="flex gap-3 mb-4 text-xs">
            {(['libre', 'ocupada', 'reservada'] as const).map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${s === 'libre' ? 'bg-green-400' : s === 'ocupada' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                <span className="capitalize text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tables.map(t => (
              <div key={t.id} className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all hover:scale-105 ${TABLE_STYLES[t.status]}`}
                onClick={() => t.status !== 'reservada' && handleOpenOrder(t)}>
                <p className="text-lg font-bold">Mesa {t.number}</p>
                <p className="text-xs text-muted-foreground mb-2">{t.capacity} personas</p>
                <Badge variant={t.status === 'libre' ? 'default' : t.status === 'ocupada' ? 'destructive' : 'secondary'} className="capitalize text-xs">
                  {t.status}
                </Badge>
                {t.occupiedSince && <p className="text-xs text-muted-foreground mt-1"><Clock className="h-3 w-3 inline mr-0.5" />{t.occupiedSince}</p>}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* COCINA */}
        <TabsContent value="cocina" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.filter(o => o.status !== 'entregado').map(o => {
              const cfg = STATUS_STYLES[o.status];
              return (
                <Card key={o.id} className={`border-2 ${cfg.card}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />Mesa {o.tableNumber}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Timer className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{o.createdAt}</span>
                        <Badge variant={cfg.badge} className="ml-1 text-xs">{cfg.label}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-3">
                      {o.items.map(item => (
                        <li key={item.name} className="flex justify-between text-sm">
                          <span>{item.qty}x {item.name}</span>
                          <span className="font-medium">${(item.qty * item.price).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <Separator className="mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total: ${o.total.toFixed(2)}</span>
                      {o.status !== 'entregado' && (
                        <Button size="sm" onClick={() => advanceOrder(o.id)}
                          className={o.status === 'listo' ? 'bg-green-600 hover:bg-green-700 text-white gap-1' : 'gap-1'}>
                          {o.status === 'pendiente' && <><ChefHat className="h-4 w-4" />A Cocina</>}
                          {o.status === 'en_cocina' && <><CheckCircle2 className="h-4 w-4" />Listo</>}
                          {o.status === 'listo' && <><CheckCircle2 className="h-4 w-4" />Entregar</>}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* MENU */}
        <TabsContent value="menu" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MENU.map(cat => (
              <Card key={cat.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cat.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cat.items.map(item => (
                      <div key={item.name} className="flex items-center justify-between py-1.5 border-b last:border-0">
                        <span className="text-sm">{item.name}</span>
                        <span className="font-semibold text-sm">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Order Dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Mesa {selectedTable?.number} — Nueva Orden</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Menu picker */}
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-2">
                {MENU.map(cat => (
                  <div key={cat.category}>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">{cat.category}</p>
                    <div className="space-y-1.5">
                      {cat.items.map(item => (
                        <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                          </div>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => addItem(item.name, item.price)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Order summary */}
            <div className="w-56 flex flex-col border-l pl-4">
              <p className="font-semibold text-sm mb-3">Orden actual</p>
              {newOrderItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">Agrega items del menu</p>
              ) : (
                <ScrollArea className="flex-1">
                  <div className="space-y-2 pr-2">
                    {newOrderItems.map(item => (
                      <div key={item.name} className="flex items-center gap-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">${(item.qty * item.price).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeItem(item.name)}><Minus className="h-3 w-3" /></Button>
                          <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => addItem(item.name, item.price)}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              <Separator className="my-3" />
              <div className="flex justify-between font-bold mb-3">
                <span>Total</span><span>${newOrderTotal.toFixed(2)}</span>
              </div>
              <Button onClick={handleSendOrder} disabled={newOrderItems.length === 0} className="w-full gap-1">
                <ChefHat className="h-4 w-4" />Enviar Orden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
