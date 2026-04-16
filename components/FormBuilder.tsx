// components/FormBuilder.tsx
'use client';

import { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface FormBuilderProps {
  title: string;
  description?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel?: string;
  isLoading?: boolean;
  submitClassName?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function FormBuilder({
  title,
  description,
  onSubmit,
  children,
  submitLabel = 'Guardar',
  isLoading = false,
  submitClassName = 'bg-primary hover:bg-primary/90',
  cancelLabel,
  onCancel,
}: FormBuilderProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className={submitClassName}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                submitLabel
              )}
            </Button>
            {onCancel && cancelLabel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
