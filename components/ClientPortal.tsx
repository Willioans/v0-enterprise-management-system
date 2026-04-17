'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ShoppingBag, Star, Gift, Ticket, Clock, CheckCircle2,
  Package, Truck, CreditCard, Bell, Edit2, Phone, Mail, MapPin
} from 'lucide-react';

const CLIENT = {
  name: 'Alejandro Gomez', email: 'alejandro@email.com', phone: '+54 11 9876-5432',
  address: 'Av. Corrientes 1234, Buenos Aires', memberSince: 'Enero 2023',
  membership: 'Premium Plus', points: 2480, nextLevelPoints: 3000,
  totalSpent: 12850, ordersCount: 47,
};

const ORDERS = [
  { id: 'ORD-2025-089', date: '2025-04-14', items: ['Camisa Polo Azul x2', 'Gorra Deportiva'], total: 89.99, status: 'entregado' },
  { id: 'ORD-2025-076', date: '2025-04-08', items: ['Zapatillas Running'], total: 89.99, status: 'en_camino' },
  { id: 'ORD-2025-061', date: '2025-03-30', items: ['Mochila Premium', 'Medias Pack x3'], total: 57.50, status: 'entregado' },
  { id: 'ORD-2025-048', date: '2025-03-22', items: ['Chaleco Polar'], total: 65.00, status: 'entregado' },
  { id: 'ORD-2025-031', date: '2025-03-10', items: ['Pantalon Casual x2', 'Camiseta Basica x3'], total: 176.00, status: 'entregado' },
];

const BENEFITS = [
  { icon: Gift, title: '20% de descuento', desc: 'En todos los productos seleccionados', active: true },
  { icon: Truck, title: 'Envio gratis', desc: 'En compras mayores a $50', active: true },
  { icon: Star, title: 'Doble puntos', desc: 'Los viernes en todas las compras', active: true },
  { icon: Ticket, title: 'Acceso anticipado', desc: 'A ofertas y lanzamientos exclusivos', active: true },
  { icon: Bell, title: 'Soporte prioritario', desc: 'Atencion preferencial 24/7', active: false },
];

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; icon: typeof CheckCircle2 }> = {
  entregado: { label: 'Entregado', variant: 'default', icon: CheckCircle2 },
  en_camino: { label: 'En camino', variant: 'secondary', icon: Truck },
  procesando: { label: 'Procesando', variant: 'outline', icon: Clock },
};

export function ClientPortal() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: CLIENT.name, email: CLIENT.email, phone: CLIENT.phone, address: CLIENT.address });
  const pointsPct = Math.round((CLIENT.points / CLIENT.nextLevelPoints) * 100);

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                  {CLIENT.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{CLIENT.name}</h2>
                  <Badge className="bg-primary text-primary-foreground">{CLIENT.membership}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Cliente desde {CLIENT.memberSince}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span><span className="font-bold">{CLIENT.ordersCount}</span> <span className="text-muted-foreground">pedidos</span></span>
                  <span><span className="font-bold">${CLIENT.totalSpent.toLocaleString()}</span> <span className="text-muted-foreground">gastados</span></span>
                </div>
              </div>
            </div>
            <div className="md:ml-auto flex flex-col justify-center gap-2 min-w-48">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /><span className="font-bold">{CLIENT.points.toLocaleString()}</span> puntos</span>
                <span className="text-muted-foreground text-xs">{CLIENT.nextLevelPoints.toLocaleString()} para VIP</span>
              </div>
              <Progress value={pointsPct} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">Faltan {(CLIENT.nextLevelPoints - CLIENT.points).toLocaleString()} puntos para VIP Gold</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pedidos">
        <TabsList>
          <TabsTrigger value="pedidos">Mis Pedidos</TabsTrigger>
          <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
          <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="space-y-3 mt-4">
          {ORDERS.map(order => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.procesando;
            const Icon = cfg.icon;
            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{order.id}</p>
                          <Badge variant={cfg.variant} className="text-xs gap-1">
                            <Icon className="h-3 w-3" />{cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                        <p className="text-xs text-muted-foreground">{order.items.join(' · ')}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold">${order.total.toFixed(2)}</p>
                      {order.status === 'entregado' && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs mt-1">Recomprar</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="beneficios" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BENEFITS.map(({ icon: Icon, title, desc, active }) => (
              <Card key={title} className={!active ? 'opacity-50' : ''}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{title}</p>
                      {!active && <Badge variant="outline" className="text-xs">Pronto</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-4 border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">Saldo de Puntos</p>
                <p className="text-3xl font-bold text-primary">{CLIENT.points.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">pts</span></p>
                <p className="text-xs text-muted-foreground">Equivale a ${(CLIENT.points * 0.01).toFixed(2)} de descuento</p>
              </div>
              <Button>Canjear Puntos</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfil" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Datos Personales</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
                  <Edit2 className="h-4 w-4 mr-1" />{editing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Nombre', key: 'name', icon: null },
                { label: 'Email', key: 'email', icon: Mail },
                { label: 'Telefono', key: 'phone', icon: Phone },
                { label: 'Direccion', key: 'address', icon: MapPin },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  {editing ? (
                    <Input className="h-9" value={(profile as any)[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                  ) : (
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                      <p className="font-medium text-sm">{(profile as any)[key]}</p>
                    </div>
                  )}
                </div>
              ))}
              {editing && (
                <Button className="w-full" onClick={() => setEditing(false)}>Guardar Cambios</Button>
              )}
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Membresia</p>
                  <p className="font-semibold">{CLIENT.membership}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cliente desde</p>
                  <p className="font-semibold">{CLIENT.memberSince}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total pedidos</p>
                  <p className="font-semibold">{CLIENT.ordersCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total gastado</p>
                  <p className="font-semibold">${CLIENT.totalSpent.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 text-sm gap-1"><CreditCard className="h-4 w-4" />Metodos de Pago</Button>
                <Button variant="outline" className="flex-1 text-sm gap-1"><Bell className="h-4 w-4" />Notificaciones</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
