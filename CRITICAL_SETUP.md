# H&I SYSTEM - SETUP CRÍTICO DESPUÉS DE LA CORRECCIÓN

## Qué se ha arreglado

✅ **Dependencias de Firebase actualizadas a versión moderna**
- Cambié de `@firebase/*` packages (versión 2020) a `firebase` (v10.8.0)
- Todos los imports actualizados en 5 archivos principales
- Resolvi conflictos de ERESOLVE que causaban el error de npm

✅ **Archivos corregidos:**
1. `/lib/firebase.ts` - Imports actualizados
2. `/lib/auth/authService.ts` - Imports Firebase
3. `/lib/auth/AuthContext.tsx` - Imports Firebase
4. `/lib/services/organizationService.ts` - Imports Firestore
5. `/lib/services/auditService.ts` - Imports Firestore
6. `/lib/services/productService.ts` - Imports Firestore
7. `/lib/services/transactionService.ts` - Imports Firestore
8. `package.json` - Dependencias optimizadas

## Próximos pasos INMEDIATOS

### 1. Configurar Firebase Console
1. Ve a https://console.firebase.google.com
2. Crea un nuevo proyecto o usa uno existente
3. Copia las credenciales del proyecto
4. Actualiza el archivo `.env.local` con tus valores

### 2. Variables de entorno requeridas
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx
```

### 3. Crear colecciones en Firestore
En la consola de Firebase, crea estas colecciones (vacías):
- `organizations`
- `users`
- `branches`
- `products`
- `transactions`
- `auditLogs`
- `memberships` (para gimnasio)
- `reservations` (para restaurante)

### 4. Habilitar autenticación
En Firebase Console → Authentication:
- Habilita Email/Password
- Habilita Google Sign-in (opcional)

### 5. Desplegar en Vercel
```bash
# Sube tus cambios a GitHub
git push origin main

# En Vercel, añade las variables de entorno
NEXT_PUBLIC_FIREBASE_API_KEY=...
# etc
```

## Qué falta por completar

### Panel POS (Punto de Venta)
- ✅ Estructura base lista
- ❌ Interfaz de escaneo de código de barras
- ❌ Carrito de compras visual
- ❌ Procesamiento de pagos

### Panel Inventario
- ✅ Servicio de productos listo
- ❌ Interfaz de gestión visual
- ❌ Alertas de stock bajo
- ❌ Historial de movimientos

### Panel Financiero
- ✅ Servicio de transacciones listo
- ❌ Dashboards de reportes
- ❌ Gráficos de ingresos/gastos
- ❌ Exportación a Excel

### Panel RRHH
- ✅ Estructura de datos lista
- ❌ Gestión de empleados
- ❌ Nómina
- ❌ Asistencia

### Módulos Especializados
- ❌ Módulo Gimnasio (Biometría, membresías)
- ❌ Módulo Restaurante (Comandera, mesas)
- ❌ Módulo Tienda (Variantes, tallas, colores)
- ❌ Módulo Repuestos (Búsqueda inteligente)

## Comandos útiles

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Build para production
pnpm build

# Iniciar servidor production
pnpm start
```

## Problemas comunes

### Error: "apiKey is missing"
**Solución:** Verifica que `.env.local` tenga los valores correctos de Firebase

### Error: "permission-denied" en Firestore
**Solución:** Ve a Firestore → Rules y actualiza:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Build falla: "Module not found"
**Solución:** Ejecuta `pnpm install` de nuevo

## Verificación de estado

Después de completar el setup, el sistema debe:
1. ✅ Compilar sin errores
2. ✅ Login page funcionar
3. ✅ Firebase conectarse correctamente
4. ✅ Crear usuarios en Firestore
5. ✅ Mostrar Dashboard después de login

