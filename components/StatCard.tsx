// components/StatCard.tsx
'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  description,
  className = '',
}: StatCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <div className="text-accent">{icon}</div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
