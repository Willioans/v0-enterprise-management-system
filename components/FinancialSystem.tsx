'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const financialData = [
  { month: 'Ene', income: 4000, expenses: 2400, profit: 1600 },
  { month: 'Feb', income: 5200, expenses: 2600, profit: 2600 },
  { month: 'Mar', income: 4800, expenses: 2800, profit: 2000 },
  { month: 'Abr', income: 6100, expenses: 3000, profit: 3100 },
  { month: 'May', income: 7200, expenses: 3200, profit: 4000 },
  { month: 'Jun', income: 8500, expenses: 3500, profit: 5000 },
];

const transactions = [
  { id: '1', type: 'income', description: 'Ventas del día', amount: 1500, date: '2024-06-16' },
  { id: '2', type: 'expense', description: 'Compra de inventario', amount: -800, date: '2024-06-16' },
  { id: '3', type: 'income', description: 'Servicio premium', amount: 500, date: '2024-06-15' },
  { id: '4', type: 'expense', description: 'Nómina de empleados', amount: -3200, date: '2024-06-15' },
];

export function FinancialSystem() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$36,200</div>
            <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
            <TrendingUp className="w-4 h-4 text-green-500 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$17,500</div>
            <p className="text-xs text-muted-foreground">-5% vs mes anterior</p>
            <TrendingDown className="w-4 h-4 text-green-500 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,700</div>
            <p className="text-xs text-muted-foreground">+22% vs mes anterior</p>
            <TrendingUp className="w-4 h-4 text-green-500 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efectivo en Caja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,430</div>
            <p className="text-xs text-muted-foreground">Disponible hoy</p>
            <Wallet className="w-4 h-4 text-primary mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos vs Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Últimas Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-semibold">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <Badge variant={tx.type === 'income' ? 'default' : 'destructive'}>
                      {tx.type === 'income' ? '+' : ''} ${Math.abs(tx.amount).toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ganancia Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
