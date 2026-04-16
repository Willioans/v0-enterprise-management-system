// lib/services/auditService.ts
import { collection, doc, setDoc, query, where, getDocs } from '@firebase/firestore';
import { db } from '../firebase';
import { AuditLog } from '../schemas';

export class AuditService {
  /**
   * Registrar una actividad en el log de auditoría
   */
  static async logActivity(
    organizationId: string,
    userId: string,
    action: string,
    module: string,
    entityId: string,
    changes?: Record<string, any>,
    ipAddress?: string
  ): Promise<void> {
    try {
      const logId = doc(collection(db, 'auditLogs')).id;
      const auditLog: AuditLog = {
        id: logId,
        organizationId,
        userId,
        action,
        module,
        entityId,
        changes,
        ipAddress,
        timestamp: new Date(),
      };

      await setDoc(doc(db, 'auditLogs', logId), auditLog);
    } catch (error) {
      console.error('Failed to log activity:', error);
      // No lanzar error para no afectar la operación principal
    }
  }

  /**
   * Obtener logs de auditoría de una organización
   */
  static async getAuditLogs(
    organizationId: string,
    limit: number = 100
  ): Promise<AuditLog[]> {
    try {
      const q = query(
        collection(db, 'auditLogs'),
        where('organizationId', '==', organizationId)
      );
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs
        .map((doc) => doc.data() as AuditLog)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return logs;
    } catch (error) {
      throw new Error(`Failed to fetch audit logs: ${error}`);
    }
  }

  /**
   * Obtener logs de auditoría de un usuario específico
   */
  static async getUserAuditLogs(
    organizationId: string,
    userId: string,
    limit: number = 50
  ): Promise<AuditLog[]> {
    try {
      const q = query(
        collection(db, 'auditLogs'),
        where('organizationId', '==', organizationId),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs
        .map((doc) => doc.data() as AuditLog)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return logs;
    } catch (error) {
      throw new Error(`Failed to fetch user audit logs: ${error}`);
    }
  }

  /**
   * Obtener logs de auditoría de un módulo específico
   */
  static async getModuleAuditLogs(
    organizationId: string,
    module: string,
    limit: number = 50
  ): Promise<AuditLog[]> {
    try {
      const q = query(
        collection(db, 'auditLogs'),
        where('organizationId', '==', organizationId),
        where('module', '==', module)
      );
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs
        .map((doc) => doc.data() as AuditLog)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return logs;
    } catch (error) {
      throw new Error(`Failed to fetch module audit logs: ${error}`);
    }
  }

  /**
   * Crear resumen de actividades por tipo
   */
  static async getActivitySummary(
    organizationId: string,
    days: number = 7
  ): Promise<Record<string, number>> {
    try {
      const allLogs = await this.getAuditLogs(organizationId, 1000);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const summary: Record<string, number> = {};

      allLogs.forEach((log) => {
        if (log.timestamp >= cutoffDate) {
          summary[log.action] = (summary[log.action] || 0) + 1;
        }
      });

      return summary;
    } catch (error) {
      throw new Error(`Failed to get activity summary: ${error}`);
    }
  }
}
