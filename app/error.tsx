'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold">Error</h1>
        <p className="text-muted-foreground">{error.message || 'Algo salió mal'}</p>
        <Button onClick={() => reset()}>Intentar de nuevo</Button>
      </div>
    </div>
  );
}
