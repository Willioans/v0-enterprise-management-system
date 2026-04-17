'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PanelLayout } from '@/components/PanelLayout';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Building2, Users, Package2, DollarSign, Plus, Edit,
  CheckSquare, ChevronRight, BarChart3, Download, MapPin,
  Phone, Mail, AlertCircle, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const BRANCHES = [
  { id: '1', name: 'Sucursal Principal', address: 'Av. Principal 123, Centro', phone: '+54 11 4444-1111', manager: 'Carlos Rodriguez', employees: 8, status: 'activa' },
  { id: '2', name: 'Sucursal Centro', address: 'Calle Centro 456, Ciudad', phone: '+54 11 4444-2222', manager: 'Maria Garcia', employees: 7, status: 'activa' },
];

const EMPLOYEES_LIST = [
  { id: '1', name: 'Carlos Rodriguez', role: 'Gerente de Ventas', dept: 'Ventas', status: 'activo', since: '2022-03-01' },
  { id: '2', name: 'Maria Garcia', role: 'Cajera', dept: 'Operaciones', status: 'activo', since: '2023-01-15' },
  { id: '3', name: 'Juan Lopez', role: 'Jefe de Inventario', dept: 'Logistica', status: 'activo', since: '2022-07-20' },
  { id: '4', name: 'Sofia Perez', role: 'Vendedora', dept: 'Ventas', status: 'activo', since: '2023-06-01' },
  { id: '5', name: 'Roberto Diaz', role: 'Contador', dept: 'Finanzas', status: 'activo', since: '2022-11-05' },
];

const TASKS = [
  { id: '1', text: 'Revisar inventario bajo en stock', done: false, priority: 'alta' },
  { id: '2', text: 'Procesar nomina mensual', done: false, priority: 'alta' },
  { id: '3', text: 'Enviar reportes al contador', done: true, priority: 'media' },
  { id: '4', text: 'Reunion con proveedor Textiles SA', done: false, priority: 'media' },
  { id: '5', text: 'Actualizar precios temporada', done: true, priority: 'baja' },
];

const MONTHLY_DATA = [
  { mes: 'Nov', ventas: 38000, gastos: 24000 },
  { mes: 'Dic', ventas: 55000, gastos: 30000 },
  { mes: 'Ene', ventas: 32000, gastos: 22000 },
  { mes: 'Feb', ventas: 41000, gastos: 25000 },
  { mes: 'Mar', ventas: 48000, gastos: 27000 },
  { mes: 'Abr', ventas: 45000, gastos: 26000 },
];

const QUICK_LINKS = [
  { label: 'Ir a POS', href: '/panels/pos', icon: DollarSign, color: 'text-emerald-600' },
  { label: 'Ver Inventario', href: '/panels/inventory', icon: Package2, color: 'text-amber-600' },
  { label: 'Panel Financiero', href: '/panels/financial', icon: BarChart3, color: 'text-violet-600' },
  { label: 'Gestion RRHH', href: '/panels/hr', icon: Users, color: 'text-rose-600' },
];

export default function AdminPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState(TASKS);
  const [newBranchOpen, setNewBranchOpen] = useState(false);
  const [newBranchForm, setNewBranchForm] = useState({ name: '', address: '', phone: '', manager: '' });
  const [branches, setBranches] = useState(BRANCHES);

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const handleAddBranch = () => {
    setBranches(prev => [...prev, {
      id: String(Date.now()), ...newBranchForm,
      employees: 0, status: 'activa',
    }]);
    setNewBranchOpen(false);
    setNewBranchForm({ name: '', address: '', phone: '', manager: '' });
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <PanelLayout
      title="Panel Administrador"
      subtitle="Gestion completa de tu empresa, sucursales y operaciones"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin Negocio' }]}
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Sucursales" value={branches.length} icon={<Building2 className="h-5 w-5" />} description="Activas" />
        <StatCard title="Empleados" value={EMPLOYEES_LIST.length} icon={<Users className="h-5 w-5" />} description="En plantilla" />
        <StatCard title="Productos" value="240" icon={<Package2 className="h-5 w-5" />} description="En stock" />
        <StatCard title="Ventas del Mes" value="$45,000" icon={<DollarSign className="h-5 w-5" />} trend={{ value: 12, direction: 'up' }} />
      </div>

      <Tabs defaultValue="resumen">
        <TabsList className="mb-6">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="sucursales">Sucursales</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        {/* RESUMEN */}
        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />Ventas vs Gastos (6 meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />Tareas Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${task.done ? 'opacity-50 bg-muted/30' : 'bg-muted/50 hover:bg-muted'}`}
                    onClick={() => toggleTask(task.id)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${task.done ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                      {task.done && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.done ? 'line-through' : ''}`}>{task.text}</p>
                      <Badge variant={task.priority === 'alta' ? 'destructive' : task.priority === 'media' ? 'secondary' : 'outline'}
                        className="text-xs mt-0.5">{task.priority}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acceso Rapido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {QUICK_LINKS.map(({ label, href, icon: Icon, color }) => (
                  <button key={href} onClick={() => router.push(href)}
                    className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted transition-colors text-left group">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-sm font-medium">{label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUCURSALES */}
        <TabsContent value="sucursales" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={newBranchOpen} onOpenChange={setNewBranchOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-1" />Nueva Sucursal</Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Agregar Sucursal</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {[['Nombre', 'name'], ['Direccion', 'address'], ['Telefono', 'phone'], ['Gerente', 'manager']].map(([label, key]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input className="h-8" value={(newBranchForm as any)[key]}
                        onChange={e => setNewBranchForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <Button className="w-full" onClick={handleAddBranch} disabled={!newBranchForm.name}>Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map(b => (
              <Card key={b.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{b.name}</CardTitle>
                        <Badge variant="default" className="text-xs mt-0.5 capitalize">{b.status}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" /><span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" /><span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" /><span>{b.manager} · {b.employees} empleados</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* EMPLEADOS */}
        <TabsContent value="empleados" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EMPLOYEES_LIST.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials(e.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{e.dept}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="text-xs capitalize">{e.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.since}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => router.push('/panels/hr')}>
                        Ver en RRHH
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* REPORTES */}
        <TabsContent value="reportes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ventas por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reportes Disponibles</CardTitle>
                <CardDescription>Descarga y exporta informes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  ['Reporte de Ventas', 'Ventas mensual y anual'],
                  ['Reporte Financiero', 'Balance y estado de resultados'],
                  ['Reporte de Inventario', 'Stock actual y movimientos'],
                  ['Reporte de RRHH', 'Asistencias y nomina'],
                ].map(([name, desc]) => (
                  <div key={name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1 h-8">
                      <Download className="h-3.5 w-3.5" />PDF
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PanelLayout>
  );
}
