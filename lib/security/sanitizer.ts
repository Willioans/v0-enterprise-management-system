/**
 * Data Sanitization and Security Module
 * Protege datos sensibles de exposición en logs y errores
 */

// Lista de campos sensibles que no deben exponerse
const SENSITIVE_FIELDS = [
  'password',
  'apiKey',
  'apiSecret',
  'token',
  'refreshToken',
  'accessToken',
  'secretKey',
  'privateKey',
  'authToken',
  'sessionId',
  'creditCard',
  'cvv',
  'ssn',
  'documentId',
];

/**
 * Sanitiza un objeto eliminando campos sensibles
 */
export function sanitizeObject(obj: any, depth = 0): any {
  if (depth > 10) return '[REDACTED - DEPTH LIMIT]';
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (isSensitiveField(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(value, depth + 1);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Verifica si un campo es sensible
 */
function isSensitiveField(fieldName: string): boolean {
  const lowerName = fieldName.toLowerCase();
  return SENSITIVE_FIELDS.some(sensitive => 
    lowerName.includes(sensitive) || sensitive.includes(lowerName)
  );
}

/**
 * Sanitiza strings que podrían contener datos sensibles
 */
function sanitizeString(str: string): string {
  // No expone URLs con tokens
  if (str.includes('token=') || str.includes('key=')) {
    return '[REDACTED URL]';
  }
  return str;
}

/**
 * Extrae información segura de un error
 */
export function sanitizeError(error: any): {
  message: string;
  code?: string;
  timestamp: string;
} {
  return {
    message: error?.message || 'Unknown error',
    code: error?.code,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Middleware para registrar solicitudes sin exponer datos sensibles
 */
export function logSafeRequest(method: string, url: string, data?: any) {
  const sanitizedData = data ? sanitizeObject(data) : undefined;
  console.log(`[API] ${method} ${url}`, sanitizedData);
}

/**
 * Valida que no haya credenciales en strings
 */
export function validateNoCredentials(str: string): boolean {
  const credentialPatterns = [
    /apikey[=:]/i,
    /api_key[=:]/i,
    /secret[=:]/i,
    /password[=:]/i,
    /token[=:]/i,
    /bearer\s+[a-z0-9]+/i,
  ];
  
  return !credentialPatterns.some(pattern => pattern.test(str));
}
