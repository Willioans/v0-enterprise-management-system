'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Página no encontrada</p>
        <Link href="/dashboard">
          <Button>Volver al Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
