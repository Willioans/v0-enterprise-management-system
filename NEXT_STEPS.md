# 🚀 PRÓXIMOS PASOS - H&I System

## Fase 1: Validación Inmediata ✅

### 1. Instala dependencias
```bash
pnpm install
# o npm install
# o yarn install
```

### 2. Valida Firebase
```bash
npm run validate-security
```

Deberías ver:
```
✅ Configuración de Firebase VÁLIDA
📋 PASOS SIGUIENTES: ...
```

### 3. Inicia el servidor local
```bash
npm run dev
```

Deberías ver:
```
✅ Configuración de Firebase VÁLIDA
> next dev
...
http://localhost:3000 - ready to start
```

---

## Fase 2: Configuración de Firebase Console (CRÍTICO)

### Paso 1: Configura Reglas de Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto: **sistema-h-4a2f1**
3. Ve a **Firestore Database > Rules**
4. Reemplaza el contenido con las reglas de `SECURITY_GUIDE.md`
5. Haz clic en **"Publicar"**

**Reglas básicas (copia de SECURITY_GUIDE.md):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'SUPER_ADMIN';
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Paso 2: Restringe la API Key a tus Dominios

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Proyecto: **sistema-h-4a2f1**
3. APIs y Servicios > Credenciales
4. Haz clic en tu API Key
5. En **"Restricciones de aplicación"**:
   - Selecciona: **"Aplicación de navegador (sitios HTTP)"**
   - Añade dominios:
     ```
     localhost:3000
     localhost:3001
     tudominio.com
     www.tudominio.com
     ```

### Paso 3: Habilita Autenticación Multi-Factor

1. Firebase Console > Autenticación > Configuración
2. Habilita **"Verificación de email"**
3. Habilita **"Autenticación de múltiples factores"**

### Paso 4: Configura Proveedores de Autenticación

1. Firebase Console > Autenticación > Configuración
2. Proveedores habilitados:
   - ✅ Email/Contraseña
   - 🔄 Google (opcional)
   - 🔄 Microsoft (opcional)

---

## Fase 3: Primeros Usuarios

### Crear Super Admin

1. Inicia la app: `npm run dev`
2. Ve a http://localhost:3000/auth/register
3. Regístrate con: `isaac03.24castillo@gmail.com`
4. En Firebase Console > Firestore:
   - Ve a colección `users`
   - Encuentra tu documento
   - Cambia `role` a `SUPER_ADMIN`

### Crear Admin de Negocio

1. Crea nueva organización desde panel Super Admin
2. Invita administrador de la empresa
3. Asigna rol `ADMIN` al usuario

---

## Fase 4: Pruebas de Seguridad

### Test 1: Valida RLS
```bash
# Intenta acceder sin autenticarse - debe fallar
curl https://localhost:3000/api/organizations
```

### Test 2: Valida Dominios
```bash
# Si accedes desde otro dominio - debe fallar
# Usa DevTools > Network > Verifica errores CORS
```

### Test 3: Valida Rate Limiting
```bash
# Haz 101 requests en 1 minuto - debe bloquearse
for i in {1..110}; do 
  curl http://localhost:3000/auth/login & 
done
```

### Test 4: Revisa Logs
```bash
# En Firebase Console > Firestore > Auditoría
# Deberías ver todas tus acciones registradas
```

---

## Fase 5: Deployment a Vercel (Producción)

### Paso 1: Conecta GitHub

1. Sube tu código a GitHub
2. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
3. Haz clic en "New Project"
4. Selecciona tu repositorio

### Paso 2: Configura Variables de Entorno

1. En Vercel: Settings > Environment Variables
2. Agrega cada variable de `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDUAs5XlPEKQvv3XbrpuE2QYm_buK5deFo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sistema-h-4a2f1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sistema-h-4a2f1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sistema-h-4a2f1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=336384813722
NEXT_PUBLIC_FIREBASE_APP_ID=1:336384813722:web:b840a366bf5c1067a68d23
ADMIN_EMAIL=isaac03.24castillo@gmail.com
```

3. Marca cada una como "Production"
4. Haz clic en "Deploy"

### Paso 3: Actualiza Dominios en Firebase

1. Ve a Google Cloud Console
2. Actualiza la API Key con tus dominios de Vercel:
   ```
   tuproyecto.vercel.app
   tudominio.com
   www.tudominio.com
   ```

---

## Checklist Final

- [ ] Firebase validado localmente (`npm run validate-security`)
- [ ] Reglas de Firestore configuradas en Console
- [ ] Dominios autorizados en API Key
- [ ] MFA habilitado
- [ ] Email verificado
- [ ] Super Admin creado
- [ ] Pruebas de seguridad pasadas
- [ ] Variables en Vercel
- [ ] Desplegado a producción
- [ ] Dominios finales en Firebase Console

---

## 🆘 Troubleshooting

### "ERROR: .env.local no existe"
```bash
# Solución:
cp .env.local.example .env.local
# Luego edita .env.local con tus credenciales
```

### "Firebase no inicializa"
```bash
# Verifica que .env.local tenga valores no vacíos
npm run validate-security
```

### "Permission denied al crear documentos"
```
Solución: Revisa tus Firestore Rules
- Debes estar autenticado
- Tu rol debe coincidir con las reglas
- organizationId debe ser el tuyo
```

### "Rate limit error - Too many requests"
```
Espera 1-15 minutos y reintenta
```

---

## 📞 Soporte

1. Lee `SECURITY_GUIDE.md` para seguridad
2. Lee `DEVELOPMENT.md` para arquitectura
3. Ejecuta `npm run validate-security` para validar
4. Revisa logs en Firebase Console

---

**IMPORTANTE:** No omitas estos pasos. La seguridad de tu sistema depende de ellos.

**Próximo objetivo:** Configurar los 7 paneles principales en H&I System.
