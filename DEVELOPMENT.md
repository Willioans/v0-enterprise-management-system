# GUÍA DE DESARROLLO - H&I System

## Estructura de Carpetas

```
/lib
  /auth              - Autenticación y autorización
  /services          - Servicios de negocio (productos, transacciones, etc.)
  /i18n              - Internacionalización
  /utils             - Utilidades (formateo de moneda, validación, etc.)
  
/app
  /auth              - Páginas de autenticación
  /dashboard         - Panel de selección
  /panels            - Paneles por rol
  /unauthorized      - Página de acceso denegado
  
/components
  /ui                - Componentes shadcn/ui
                      - Button, Input, Card, Table, etc.
                      (Pre-instalados, no modificar)
  
  Componentes reutilizables:
  - PanelLayout.tsx  - Layout base para paneles
  - StatCard.tsx     - Tarjeta de estadísticas
  - DataTable.tsx    - Tabla de datos con paginación
  - FormBuilder.tsx  - Constructor de formularios
```

## Convenciones de Código

### Nombres de Archivos
- Componentes React: `PascalCase.tsx` (ej: `UserCard.tsx`)
- Servicios: `camelCase.ts` (ej: `userService.ts`)
- Páginas: `camelCase.tsx` en carpetas (ej: `/pages/page.tsx`)
- Tipos/Esquemas: `camelCase.ts` (ej: `schemas.ts`)

### Estructura de Servicios
```typescript
export class ServiceName {
  static async create(data: T): Promise<T>
  static async read(id: string): Promise<T | null>
  static async update(id: string, updates: Partial<T>): Promise<void>
  static async delete(id: string): Promise<void>
  static async list(filters?: Record<string, any>): Promise<T[]>
}
```

### Protección de Rutas
```typescript
export default function ProtectedPage() {
  const { canAccess, user } = useProtectedRoute({
    requiredRoles: [UserRole.ADMIN],
    requiredPermissions: ['manage_users'],
  });

  if (!canAccess) return <div>Loading...</div>;
  
  return <div>Content</div>;
}
```

## Roles y Permisos

### 7 Roles Predefinidos

1. **SUPER_ADMIN** - Control total de la plataforma
   - Gestionar organizaciones
   - Gestionar suscripciones
   - Ver logs del sistema
   - Configurar ajustes globales

2. **ADMIN** - Gestión de empresa
   - Gestionar sucursales
   - Gestionar empleados
   - Ver reportes
   - Configurar empresa

3. **SALES** - Punto de venta
   - Crear ventas
   - Procesar pagos
   - Generar facturas
   - Ver reportes de ventas

4. **INVENTORY** - Gestión de inventario
   - Gestionar stock
   - Crear órdenes de compra
   - Gestionar proveedores
   - Ver reportes de inventario

5. **FINANCE** - Panel financiero
   - Gestionar cuentas
   - Gestionar gastos
   - Crear reportes financieros
   - Análisis de rentabilidad

6. **HR** - Recursos humanos
   - Gestionar empleados
   - Control de asistencia
   - Gestionar nómina
   - Ver reportes de RRHH

7. **CUSTOMER** - Cliente
   - Ver perfil personal
   - Ver compras
   - Ver membresías
   - Actualizar datos

## Agregar Nuevo Panel

### Paso 1: Crear archivo del panel
```typescript
// app/panels/nuevo-panel/page.tsx
'use client';

import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { PanelLayout } from '@/components/PanelLayout';
import { UserRole } from '@/lib/schemas';

export default function NuevoPanelPage() {
  const { canAccess } = useProtectedRoute({
    requiredRoles: [UserRole.YOUR_ROLE],
  });

  if (!canAccess) return null;

  return (
    <PanelLayout
      title="Tu Panel"
      description="Descripción del panel"
    >
      {/* Contenido aquí */}
    </PanelLayout>
  );
}
```

### Paso 2: Agregar al menú del dashboard
Edita `app/dashboard/page.tsx` y añade una tarjeta para el nuevo panel

## Agregar Nuevo Servicio

```typescript
// lib/services/miServicio.ts
import { collection, doc, setDoc, getDoc, query, where, getDocs } from '@firebase/firestore';
import { db } from '../firebase';
import { MiTipo } from '../schemas';

export class MiServicio {
  static async crear(data: Omit<MiTipo, 'id' | 'createdAt' | 'updatedAt'>): Promise<MiTipo> {
    try {
      const id = doc(collection(db, 'coleccion')).id;
      const item: MiTipo = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'coleccion', id), item);
      return item;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
```

## Variables de Entorno

Requeridas:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Opcionales:
- `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` - Para desarrollo local
- `NEXT_PUBLIC_DEMO_MODE` - Para modo demostración

## Seguridad

### Reglas de Firestore
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    match /organizations/{orgId} {
      allow read, write: if request.auth.uid != null;
      match /{document=**} {
        allow read, write: if request.auth.uid != null;
      }
    }
  }
}
```

### Mejores Prácticas
- Siempre validar en backend (aunque validamos en frontend)
- Nunca guardar datos sensibles sin encriptar
- Usar HTTPS en producción
- Implementar rate limiting
- Auditar todas las acciones importantes
- Validar permisos en servidor

## Testing

### Test de componentes
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

## Despliegue

### Vercel (Recomendado)
```bash
vercel deploy
```

### Docker
```bash
docker build -t hi-system .
docker run -p 3000:3000 hi-system
```

### Manual
```bash
npm run build
npm start
```

## Troubleshooting

### Error: "Firebase Config Not Found"
- Verifica `.env.local` tiene todas las variables
- Reinicia el servidor con `npm run dev`

### Error: "Permission Denied" en Firestore
- Verifica las reglas de seguridad
- Asegúrate de estar autenticado

### Error: "Module not found"
- Ejecuta `npm install`
- Verifica la ruta de importación

### Página en blanco
- Abre consola del navegador (F12)
- Busca errores en la pestaña Console
- Revisa los logs del servidor

## Performance

### Optimizaciones implementadas
- Code splitting automático (Next.js)
- Lazy loading de componentes
- Caché de Firestore
- Indexación de consultas
- Compresión de assets

### Optimizaciones recomendadas
- Usar imágenes optimizadas
- Implementar SSR donde sea posible
- Cachear datos estáticos
- Usar CDN para assets
- Monitorear performance con Lighthouse

## Recursos

- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

**Preguntas? Contacta a: isaac03.24castillo@gmail.com**
