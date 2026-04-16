// lib/auth/useProtectedRoute.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { UserRole } from '../schemas';
import { AuthMiddleware } from './middleware';

interface UseProtectedRouteProps {
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  redirectTo?: string;
}

export function useProtectedRoute({
  requiredRoles,
  requiredPermissions,
  redirectTo = '/auth/login',
}: UseProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check if user has required roles
    if (requiredRoles && user) {
      const hasRequiredRole = AuthMiddleware.requireRole(...requiredRoles)(user.role);
      if (!hasRequiredRole) {
        router.push('/unauthorized');
        return;
      }
    }

    // Check if user has required permissions
    if (requiredPermissions && user) {
      const permissions = AuthMiddleware.getPermissionsByRole(user.role);
      const hasAllPermissions = requiredPermissions.every((perm) =>
        permissions.includes(perm)
      );
      if (!hasAllPermissions) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRoles, requiredPermissions, redirectTo, router]);

  return {
    isLoading,
    isAuthenticated,
    user,
    canAccess: isAuthenticated && !isLoading,
  };
}
