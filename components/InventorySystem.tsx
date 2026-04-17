'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, AlertTriangle, TrendingDown, TrendingUp, ArrowUpDown } from 'lucide-react';

interface Product {
  id: string; name: string; sku: string; category: string;
  stock: number; minStock: number; maxStock: number;
  cost: number; price: number; location: string; supplier: string;
}

const INITIAL: Product[] = [
  { id: '1', name: 'Camisa Polo Azul', sku: 'CAM-001', category: 'Ropa', stock: 42, minStock: 10, maxStock: 100, cost: 18, price: 35.99, location: 'A-01-01', supplier: 'Textiles SA' },
  { id: '2', name: 'Pantalon Casual', sku: 'PAN-002', category: 'Ropa', stock: 8, minStock: 15, maxStock: 80, cost: 28, price: 55.00, location: 'A-01-02', supplier: 'Textiles SA' },
  { id: '3', name: 'Zapatillas Running', sku: 'ZAP-003', category: 'Calzado', stock: 5, minStock: 10, maxStock: 60, cost: 45, price: 89.99, location: 'B-02-01', supplier: 'Calzados Corp' },
  { id: '4', name: 'Mochila Premium', sku: 'MOC-004', category: 'Accesorios', stock: 25, minStock: 8, maxStock: 50, cost: 22, price: 45.50, location: 'C-03-01', supplier: 'Accesorios Ltda' },
  { id: '5', name: 'Gorra Deportiva', sku: 'GOR-005', category: 'Accesorios', stock: 60, minStock: 20, maxStock: 120, cost: 8, price: 18.00, location: 'C-03-02', supplier: 'Accesorios Ltda' },
  { id: '6', name: 'Camiseta Basica', sku: 'CAM-006', category: 'Ropa', stock: 4, minStock: 20, maxStock: 150, cost: 10, price: 22.00, location: 'A-02-01', supplier: 'Textiles SA' },
  { id: '7', name: 'Shorts Deportivo', sku: 'SHO-007', category: 'Ropa', stock: 35, minStock: 15, maxStock: 80, cost: 14, price: 28.50, location: 'A-02-02', supplier: 'Textiles SA' },
  { id: '8', name: 'Chaleco Polar', sku: 'CHA-010', category: 'Ropa', stock: 3, minStock: 10, maxStock: 50, cost: 32, price: 65.00, location: 'A-03-01', supplier: 'Textiles SA' },
];

const MOVEMENTS = [
  { id: '1', product: 'Camisa Polo Azul', type: 'entrada' as const, qty: 20, date: '2025-04-15', user: 'Admin', reason: 'Compra proveedor' },
  { id: '2', product: 'Pantalon Casual', type: 'salida' as const, qty: 5, date: '2025-04-15', user: 'Vendedor', reason: 'Venta POS' },
  { id: '3', product: 'Zapatillas Running', type: 'ajuste' as const, qty: 3, date: '2025-04-14', user: 'Admin', reason: 'Conteo fisico' },
  { id: '4', product: 'Chaleco Polar', type: 'salida' as const, qty: 7, date: '2025-04-13', user: 'Vendedor', reason: 'Venta POS' },
  { id: '5', product: 'Gorra Deportiva', type: 'entrada' as const, qty: 40, date: '2025-04-12', user: 'Admin', reason: 'Compra proveedor' },
];

const EMPTY_FORM = { name: '', sku: '', category: 'Ropa', stock: '', minStock: '', maxStock: '', cost: '', price: '', location: '', supplier: '' };

