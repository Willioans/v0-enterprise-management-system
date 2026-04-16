// lib/auth/middleware.ts
import { UserRole } from '../schemas';

export class AuthMiddleware {
  /**
   * Verifica si el usuario tiene el rol requerido
   */
  static requireRole(...roles: UserRole[]): (role: UserRole) => boolean {
    return (userRole: UserRole) => roles.includes(userRole);
  }

  /**
   * Verifica si el usuario tiene acceso a un módulo específico
   */
  static requireModule(requiredModule: string): (userModules: string[]) => boolean {
    return (userModules: string[]) => userModules.includes(requiredModule);
  }

  /**
   * Verifica múltiples permisos (AND logic)
   */
  static requireAll(...checks: boolean[]): boolean {
    return checks.every((check) => check === true);
  }

  /**
   * Verifica al menos uno de los permisos (OR logic)
   */
  static requireAny(...checks: boolean[]): boolean {
    return checks.some((check) => check === true);
  }

  /**
   * Obtiene permisos basados en el rol
   */
  static getPermissionsByRole(role: UserRole): string[] {
    const rolePermissions: Record<UserRole, string[]> = {
      [UserRole.SUPER_ADMIN]: [
        'view_all_organizations',
        'manage_users',
        'manage_subscriptions',
        'view_system_logs',
        'configure_global_settings',
        'access_super_admin_panel',
      ],
      [UserRole.ADMIN]: [
        'manage_organization',
        'manage_branches',
        'manage_employees',
        'manage_inventory',
        'manage_sales',
        'view_reports',
        'access_admin_panel',
      ],
      [UserRole.SALES]: [
        'create_sales',
        'view_products',
        'process_payments',
        'create_invoices',
        'view_sales_reports',
        'access_pos_panel',
      ],
      [UserRole.INVENTORY]: [
        'view_inventory',
        'manage_stock',
        'create_purchase_orders',
        'manage_suppliers',
        'view_inventory_reports',
        'access_inventory_panel',
      ],
      [UserRole.FINANCE]: [
        'view_financial_reports',
        'manage_accounts',
        'manage_expenses',
        'manage_invoices',
        'create_financial_statements',
        'access_finance_panel',
      ],
      [UserRole.HR]: [
        'manage_employees',
        'manage_attendance',
        'manage_payroll',
        'view_hr_reports',
        'manage_benefits',
        'access_hr_panel',
      ],
      [UserRole.CUSTOMER]: [
        'view_own_profile',
        'view_purchases',
        'view_orders',
        'update_profile',
        'access_customer_portal',
      ],
    };

    return rolePermissions[role] || [];
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   */
  static hasPermission(userRole: UserRole, permission: string): boolean {
    const permissions = this.getPermissionsByRole(userRole);
    return permissions.includes(permission);
  }
}
