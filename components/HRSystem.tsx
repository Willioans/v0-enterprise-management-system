'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Users, CheckCircle } from 'lucide-react';

const employees = [
  { id: '1', name: 'Juan Pérez', role: 'Gerente', department: 'Ventas', status: 'active', salary: 3500 },
  { id: '2', name: 'María García', role: 'Asistente', department: 'Admin', status: 'active', salary: 2000 },
  { id: '3', name: 'Carlos López', role: 'Especialista', department: 'IT', status: 'on_leave', salary: 2800 },
  { id: '4', name: 'Ana Martínez', role: 'Cajero', department: 'Ventas', status: 'active', salary: 1800 },
];

const attendanceData = [
  { employee: 'Juan Pérez', present: 22, absent: 1, late: 2 },
  { employee: 'María García', present: 23, absent: 0, late: 1 },
  { employee: 'Carlos López', present: 20, absent: 3, late: 1 },
  { employee: 'Ana Martínez', present: 22, absent: 0, late: 2 },
];

export function HRSystem() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="attendance">Asistencia</TabsTrigger>
          <TabsTrigger value="payroll">Nómina</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Empleados</CardTitle>
              <CardDescription>{employees.length} empleados activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <Button>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Empleado
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                      <th className="text-left py-3 px-4 font-semibold">Rol</th>
                      <th className="text-left py-3 px-4 font-semibold">Departamento</th>
                      <th className="text-left py-3 px-4 font-semibold">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold">Salario</th>
                      <th className="text-right py-3 px-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{emp.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{emp.role}</td>
                        <td className="py-3 px-4">{emp.department}</td>
                        <td className="py-3 px-4">
                          <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                            {emp.status === 'active' ? 'Activo' : 'Permiso'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold">${emp.salary}</td>
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

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Asistencia</CardTitle>
              <CardDescription>Mes actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceData.map((record, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <p className="font-semibold mb-3">{record.employee}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-xs text-muted-foreground">Presentes</p>
                          <p className="font-bold">{record.present}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-xs text-muted-foreground">Llegadas Tarde</p>
                          <p className="font-bold">{record.late}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-red-500 mr-2" />
                        <div>
                          <p className="text-xs text-muted-foreground">Ausentes</p>
                          <p className="font-bold">{record.absent}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nómina del Mes</CardTitle>
              <CardDescription>Junio 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-semibold text-sm">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${emp.salary}</p>
                      <Button size="sm" variant="ghost">
                        Procesar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg flex justify-between items-center">
                <span className="font-semibold">Total Nómina:</span>
                <span className="text-lg font-bold">${employees.reduce((sum, e) => sum + e.salary, 0)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
