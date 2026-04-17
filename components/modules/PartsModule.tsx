'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Search, Plus, Car, Bike, AlertTriangle, Package, ShoppingCart, Filter } from 'lucide-react';

interface Part {
  id: string; name: string; sku: string; category: string;
  vehicleType: 'moto' | 'auto' | 'universal';
  brand: string; model: string; yearRange: string;
  stock: number; minStock: number; price: number; cost: number;
}

const INIT_PARTS: Part[] = [
  { id: '1', name: 'Pastillas de Freno Delanteras', sku: 'BRK-F-001', category: 'Frenos', vehicleType: 'moto', brand: 'Honda', model: 'CB150 / CB190', yearRange: '2018-2025', stock: 28, minStock: 5, price: 18.50, cost: 9.00 },
  { id: '2', name: 'Correa de Distribucion', sku: 'BLT-D-002', category: 'Motor', vehicleType: 'auto', brand: 'Toyota', model: 'Corolla', yearRange: '2015-2023', stock: 8, minStock: 3, price: 45.00, cost: 22.00 },
  { id: '3', name: 'Aceite Sintetico 10W-40 (1L)', sku: 'OIL-10W-003', category: 'Lubricantes', vehicleType: 'universal', brand: 'Universal', model: 'Todos', yearRange: 'Todos', stock: 156, minStock: 20, price: 12.00, cost: 5.50 },
  { id: '4', name: 'Filtro de Aire', sku: 'FLT-A-004', category: 'Filtros', vehicleType: 'moto', brand: 'Yamaha', model: 'FZ150 / FZ250', yearRange: '2019-2025', stock: 15, minStock: 4, price: 8.50, cost: 3.50 },
  { id: '5', name: 'Kit Cadena y Piñones', sku: 'KIT-C-005', category: 'Transmision', vehicleType: 'moto', brand: 'Honda', model: 'Titan 150 / XRE 190', yearRange: '2016-2025', stock: 10, minStock: 3, price: 55.00, cost: 28.00 },
  { id: '6', name: 'Amortiguador Trasero', sku: 'AMO-T-006', category: 'Suspension', vehicleType: 'moto', brand: 'Universal', model: 'Motos 150cc', yearRange: '2015-2025', stock: 4, minStock: 4, price: 35.00, cost: 16.00 },
  { id: '7', name: 'Bateria 12V 5Ah', sku: 'BAT-12V-007', category: 'Electrica', vehicleType: 'moto', brand: 'Universal', model: 'Todas', yearRange: 'Todos', stock: 22, minStock: 5, price: 28.00, cost: 13.00 },
  { id: '8', name: 'Disco de Freno Ventilado', sku: 'DSC-F-008', category: 'Frenos', vehicleType: 'auto', brand: 'Chevrolet', model: 'Cruze / Onix', yearRange: '2012-2025', stock: 6, minStock: 2, price: 85.00, cost: 42.00 },
  { id: '9', name: 'Bujias NGK Set x4', sku: 'SPK-NGK-009', category: 'Motor', vehicleType: 'auto', brand: 'Universal', model: 'Motores 1.4 - 1.6', yearRange: 'Todos', stock: 35, minStock: 10, price: 18.00, cost: 8.00 },
  { id: '10', name: 'Filtro de Aceite', sku: 'FLT-O-010', category: 'Filtros', vehicleType: 'universal', brand: 'Universal', model: 'Todos', yearRange: 'Todos', stock: 2, minStock: 8, price: 6.50, cost: 2.50 },
];

const BRANDS_MOTO = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Bajaj', 'Beta', 'Zanella'];
const BRANDS_AUTO = ['Toyota', 'Chevrolet', 'Ford', 'Volkswagen', 'Peugeot', 'Renault', 'Fiat'];
const CATEGORIES = ['Frenos', 'Motor', 'Transmision', 'Suspension', 'Electrica', 'Filtros', 'Lubricantes', 'Carroceria'];

