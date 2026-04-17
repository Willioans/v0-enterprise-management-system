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
import { Users, Dumbbell, Clock, AlertTriangle, Plus, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

interface Member {
  id: string; name: string; email: string; phone: string;
  plan: 'mensual' | 'trimestral' | 'anual';
  status: 'activo' | 'vencido' | 'suspendido';
  endDate: string; daysLeft: number;
  checkedInToday: boolean; totalVisits: number;
}

const INIT_MEMBERS: Member[] = [
  { id: '1', name: 'Carlos Ruiz', email: 'carlos@email.com', phone: '+54 11 1111-1111', plan: 'mensual', status: 'activo', endDate: '2025-04-30', daysLeft: 14, checkedInToday: true, totalVisits: 18 },
  { id: '2', name: 'Sofia Mendez', email: 'sofia@email.com', phone: '+54 11 2222-2222', plan: 'trimestral', status: 'activo', endDate: '2025-05-31', daysLeft: 45, checkedInToday: false, totalVisits: 32 },
  { id: '3', name: 'Diego Torres', email: 'diego@email.com', phone: '+54 11 3333-3333', plan: 'anual', status: 'activo', endDate: '2025-12-31', daysLeft: 258, checkedInToday: true, totalVisits: 87 },
  { id: '4', name: 'Valentina Cruz', email: 'vale@email.com', phone: '+54 11 4444-4444', plan: 'mensual', status: 'vencido', endDate: '2025-03-31', daysLeft: 0, checkedInToday: false, totalVisits: 12 },
  { id: '5', name: 'Martin Gomez', email: 'martin@email.com', phone: '+54 11 5555-5555', plan: 'trimestral', status: 'activo', endDate: '2025-04-30', daysLeft: 13, checkedInToday: false, totalVisits: 45 },
  { id: '6', name: 'Lucia Vera', email: 'lucia@email.com', phone: '+54 11 6666-6666', plan: 'mensual', status: 'activo', endDate: '2025-05-09', daysLeft: 22, checkedInToday: true, totalVisits: 5 },
];

const CLASSES = [
  { name: 'Yoga', time: '08:00 - 09:00', instructor: 'Ana Lopez', capacity: 20, enrolled: 18, level: 'Todos' },
  { name: 'Spinning', time: '09:30 - 10:30', instructor: 'Pedro Sosa', capacity: 15, enrolled: 15, level: 'Intermedio' },
  { name: 'CrossFit', time: '17:00 - 18:00', instructor: 'Luis Mora', capacity: 25, enrolled: 20, level: 'Avanzado' },
  { name: 'Pilates', time: '18:30 - 19:30', instructor: 'Carla Paz', capacity: 18, enrolled: 9, level: 'Principiante' },
  { name: 'Funcional', time: '07:00 - 08:00', instructor: 'Marcelo Gil', capacity: 20, enrolled: 14, level: 'Intermedio' },
];

const PLAN_PRICES: Record<string, number> = { mensual: 25, trimestral: 65, anual: 220 };
const INIT_FORM = { name: '', email: '', phone: '', plan: 'mensual' };

export function GymModule() {
  const [members, setMembers] = useState<Member[]>(INIT_MEMBERS);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(INIT_FORM);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );
  const activeCount = members.filter(m => m.status === 'activo').length;
  const todayCheckins = members.filter(m => m.checkedInToday).length;
  const expiringSoon = members.filter(m => m.daysLeft > 0 && m.daysLeft <= 7).length;
  const monthlyRevenue = members.filter(m => m.status === 'activo').reduce((s, m) => s + PLAN_PRICES[m.plan], 0);

  const handleCheckIn = (id: string) => {
    setMembers(prev => prev.map(m =>
      m.id === id ? { ...m, checkedInToday: !m.checkedInToday, totalVisits: m.checkedInToday ? m.totalVisits - 1 : m.totalVisits + 1 } : m
    ));
  };

  const handleAdd = () => {
    const today = new Date();
    const end = new Date(today);
    if (form.plan === 'mensual') end.setMonth(end.getMonth() + 1);
    else if (form.plan === 'trimestral') end.setMonth(end.getMonth() + 3);
    else end.setFullYear(end.getFullYear() + 1);
    const daysLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setMembers(prev => [...prev, {
      id: String(Date.now()), name: form.name, email: form.email, phone: form.phone,
      plan: form.plan as Member['plan'], status: 'activo',
      endDate: end.toISOString().split('T')[0], daysLeft, checkedInToday: false, totalVisits: 0,
    }]);
    setAddOpen(false);
    setForm(INIT_FORM);
  };

  const initials = (n: string) => n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-primary" /><p className="text-xs text-muted-foreground">Miembros Activos</p></div>
          <p className="text-2xl font-bold">{activeCount}</p>
          <p className="text-xs text-muted-foreground">{members.length} total</p>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="h-4 w-4 text-green-500" /><p className="text-xs text-muted-foreground">Check-ins Hoy</p></div>
          <p className="text-2xl font-bold">{todayCheckins}</p>
          <p className="text-xs text-muted-foreground">{activeCount > 0 ? Math.round((todayCheckins / activeCount) * 100) : 0}% asistencia</p>
        </CardContent></Card>

        <Card className={expiringSoon > 0 ? 'border-yellow-500/50' : ''}><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className={`h-4 w-4 ${expiringSoon > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} /><p className="text-xs text-muted-foreground">Vencen pronto</p></div>
          <p className={`text-2xl font-bold ${expiringSoon > 0 ? 'text-yellow-600' : ''}`}>{expiringSoon}</p>
          <p className="text-xs text-muted-foreground">Proximos 7 dias</p>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-green-500" /><p className="text-xs text-muted-foreground">Ingresos Mes</p></div>
          <p className="text-2xl font-bold">${monthlyRevenue}</p>
          <p className="text-xs text-muted-foreground">Subscripciones activas</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="miembros">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="miembros">Miembros</TabsTrigger>
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
            <TabsTrigger value="clases">Clases</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Input placeholder="Buscar miembro..." className="h-9 w-48 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Nuevo Miembro</Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Registrar Miembro</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {[['Nombre completo', 'name'], ['Email', 'email'], ['Telefono', 'phone']].map(([label, key]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input className="h-8" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-xs">Plan</Label>
                    <Select value={form.plan} onValueChange={v => setForm(f => ({ ...f, plan: v }))}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensual">Mensual - $25/mes</SelectItem>
                        <SelectItem value="trimestral">Trimestral - $65/3 meses</SelectItem>
                        <SelectItem value="anual">Anual - $220/ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    Total a cobrar: <span className="font-bold text-primary">${PLAN_PRICES[form.plan]}</span>
                  </div>
                  <Button className="w-full" onClick={handleAdd} disabled={!form.name || !form.email}>Registrar y Cobrar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="miembros">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials(m.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="capitalize text-xs">{m.plan}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={m.status === 'activo' ? 'default' : 'destructive'} className="capitalize text-xs">{m.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">{m.endDate}</p>
                      {m.daysLeft > 0 && m.daysLeft <= 14 && (
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600 mt-0.5">{m.daysLeft}d restantes</Badge>
                      )}
                    </TableCell>
                    <TableCell><span className="font-semibold">{m.totalVisits}</span></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Renovar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="checkin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {members.filter(m => m.status === 'activo').map(m => (
              <Card key={m.id} className={m.checkedInToday ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20' : ''}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`text-sm font-bold ${m.checkedInToday ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        {initials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{m.plan} · {m.totalVisits} visitas</p>
                    </div>
                  </div>
                  <Button
                    variant={m.checkedInToday ? 'default' : 'outline'} size="sm"
                    className={`gap-1 ${m.checkedInToday ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    onClick={() => handleCheckIn(m.id)}
                  >
                    {m.checkedInToday ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {m.checkedInToday ? 'Ingresado' : 'Marcar'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clases">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLASSES.map(c => {
              const pct = Math.round((c.enrolled / c.capacity) * 100);
              const full = c.enrolled >= c.capacity;
              return (
                <Card key={c.name}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.instructor}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs"><Clock className="h-3 w-3 mr-1" />{c.time}</Badge>
                        <Badge variant="secondary" className="text-xs">{c.level}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Capacidad</span>
                        <span className={`font-semibold ${full ? 'text-destructive' : ''}`}>{c.enrolled}/{c.capacity}</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                    <Button size="sm" variant={full ? 'secondary' : 'outline'} className="w-full mt-3" disabled={full}>
                      {full ? 'Clase Llena' : 'Inscribir Miembro'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
