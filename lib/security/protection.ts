/**
 * Rate Limiting y Protección contra Ataques
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_REQUESTS_PER_MINUTE = 100;
const MAX_REQUESTS_PER_HOUR = 1000;

/**
 * Verifica rate limit por IP/Usuario
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / 60000)}`;
  
  const entry = rateLimitMap.get(key) || { count: 0, resetTime: now + 60000 };
  
  // Limpiar entradas antiguas
  if (now > entry.resetTime) {
    rateLimitMap.delete(key);
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_MINUTE - 1,
      resetTime: now + 60000,
    };
  }
  
  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  entry.count++;
  rateLimitMap.set(key, entry);
  
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_MINUTE - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Verifica intentos fallidos de login
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export function checkLoginAttempt(email: string): {
  allowed: boolean;
  attemptsRemaining: number;
  lockedUntil?: number;
} {
  const now = Date.now();
  const attempt = loginAttempts.get(email);
  
  if (!attempt) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return { allowed: true, attemptsRemaining: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  if (now - attempt.lastAttempt > LOGIN_LOCKOUT_TIME) {
    loginAttempts.delete(email);
    return { allowed: true, attemptsRemaining: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    return {
      allowed: false,
      attemptsRemaining: 0,
      lockedUntil: attempt.lastAttempt + LOGIN_LOCKOUT_TIME,
    };
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  
  return {
    allowed: true,
    attemptsRemaining: MAX_LOGIN_ATTEMPTS - attempt.count,
  };
}

/**
 * Registra un login exitoso
 */
export function recordLoginSuccess(email: string) {
  loginAttempts.delete(email);
}

/**
 * Previene CSRF attacks
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Valida CSRF token
 */
export function validateCSRFToken(token: string, stored: string): boolean {
  return token === stored;
}

/**
 * Valida entrada para prevenir XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida URL para prevenir open redirects
 */
export function isValidRedirectUrl(url: string, allowedOrigins: string[]): boolean {
  try {
    const parsedUrl = new URL(url);
    return allowedOrigins.some(origin => parsedUrl.origin === origin);
  } catch {
    return false;
  }
}
