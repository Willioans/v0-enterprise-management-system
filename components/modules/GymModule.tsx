'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Calendar, Dumbbell } from 'lucide-react';

const members = [
  { id: '1', name: 'Juan Pérez', plan: 'Premium', joinDate: '2024-01-10', status: 'active', weight: 75, height: 180 },
  { id: '2', name: 'María García', plan: 'Basic', joinDate: '2024-03-15', status: 'active', weight: 62, height: 165 },
  { id: '3', name: 'Carlos López', plan: 'Premium', joinDate: '2023-11-20', status: 'inactive', weight: 80, height: 178 },
];

const classes = [
  { id: '1', name: 'Yoga', time: '08:00 - 09:00', instructor: 'Ana', capacity: 20, enrolled: 18 },
  { id: '2', name: 'Spinning', time: '09:30 - 10:30', instructor: 'Pedro', capacity: 15, enrolled: 15 },
  { id: '3', name: 'CrossFit', time: '17:00 - 18:00', instructor: 'Luis', capacity: 25, enrolled: 20 },
];

export function GymModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter((m) => m.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">De {members.length} total</p>
            <Users className="w-4 h-4 text-primary mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Retención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Mes anterior: 88%</p>
            <TrendingUp className="w-4 h-4 text-green-500 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clases Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Diarias y semanales</p>
            <Calendar className="w-4 h-4 text-primary mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Gestión de Miembros</TabsTrigger>
          <TabsTrigger value="classes">Clases y Horarios</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Miembros del Gimnasio</CardTitle>
              <CardDescription>Control de asistencia y medidas corporales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold">Peso</th>
                      <th className="text-left py-3 px-4 font-semibold">Estado</th>
                      <th className="text-right py-3 px-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{member.name}</td>
                        <td className="py-3 px-4">{member.plan}</td>
                        <td className="py-3 px-4">{member.weight} kg</td>
                        <td className="py-3 px-4">
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clases del Día</CardTitle>
              <CardDescription>Horarios y capacidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        {classItem.name}
                      </h3>
                      <Badge variant="outline">{classItem.time}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Instructor: {classItem.instructor}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${(classItem.enrolled / classItem.capacity) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">
                        {classItem.enrolled}/{classItem.capacity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
