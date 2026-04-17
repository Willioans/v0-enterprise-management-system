'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, DollarSign, Plus, FileText, Download } from 'lucide-react';

const MONTHLY = [
  { mes: 'Nov', ingresos: 42000, gastos: 28000, utilidad: 14000 },
  { mes: 'Dic', ingresos: 58000, gastos: 32000, utilidad: 26000 },
  { mes: 'Ene', ingresos: 38000, gastos: 24000, utilidad: 14000 },
  { mes: 'Feb', ingresos: 45000, gastos: 26000, utilidad: 19000 },
  { mes: 'Mar', ingresos: 52000, gastos: 29000, utilidad: 23000 },
  { mes: 'Abr', ingresos: 61000, gastos: 31000, utilidad: 30000 },
];

const EXPENSE_CATS = [
  { name: 'Nomina', value: 45, color: '#3b82f6' },
  { name: 'Inventario', value: 28, color: '#10b981' },
  { name: 'Alquiler', value: 12, color: '#f59e0b' },
  { name: 'Marketing', value: 8, color: '#8b5cf6' },
  { name: 'Servicios', value: 7, color: '#ef4444' },
];

interface Transaction {
  id: string; date: string; description: string;
  category: string; type: 'ingreso' | 'gasto'; amount: number;
}

const INIT_TXN: Transaction[] = [
  { id: '1', date: '2025-04-16', description: 'Ventas del dia - POS', category: 'Ventas', type: 'ingreso', amount: 3240 },
  { id: '2', date: '2025-04-16', description: 'Compra inventario Textiles SA', category: 'Inventario', type: 'gasto', amount: 1800 },
  { id: '3', date: '2025-04-15', description: 'Pago alquiler local', category: 'Alquiler', type: 'gasto', amount: 950 },
  { id: '4', date: '2025-04-15', description: 'Servicio consultoria', category: 'Ingresos varios', type: 'ingreso', amount: 500 },
  { id: '5', date: '2025-04-14', description: 'Nomina quincenal', category: 'Nomina', type: 'gasto', amount: 5200 },
  { id: '6', date: '2025-04-14', description: 'Ventas online', category: 'Ventas', type: 'ingreso', amount: 1580 },
  { id: '7', date: '2025-04-13', description: 'Publicidad digital', category: 'Marketing', type: 'gasto', amount: 400 },
  { id: '8', date: '2025-04-12', description: 'Ventas del dia - POS', category: 'Ventas', type: 'ingreso', amount: 2910 },
];

const CATEGORIES = ['Ventas', 'Ingresos varios', 'Inventario', 'Nomina', 'Alquiler', 'Marketing', 'Servicios', 'Otros'];

export function FinancialSystem() {
  const [transactions, setTransactions] = useState<Transaction[]>(INIT_TXN);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'ingreso' | 'gasto'>('todos');
  const [form, setForm] = useState({ description: '', category: 'Ventas', type: 'ingreso', amount: '' });

  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
  const totalGastos = transactions.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
  const utilidad = totalIngresos - totalGastos;
  const margen = totalIngresos > 0 ? ((utilidad / totalIngresos) * 100).toFixed(1) : '0';

  const filtered = transactions.filter(t => filter === 'todos' || t.type === filter);

  const handleAdd = () => {
    setTransactions(prev => [{
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0],
      description: form.description,
      category: form.category,
      type: form.type as 'ingreso' | 'gasto',
      amount: Number(form.amount),
    }, ...prev]);
    setOpen(false);
    setForm({ description: '', category: 'Ventas', type: 'ingreso', amount: '' });
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ingresos del Mes', value: `$${totalIngresos.toLocaleString()}`, sub: '+18% vs mes ant.', icon: TrendingUp, good: true },
          { label: 'Gastos del Mes', value: `$${totalGastos.toLocaleString()}`, sub: '-3% vs mes ant.', icon: TrendingDown, good: false },
          { label: 'Utilidad Neta', value: `$${utilidad.toLocaleString()}`, sub: `Margen ${margen}%`, icon: DollarSign, good: true },
          { label: 'Efectivo en Caja', value: '$5,430', sub: 'Disponible hoy', icon: Wallet, good: true },
        ].map(({ label, value, sub, icon: Icon, good }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                  <p className={`text-xs mt-0.5 ${good ? 'text-green-600' : 'text-muted-foreground'}`}>{sub}</p>
                </div>
                <Icon className={`h-5 w-5 mt-1 ${good ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="resumen">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Exportar</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Nueva</Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Registrar Transaccion</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Tipo</Label>
                    <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingreso">Ingreso</SelectItem>
                        <SelectItem value="gasto">Gasto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Descripcion</Label>
                    <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Categoria</Label>
                    <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Monto ($)</Label>
                    <Input type="number" min={0} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleAdd} disabled={!form.description || !form.amount}>Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="resumen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Ingresos vs Gastos (6 meses)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={MONTHLY}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="utilidad" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Distribucion de Gastos</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={EXPENSE_CATS} dataKey="value" cx="50%" cy="50%" outerRadius={70} paddingAngle={2}>
                      {EXPENSE_CATS.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {EXPENSE_CATS.map(e => (
                    <div key={e.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
                        <span>{e.name}</span>
                      </div>
                      <span className="font-medium">{e.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transacciones">
          <Card>
            <div className="p-4 border-b flex items-center gap-2">
              {(['todos', 'ingreso', 'gasto'] as const).map(f => (
                <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'}
                  onClick={() => setFilter(f)} className="capitalize">{f}</Button>
              ))}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                    <TableCell className="text-sm font-medium">{t.description}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{t.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={t.type === 'ingreso' ? 'default' : 'destructive'} className="text-xs capitalize">{t.type}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold text-sm ${t.type === 'ingreso' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.type === 'ingreso' ? '+' : '-'}${t.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="reportes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Utilidad Mensual</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={MONTHLY}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="utilidad" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Estado de Resultados</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Ingresos Brutos', value: totalIngresos, positive: true },
                  { label: 'Costo de Ventas', value: -totalGastos * 0.45, positive: false },
                  { label: 'Utilidad Bruta', value: totalIngresos - totalGastos * 0.45, positive: true },
                  { label: 'Gastos Operativos', value: -totalGastos * 0.55, positive: false },
                  { label: 'Utilidad Neta', value: utilidad, positive: utilidad > 0 },
                ].map(({ label, value, positive }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm py-1.5">
                      <span className={label === 'Utilidad Neta' ? 'font-bold' : 'text-muted-foreground'}>{label}</span>
                      <span className={`font-semibold ${positive ? 'text-green-600' : 'text-red-500'} ${label === 'Utilidad Neta' ? 'text-base' : ''}`}>
                        {value < 0 ? '-' : ''}${Math.abs(value).toLocaleString()}
                      </span>
                    </div>
                    {label === 'Utilidad Bruta' && <Separator />}
                    {label === 'Gastos Operativos' && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
