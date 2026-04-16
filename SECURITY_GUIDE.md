# 🔒 SECURITY GUIDE - H&I System Firebase

## ⚠️ CRÍTICO: Protección de Credenciales

### 1. Credenciales de Firebase BLINDADAS ✅

Tu proyecto Firebase está configurado con las siguientes protecciones:

**Archivo: `.env.local`**
- Contiene tus credenciales REALES
- NUNCA debe ser commiteado a Git
- Ya está en `.gitignore`
- Solo existe localmente y en Vercel Secrets

**Archivo: `.env.local.example`**
- Es un TEMPLATE sin datos sensibles
- Es SEGURO comitear este archivo
- Otros desarrolladores lo usan como guía

### 2. Tipos de Variables de Entorno

#### NEXT_PUBLIC_* (Variables Públicas)
```
Estas son SEGURAS porque aparecen en el código del navegador:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
```

**¿Por qué son seguras con NEXT_PUBLIC_?**
- Las credenciales de Firebase (API Key) están diseñadas para ser públicas
- Firebase controla el acceso mediante:
  - Reglas de Firestore (RLS - Row Level Security)
  - Reglas de Storage
  - Reglas de Authentication
  - Restricciones de dominio

#### Privadas (Sin NEXT_PUBLIC_)
```
Estas NUNCA llegan al navegador, solo al servidor:
- ADMIN_EMAIL (si lo usas en servidor)
- JWT_SECRET (si implementas)
- API_KEYS privadas
```

### 3. Protecciones Implementadas en Firebase Console

#### 3.1 Reglas de Firestore (CRÍTICO)
```
Debes ir a Firebase Console > Firestore > Rules y configurar:
```

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios SUPER_ADMIN pueden acceder a todo
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'SUPER_ADMIN';
    }
    
    // Usuarios pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Datos públicos de organizaciones (lectura)
    match /organizations/{orgId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role in ['SUPER_ADMIN', 'ADMIN'] &&
        request.auth.token.organizationId == orgId;
    }
    
    // Productos y transacciones con acceso por organización
    match /products/{productId} {
      allow read: if request.auth.token.organizationId == 
        resource.data.organizationId;
      allow write: if request.auth.token.role in ['ADMIN', 'INVENTORY_MANAGER'] &&
        request.auth.token.organizationId == resource.data.organizationId;
    }
  }
}
```

#### 3.2 Restricciones de Dominio (API Key)
```
Firebase Console > Configuración del Proyecto > APIs y Servicios:
1. Ve a "Credenciales"
2. Haz clic en tu API Key
3. En "Restricciones de Aplicación":
   - Selecciona "Aplicación de navegador HTTP"
   - Añade dominios autorizados:
     * localhost:3000 (desarrollo)
     * localhost:3001 (alternativo)
     * tudominio.com (producción)
     * www.tudominio.com
```

#### 3.3 Autenticación Multi-Factor
```
Firebase Console > Autenticación > Configuración:
1. Habilita "Verificación de email"
2. Habilita MFA para roles críticos (ADMIN, SUPER_ADMIN)
3. Usa "Proveedores de identidad" para autenticación empresarial
```

### 4. Protecciones en Código

#### 4.1 Validación de Usuario en Firestore
```typescript
// En authService.ts:
- Solo se graban datos después de validar el token
- Se asocia cada documento con organizationId
- Se registra en auditService cada acción
```

#### 4.2 Auditoría Completa
```typescript
// auditService.ts registra:
- Quién hizo la acción (userId)
- Qué acción se hizo
- Cuándo se hizo (timestamp)
- Desde dónde (IP, si es posible)
- Resultado (éxito/error)
```

### 5. Checklist de Seguridad ANTES de Producción

- [ ] Configurar Reglas de Firestore en Firebase Console
- [ ] Añadir dominios autorizados a la API Key
- [ ] Habilitar Autenticación Multi-Factor (MFA)
- [ ] Habilitar Verificación de Email
- [ ] Backups automáticos habilitados en Firestore
- [ ] Logging de actividad configurado
- [ ] Variables sensibles en Vercel Secrets
- [ ] SSL/TLS habilitado en tu dominio
- [ ] CORS correctamente configurado
- [ ] Rate limiting implementado

### 6. ¿Qué pasó si alguien ve la API Key?

**NO ES UN PROBLEMA** porque:
1. La API Key está restringida a tus dominios únicamente
2. Las Reglas de Firestore controlan quién puede acceder
3. Tu base de datos es privada por defecto
4. El JWT de Firebase valida cada solicitud

**Si quieres máxima protección:** Usa Cloud Functions privadas como proxy.

### 7. En Vercel (Producción)

1. Ir a Vercel Dashboard > Proyecto > Configuración > Variables de Entorno
2. Añadir cada variable de `.env.local`
3. Seleccionar ambiente: Production
4. No necesitas compartir .env.local con el equipo

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyDUAs5...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = sistema-h-4a2f1.firebaseapp.com
(etc)
```

### 8. Comando para Verificar Exposiciones

```bash
# Verifica si .env.local está en git
git check-ignore -v .env.local
# Debe retornar: .env.local

# Si accidentalmente commiteaste credenciales:
git rm --cached .env.local
git commit --amend --no-edit
git push --force-with-lease

# IMPORTANTE: Regenera tus credenciales en Firebase Console
```

### 9. Recursos de Seguridad

- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/security)
- [Firestore Rules Examples](https://firebase.google.com/docs/firestore/security/get-started)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

---

**RESPONSABILIDAD:** Mantener credenciales seguras es crítico. Revisa esta guía regularmente.
