# QUICK START - H&I System

## 5 Minutos para Empezar

### Paso 1: Clonar o Descargar (1 min)

El código ya está descargado. Solo necesitas configurar Firebase.

### Paso 2: Configurar Firebase (2 min)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "H&I System"
3. Copia la configuración de Firebase
4. Pega en `.env.local` (usa `.env.local.example` como referencia)

**Ejemplo de .env.local:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hi-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hi-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hi-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### Paso 3: Instalar Dependencias (1 min)

```bash
npm install
# o si usas pnpm
pnpm install
```

### Paso 4: Ejecutar (1 min)

```bash
npm run dev
# o
pnpm dev
```

La aplicación abrirá en [http://localhost:3000](http://localhost:3000)

---

## Pruebas Rápidas

### Test 1: Ir a la página de login
```
URL: http://localhost:3000
Esperado: Redirección automática a /auth/login
```

### Test 2: Crear cuenta
```
1. Click en "Regístrate aquí"
2. Llena formulario con datos de prueba
3. Click en Registrarse
Esperado: Redirección al dashboard
```

### Test 3: Explorar paneles
```
1. Desde el dashboard, haz click en un panel
2. Verifica que la información carga
Esperado: Panel se muestra correctamente
```

---

## Troubleshooting Rápido

### "Firebase Config Not Found"
**Solución:**
1. Verifica que `.env.local` existe
2. Contiene todas las variables
3. Reinicia: `npm run dev`

### "Port 3000 en uso"
**Solución:**
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

### "Module not found"
**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
npm run dev
```

---

## Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `.env.local` | Variables de entorno (CREATE ESTE) |
| `lib/firebase.ts` | Configuración de Firebase |
| `app/auth/login/page.tsx` | Página de login |
| `app/dashboard/page.tsx` | Selector de paneles |
| `FIREBASE_SETUP.md` | Guía detallada de Firebase |
| `README.md` | Documentación completa |

---

## Próximas Acciones

1. ✓ Completar setup de Firebase
2. ✓ Ejecutar aplicación
3. [ ] Registrar usuario de prueba
4. [ ] Explorar paneles
5. [ ] Leer documentación completa en README.md

---

## Contacto

¿Problemas?
Email: isaac03.24castillo@gmail.com

---

**¡Listo para usar H&I System!**