export function InventorySystem() {
  const [products, setProducts] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [movOpen, setMovOpen] = useState(false);
  const [selectedProd, setSelectedProd] = useState<Product | null>(null);
  const [movType, setMovType] = useState<'entrada' | 'salida' | 'ajuste'>('entrada');
  const [movQty, setMovQty] = useState('');
  const [movReason, setMovReason] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );
  const lowStock = products.filter(p => p.stock <= p.minStock);
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const totalItems = products.reduce((s, p) => s + p.stock, 0);

  const getLevel = (p: Product) => {
    const pct = (p.stock / p.maxStock) * 100;
    if (p.stock <= p.minStock) return { label: 'Critico', pct };
    if (pct < 40) return { label: 'Bajo', pct };
    return { label: 'OK', pct };
  };

  const handleAdd = () => {
    setProducts(prev => [...prev, {
      id: String(Date.now()), name: form.name, sku: form.sku, category: form.category,
      stock: Number(form.stock), minStock: Number(form.minStock), maxStock: Number(form.maxStock),
      cost: Number(form.cost), price: Number(form.price), location: form.location, supplier: form.supplier,
    }]);
    setAddOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleMovement = () => {
    if (!selectedProd || !movQty) return;
    const qty = Number(movQty);
    const delta = movType === 'salida' ? -qty : movType === 'ajuste' ? (qty - selectedProd.stock) : qty;
    setProducts(prev => prev.map(p => p.id === selectedProd.id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    setMovOpen(false); setMovQty(''); setMovReason(''); setSelectedProd(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Productos', value: products.length, normal: true },
          { label: 'Unidades en Stock', value: totalItems.toLocaleString(), normal: true },
          { label: 'Valor Inventario', value: `$${totalValue.toLocaleString()}`, normal: true },
          { label: 'Stock Critico', value: lowStock.length, normal: false },
        ].map(({ label, value, normal }) => (
          <Card key={label} className={!normal && Number(value) > 0 ? 'border-destructive/50' : ''}>
            <CardContent className="p-4">
              <p className={`text-xs ${!normal && Number(value) > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>{label}</p>
              <p className={`text-2xl font-bold ${!normal && Number(value) > 0 ? 'text-destructive' : ''}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {lowStock.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm">Stock bajo en {lowStock.length} producto(s)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.map(p => (
                <Badge key={p.id} variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400 text-xs">
                  {p.name}: {p.stock} unid.
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="productos">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-9 h-9 w-52" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Agregar</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Nuevo Producto</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Nombre', 'name'], ['SKU', 'sku'], ['Stock Inicial', 'stock'], ['Stock Minimo', 'minStock'],
                    ['Stock Maximo', 'maxStock'], ['Costo ($)', 'cost'], ['Precio Venta ($)', 'price'],
                    ['Ubicacion', 'location'], ['Proveedor', 'supplier'],
                  ].map(([label, key]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input className="h-8 text-sm" value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-xs">Categoria</Label>
                    <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Ropa', 'Calzado', 'Accesorios', 'Electronica', 'Alimentos', 'Otros'].map(c =>
                          <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAdd} disabled={!form.name || !form.sku} className="w-full mt-2">Guardar</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="productos">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Ubicacion</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="w-32">Nivel</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => {
                  const lv = getLevel(p);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.category} · {p.supplier}</p>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell className="text-xs">{p.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{p.stock}</span>
                          <Badge variant={lv.label === 'Critico' ? 'destructive' : lv.label === 'Bajo' ? 'outline' : 'secondary'} className="text-xs">
                            {lv.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Progress value={lv.pct} className="h-1.5 w-28" />
                        <p className="text-xs text-muted-foreground mt-0.5">{p.stock}/{p.maxStock}</p>
                      </TableCell>
                      <TableCell className="text-sm">${p.cost}</TableCell>
                      <TableCell className="text-sm font-semibold">${p.price}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="h-7 text-xs"
                          onClick={() => { setSelectedProd(p); setMovOpen(true); }}>
                          <ArrowUpDown className="h-3 w-3 mr-1" />Movimiento
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOVEMENTS.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium text-sm">{m.product}</TableCell>
                    <TableCell>
                      <Badge variant={m.type === 'entrada' ? 'default' : m.type === 'salida' ? 'destructive' : 'secondary'} className="text-xs capitalize">
                        {m.type === 'entrada' ? <TrendingUp className="h-3 w-3 mr-1 inline" /> : <TrendingDown className="h-3 w-3 mr-1 inline" />}
                        {m.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold">{m.qty}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.date}</TableCell>
                    <TableCell className="text-xs">{m.user}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Movement Dialog */}
      <Dialog open={movOpen} onOpenChange={setMovOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Registrar Movimiento</DialogTitle></DialogHeader>
          {selectedProd && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">{selectedProd.name}</p>
                <p className="text-sm text-muted-foreground">Stock actual: <span className="font-bold text-foreground">{selectedProd.stock}</span></p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipo</Label>
                <Select value={movType} onValueChange={v => setMovType(v as 'entrada' | 'salida' | 'ajuste')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada (Compra / Devolucion)</SelectItem>
                    <SelectItem value="salida">Salida (Venta / Merma)</SelectItem>
                    <SelectItem value="ajuste">Ajuste (Nuevo total)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{movType === 'ajuste' ? 'Nuevo stock total' : 'Cantidad'}</Label>
                <Input type="number" min={0} value={movQty} onChange={e => setMovQty(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Motivo (opcional)</Label>
                <Input value={movReason} onChange={e => setMovReason(e.target.value)} placeholder="Ej. Compra proveedor" />
              </div>
              <Button className="w-full" onClick={handleMovement} disabled={!movQty}>Registrar Movimiento</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