export function PartsModule() {
  const [parts, setParts] = useState<Part[]>(INIT_PARTS);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<'todos' | 'moto' | 'auto' | 'universal'>('todos');
  const [catFilter, setCatFilter] = useState('Todas');
  const [addOpen, setAddOpen] = useState(false);
  const [cart, setCart] = useState<{ part: Part; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [advSearch, setAdvSearch] = useState({ brand: '', model: '', year: '' });
  const [form, setForm] = useState({ name: '', sku: '', category: 'Frenos', vehicleType: 'moto', brand: '', model: '', yearRange: '', stock: '', minStock: '', price: '', cost: '' });

  const filtered = parts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchVehicle = vehicleFilter === 'todos' || p.vehicleType === vehicleFilter;
    const matchCat = catFilter === 'Todas' || p.category === catFilter;
    const matchAdv = (!advSearch.brand || p.brand.toLowerCase().includes(advSearch.brand.toLowerCase())) &&
      (!advSearch.model || p.model.toLowerCase().includes(advSearch.model.toLowerCase()));
    return matchSearch && matchVehicle && matchCat && matchAdv;
  });

  const lowStock = parts.filter(p => p.stock <= p.minStock);
  const totalValue = parts.reduce((s, p) => s + p.stock * p.cost, 0);
  const cartTotal = cart.reduce((s, c) => s + c.part.price * c.qty, 0);

  const addToCart = (part: Part) => {
    setCart(prev => {
      const ex = prev.find(c => c.part.id === part.id);
      if (ex) return prev.map(c => c.part.id === part.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { part, qty: 1 }];
    });
  };

  const handleAdd = () => {
    setParts(prev => [...prev, {
      id: String(Date.now()), name: form.name, sku: form.sku, category: form.category,
      vehicleType: form.vehicleType as Part['vehicleType'], brand: form.brand, model: form.model,
      yearRange: form.yearRange, stock: Number(form.stock), minStock: Number(form.minStock),
      price: Number(form.price), cost: Number(form.cost),
    }]);
    setAddOpen(false);
  };

  const VehicleIcon = ({ type }: { type: string }) =>
    type === 'auto' ? <Car className="h-3 w-3" /> : type === 'moto' ? <Bike className="h-3 w-3" /> : <Package className="h-3 w-3" />;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Package className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Total Referencias</p></div>
          <p className="text-2xl font-bold">{parts.length}</p>
        </CardContent></Card>
        <Card className={lowStock.length > 0 ? 'border-yellow-500/50' : ''}><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className={`h-4 w-4 ${lowStock.length > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} /><p className="text-xs text-muted-foreground">Stock Critico</p></div>
          <p className={`text-2xl font-bold ${lowStock.length > 0 ? 'text-yellow-600' : ''}`}>{lowStock.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Bike className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Refs. Moto</p></div>
          <p className="text-2xl font-bold">{parts.filter(p => p.vehicleType === 'moto').length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Car className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Refs. Auto</p></div>
          <p className="text-2xl font-bold">{parts.filter(p => p.vehicleType === 'auto').length}</p>
        </CardContent></Card>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm">Repuestos con stock critico</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lowStock.map(p => (
                <Badge key={p.id} variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400 text-xs">
                  {p.name}: {p.stock} unid.
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="catalogo">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="catalogo">Catalogo</TabsTrigger>
            <TabsTrigger value="busqueda">Busqueda Avanzada</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {cart.length > 0 && (
              <Button variant="outline" size="sm" className="gap-1 relative" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="h-4 w-4" />
                <span>Venta ({cart.length})</span>
              </Button>
            )}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Agregar Repuesto</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Nuevo Repuesto</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  {[['Nombre', 'name'], ['SKU / Codigo', 'sku'], ['Marca / Fabricante', 'brand'], ['Modelo Compatible', 'model'], ['Rango de Anios', 'yearRange'], ['Stock Inicial', 'stock'], ['Stock Minimo', 'minStock'], ['Precio Venta', 'price'], ['Costo', 'cost']].map(([label, key]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input className="h-8 text-sm" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-xs">Tipo de Vehiculo</Label>
                    <Select value={form.vehicleType} onValueChange={v => setForm(f => ({ ...f, vehicleType: v }))}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moto">Moto</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="universal">Universal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Categoria</Label>
                    <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAdd} disabled={!form.name || !form.sku} className="w-full mt-2">Guardar Repuesto</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="catalogo">
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar repuesto, SKU, marca..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1">
              {(['todos', 'moto', 'auto', 'universal'] as const).map(v => (
                <Button key={v} size="sm" variant={vehicleFilter === v ? 'default' : 'outline'}
                  className="h-9 capitalize gap-1" onClick={() => setVehicleFilter(v)}>
                  {v === 'moto' && <Bike className="h-3 w-3" />}
                  {v === 'auto' && <Car className="h-3 w-3" />}
                  {v === 'todos' && <Filter className="h-3 w-3" />}
                  {v}
                </Button>
              ))}
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas las categorias</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repuesto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Vehiculo</TableHead>
                  <TableHead>Compatible con</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
                          <Wrench className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          <Badge variant="outline" className="text-xs mt-0.5">{p.category}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{p.sku}</code></TableCell>
                    <TableCell>
                      <Badge variant={p.vehicleType === 'moto' ? 'default' : p.vehicleType === 'auto' ? 'secondary' : 'outline'} className="text-xs gap-1 capitalize">
                        <VehicleIcon type={p.vehicleType} />{p.vehicleType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium">{p.brand} {p.model}</p>
                      <p className="text-xs text-muted-foreground">{p.yearRange}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{p.stock}</span>
                        {p.stock <= p.minStock && (
                          <Badge variant={p.stock === 0 ? 'destructive' : 'outline'} className={`text-xs ${p.stock > 0 ? 'border-yellow-500 text-yellow-600' : ''}`}>
                            {p.stock === 0 ? 'Sin stock' : 'Bajo'}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">${p.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => addToCart(p)} disabled={p.stock === 0}>
                        <ShoppingCart className="h-3 w-3" />Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="busqueda">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <Label className="text-xs">Tipo de Vehiculo</Label>
                  <Select value={vehicleFilter} onValueChange={v => setVehicleFilter(v as typeof vehicleFilter)}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="universal">Universal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Marca</Label>
                  <Select value={advSearch.brand} onValueChange={v => setAdvSearch(s => ({ ...s, brand: v }))}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar marca..." /></SelectTrigger>
                    <SelectContent>
                      {[...BRANDS_MOTO, ...BRANDS_AUTO, 'Universal'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Modelo (texto libre)</Label>
                  <Input placeholder="Ej: Corolla, CB150..." value={advSearch.model}
                    onChange={e => setAdvSearch(s => ({ ...s, model: e.target.value }))} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{filtered.length} repuesto(s) encontrado(s)</p>
              <div className="space-y-2">
                {filtered.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand} {p.model} · {p.yearRange} · <code>{p.sku}</code></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold">${p.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{p.stock} en stock</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => addToCart(p)} disabled={p.stock === 0}>
                        <ShoppingCart className="h-3 w-3" />Vender
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cart / Venta Dialog */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Venta de Repuestos</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {cart.map(({ part, qty }) => (
              <div key={part.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{part.name}</p>
                  <p className="text-xs text-muted-foreground">${part.price.toFixed(2)} c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                    onClick={() => setCart(prev => prev.map(c => c.part.id === part.id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0))}>-</Button>
                  <span className="text-sm font-bold w-4 text-center">{qty}</span>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                    onClick={() => setCart(prev => prev.map(c => c.part.id === part.id ? { ...c, qty: c.qty + 1 } : c))}>+</Button>
                  <span className="font-semibold text-sm w-14 text-right">${(part.price * qty).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Total</span><span className="text-primary">${cartTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full gap-2" onClick={() => { setCart([]); setCartOpen(false); }}>
              <ShoppingCart className="h-4 w-4" />Confirmar Venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
