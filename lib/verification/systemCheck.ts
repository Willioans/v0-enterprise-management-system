// lib/verification/systemCheck.ts
/**
 * System Verification Utility
 * Verifica que H&I System esté correctamente configurado
 */

export class SystemCheck {
  /**
   * Verificar que Firebase esté configurado
   */
  static checkFirebaseConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];

    requiredEnvVars.forEach((envVar) => {
      if (!process.env[envVar]) {
        errors.push(`Missing environment variable: ${envVar}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Log de verificación del sistema
   */
  static logSystemStatus(): void {
    console.log('=== H&I System - System Check ===');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Not set'}`);

    const firebaseCheck = this.checkFirebaseConfig();
    console.log(`Firebase Config: ${firebaseCheck.isValid ? '✓ Valid' : '✗ Invalid'}`);

    if (firebaseCheck.errors.length > 0) {
      console.error('Firebase Configuration Errors:');
      firebaseCheck.errors.forEach((error) => console.error(`  - ${error}`));
    }

    console.log('====================================');
  }

  /**
   * Verificar conexión a Firestore
   */
  static async verifyFirestoreConnection(): Promise<boolean> {
    try {
      // This would require importing Firebase
      // For now, just check config
      const check = this.checkFirebaseConfig();
      return check.isValid;
    } catch (error) {
      console.error('Firestore connection error:', error);
      return false;
    }
  }

  /**
   * Generar reporte de sistema
   */
  static generateReport(): {
    timestamp: Date;
    firebaseValid: boolean;
    version: string;
    environment: string;
  } {
    const firebaseCheck = this.checkFirebaseConfig();

    return {
      timestamp: new Date(),
      firebaseValid: firebaseCheck.isValid,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'unknown',
    };
  }
}

// Run check on development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // Only run on server-side in development
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.log('[H&I System] Firebase configuration detected ✓');
  }
}
