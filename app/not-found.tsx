'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Página no encontrada</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-bold text-primary">404</div>
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe.
          </p>
          <Link href="/dashboard">
            <Button className="w-full">Volver al Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
