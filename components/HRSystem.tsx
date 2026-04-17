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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Clock, CheckCircle2, XCircle, Plus, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface Employee {
  id: string; name: string; role: string; department: string;
  status: 'activo' | 'permiso' | 'inactivo'; salary: number;
  email: string; phone: string; startDate: string;
  present: number; absent: number; late: number;
}

const INIT_EMP: Employee[] = [
  { id: '1', name: 'Juan Perez', role: 'Gerente General', department: 'Gerencia', status: 'activo', salary: 3500, email: 'juan@empresa.com', phone: '+54 11 1234-5678', startDate: '2022-01-15', present: 22, absent: 0, late: 1 },
  { id: '2', name: 'Maria Garcia', role: 'Administrativa', department: 'Administracion', status: 'activo', salary: 2000, email: 'maria@empresa.com', phone: '+54 11 2345-6789', startDate: '2022-06-01', present: 21, absent: 1, late: 2 },
  { id: '3', name: 'Carlos Lopez', role: 'Desarrollador', department: 'Tecnologia', status: 'permiso', salary: 2800, email: 'carlos@empresa.com', phone: '+54 11 3456-7890', startDate: '2023-03-10', present: 18, absent: 4, late: 1 },
  { id: '4', name: 'Ana Martinez', role: 'Vendedora', department: 'Ventas', status: 'activo', salary: 1800, email: 'ana@empresa.com', phone: '+54 11 4567-8901', startDate: '2023-08-20', present: 23, absent: 0, late: 0 },
  { id: '5', name: 'Roberto Silva', role: 'Contador', department: 'Finanzas', status: 'activo', salary: 2500, email: 'roberto@empresa.com', phone: '+54 11 5678-9012', startDate: '2022-11-05', present: 20, absent: 2, late: 2 },
  { id: '6', name: 'Laura Fernandez', role: 'Marketing', department: 'Marketing', status: 'activo', salary: 2200, email: 'laura@empresa.com', phone: '+54 11 6789-0123', startDate: '2024-01-08', present: 22, absent: 1, late: 1 },
];

const DEPARTMENTS = ['Gerencia', 'Administracion', 'Tecnologia', 'Ventas', 'Finanzas', 'Marketing', 'Recursos Humanos', 'Operaciones'];
const INIT_FORM = { name: '', role: '', department: 'Ventas', salary: '', email: '', phone: '', startDate: '' };

export function HRSystem() {
  const [employees, setEmployees] = useState<Employee[]>(INIT_EMP);
  const [addOpen, setAddOpen] = useState(false);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const [form, setForm] = useState(INIT_FORM);
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const activeCount = employees.filter(e => e.status === 'activo').length;

  const handleAdd = () => {
    setEmployees(prev => [...prev, {
      id: String(Date.now()), ...form,
      salary: Number(form.salary),
      status: 'activo',
      present: 0, absent: 0, late: 0,
    }]);
    setAddOpen(false);
    setForm(INIT_FORM);
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const attendancePct = (e: Employee) => {
    const total = e.present + e.absent + e.late;
    return total > 0 ? Math.round((e.present / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Empleados</p>
          <p className="text-2xl font-bold">{employees.length}</p>
          <p className="text-xs text-green-600 mt-0.5">{activeCount} activos</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Nomina Mensual</p>
          <p className="text-2xl font-bold">${totalSalary.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Pago directo</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Asistencia Promedio</p>
          <p className="text-2xl font-bold">94%</p>
          <p className="text-xs text-green-600 mt-0.5">+2% vs mes ant.</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">En Permiso</p>
          <p className="text-2xl font-bold">{employees.filter(e => e.status === 'permiso').length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Este mes</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="empleados">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="empleados">Empleados</TabsTrigger>
            <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
            <TabsTrigger value="nomina">Nomina</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Input placeholder="Buscar..." className="h-9 w-48 text-sm"
              value={search} onChange={e => setSearch(e.target.value)} />
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Agregar</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Nuevo Empleado</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Nombre completo', 'name'], ['Puesto / Rol', 'role'],
                    ['Salario mensual', 'salary'], ['Email', 'email'],
                    ['Telefono', 'phone'], ['Fecha de Ingreso', 'startDate'],
                  ].map(([label, key]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input className="h-8 text-sm" type={key === 'salary' ? 'number' : key === 'startDate' ? 'date' : 'text'}
                        value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs">Departamento</Label>
                    <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAdd} disabled={!form.name || !form.role} className="w-full mt-2">Guardar</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="empleados">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ingreso</TableHead>
                  <TableHead>Salario</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(e => (
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
                    <TableCell className="text-sm">{e.department}</TableCell>
                    <TableCell>
                      <Badge variant={e.status === 'activo' ? 'default' : e.status === 'permiso' ? 'secondary' : 'destructive'} className="text-xs capitalize">
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.startDate}</TableCell>
                    <TableCell className="font-semibold text-sm">${e.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setViewEmp(e)}>Ver</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="asistencia">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Presentes</TableHead>
                  <TableHead>Ausentes</TableHead>
                  <TableHead>Tarde</TableHead>
                  <TableHead className="w-40">Asistencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map(e => {
                  const pct = attendancePct(e);
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials(e.name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{e.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" /><span className="font-bold">{e.present}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-red-500">
                          <XCircle className="h-4 w-4" /><span className="font-bold">{e.absent}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Clock className="h-4 w-4" /><span className="font-bold">{e.late}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-2 flex-1" />
                          <span className="text-xs font-medium w-8 text-right">{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="nomina">
          <div className="space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Salario Base</TableHead>
                    <TableHead>Bonos</TableHead>
                    <TableHead>Deducciones</TableHead>
                    <TableHead className="text-right">Total Neto</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.filter(e => e.status === 'activo').map(e => {
                    const bono = e.present >= 22 ? e.salary * 0.05 : 0;
                    const deduccion = e.absent * (e.salary / 25);
                    const neto = e.salary + bono - deduccion;
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium text-sm">{e.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{e.department}</TableCell>
                        <TableCell className="text-sm">${e.salary.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-green-600">+${bono.toFixed(0)}</TableCell>
                        <TableCell className="text-sm text-red-500">-${deduccion.toFixed(0)}</TableCell>
                        <TableCell className="text-right font-bold">${neto.toFixed(0)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">Pendiente</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total a pagar este mes</p>
                  <p className="text-3xl font-bold text-primary">${totalSalary.toLocaleString()}</p>
                </div>
                <Button size="lg" className="gap-2">
                  <DollarSign className="h-5 w-5" />Procesar Nomina
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Employee Detail Dialog */}
      <Dialog open={!!viewEmp} onOpenChange={() => setViewEmp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Perfil del Empleado</DialogTitle></DialogHeader>
          {viewEmp && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">{initials(viewEmp.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{viewEmp.name}</p>
                  <p className="text-sm text-muted-foreground">{viewEmp.role}</p>
                  <Badge variant={viewEmp.status === 'activo' ? 'default' : 'secondary'} className="text-xs mt-1 capitalize">{viewEmp.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Departamento', viewEmp.department],
                  ['Salario', `$${viewEmp.salary.toLocaleString()}`],
                  ['Email', viewEmp.email],
                  ['Telefono', viewEmp.phone],
                  ['Ingreso', viewEmp.startDate],
                  ['Asistencia', `${attendancePct(viewEmp)}%`],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
