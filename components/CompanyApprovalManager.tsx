'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { companyManagementService, Company } from '@/lib/services/companyManagementService';
import { toast } from 'sonner';

interface CompanyApprovalManagerProps {
  pendingCompanies: Company[];
  onApprovalComplete?: () => void;
}

export function CompanyApprovalManager(props: CompanyApprovalManagerProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (companyId: string) => {
    try {
      setLoading(companyId);
      await companyManagementService.approveCompany(companyId, 'super-admin');
      toast.success('Empresa aprobada exitosamente');
      props.onApprovalComplete?.();
    } catch (error) {
      toast.error('Error al aprobar empresa');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (companyId: string) => {
    try {
      setLoading(companyId);
      await companyManagementService.rejectCompany(companyId, 'Rechazado por Super Admin', 'super-admin');
      toast.success('Empresa rechazada');
      props.onApprovalComplete?.();
    } catch (error) {
      toast.error('Error al rechazar empresa');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  if (props.pendingCompanies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
          <CardDescription>No hay empresas pendientes de aprobación</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Solicitudes</CardTitle>
        <CardDescription>{props.pendingCompanies.length} empresas esperando aprobación</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {props.pendingCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{company.name}</h3>
                <p className="text-sm text-muted-foreground">{company.email}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline">{company.country}</Badge>
                  <Badge variant="secondary">{company.settings.currency}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(company.id)}
                  disabled={loading === company.id}
                >
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(company.id)}
                  disabled={loading === company.id}
                >
                  Aprobar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
