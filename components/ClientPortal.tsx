'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const clientData = {
  name: 'Cliente Premium',
  membersip: 'Premium Plus',
  joinDate: '2024-01-15',
  balance: 2500,
};

const purchases = [
  { id: '1', date: '2024-06-10', description: 'Compra de productos', amount: 150, status: 'completed' },
  { id: '2', date: '2024-06-08', description: 'Servicio premium', amount: 50, status: 'completed' },
  { id: '3', date: '2024-06-05', description: 'Compra de equipamiento', amount: 200, status: 'completed' },
];

export function ClientPortal() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-semibold">{clientData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membresía</p>
              <Badge className="mt-1">{clientData.membersip}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliente Desde</p>
              <p className="font-semibold">{clientData.joinDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Disponible</p>
              <p className="font-semibold text-lg text-primary">${clientData.balance}</p>
            </div>
          </div>
          <Button>Editar Perfil</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchases">Mis Compras</TabsTrigger>
          <TabsTrigger value="benefits">Beneficios</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Compras</CardTitle>
              <CardDescription>Tus transacciones recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-semibold text-sm">{purchase.description}</p>
                      <p className="text-xs text-muted-foreground">{purchase.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                        ${purchase.amount}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beneficios de Tu Membresía</CardTitle>
              <CardDescription>Acceso premium a todos los servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Acceso ilimitado a servicios</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Descuento del 20% en productos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Prioridad en atención al cliente</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Acceso a eventos exclusivos</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
