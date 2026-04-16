'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Company, companyManagementService } from '@/lib/services/companyManagementService';
import { toast } from 'sonner';
import { MoreVertical } from 'lucide-react';

interface CompanyListManagerProps {
  companies: Company[];
  onActionComplete?: () => void;
}

export function CompanyListManager(props: CompanyListManagerProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const getStatusColor = (status: Company['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSuspend = async (companyId: string) => {
    try {
      setLoading(companyId);
      await companyManagementService.suspendCompany(companyId, 'Suspensión manual', 'super-admin');
      toast.success('Empresa suspendida');
      props.onActionComplete?.();
    } catch (error) {
      toast.error('Error al suspender empresa');
    } finally {
      setLoading(null);
    }
  };

  const handleActivate = async (companyId: string) => {
    try {
      setLoading(companyId);
      await companyManagementService.activateCompany(companyId, 'super-admin');
      toast.success('Empresa activada');
      props.onActionComplete?.();
    } catch (error) {
      toast.error('Error al activar empresa');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Empresas</CardTitle>
        <CardDescription>{props.companies.length} empresas en total</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Plan</th>
                <th className="text-left py-3 px-4 font-semibold">Estado</th>
                <th className="text-left py-3 px-4 font-semibold">Usuarios</th>
                <th className="text-right py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {props.companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{company.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{company.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="capitalize">
                      {company.subscription.plan}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{company.subscription.maxUsers}</td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleSuspend(company.id)}
                          disabled={loading === company.id}
                          className="text-destructive"
                        >
                          Suspender
                        </DropdownMenuItem>
                        {company.status === 'suspended' && (
                          <DropdownMenuItem
                            onClick={() => handleActivate(company.id)}
                            disabled={loading === company.id}
                          >
                            Activar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
