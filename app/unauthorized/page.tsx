// app/unauthorized/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
            <CardDescription>No tienes permisos para acceder a esta sección</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Tu rol actual no tiene los permisos necesarios para acceder a este recurso. 
              Por favor, contacta con el administrador de tu organización.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Volver al Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/auth/logout')}
                className="w-full"
              >
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
