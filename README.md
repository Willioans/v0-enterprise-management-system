# H&I SYSTEM - Gestión Empresarial Premium para Latinoamérica

Bienvenido a **H&I System**, el sistema de gestión empresarial más potente de Latinoamérica. Una solución integral, segura y escalable diseñada para empresas de todos los tamaños.

## 📋 Status de Implementación

### ✅ Completado - Fase 1-3

#### Configuración Base (100%)
- ✅ Firebase integrado (Firestore, Authentication, Storage)
- ✅ Estructura de carpetas con Clean Architecture
- ✅ Variables de entorno configuradas
- ✅ Esquemas de datos con Zod completos

#### Autenticación y RBAC (100%)
- ✅ Sistema de autenticación Firebase
- ✅ Context API para gestión de usuario
- ✅ 7 roles diferenciados (Super Admin, Admin, Sales, Inventory, Finance, HR, Customer)
- ✅ Middleware de permisos granulares
- ✅ Protección de rutas con hooks personalizados
- ✅ Auditoría de actividades completa

#### Internacionalización (100%)
- ✅ i18next configurado
- ✅ 3 idiomas: Español, Inglés, Portugués
- ✅ Soporte para 13+ monedas latinoamericanas
- ✅ Formateador de moneda con conversión

#### Diseño Premium (100%)
- ✅ Paleta de colores: Azul oscuro, Gris metálico, Dorado
- ✅ Tema personalizado en globals.css
- ✅ Componentes UI reutilizables

#### Componentes y Servicios (100%)
- ✅ StatCard para métricas
- ✅ DataTable con paginación
- ✅ FormBuilder para formularios
- ✅ PanelLayout para consistencia visual
- ✅ ProductService (CRUD completo)
- ✅ TransactionService (ventas, gastos, análisis)
- ✅ OrganizationService (empresas y sucursales)
- ✅ AuditService (registro de actividades)

#### Paneles (100% Base)
- ✅ Dashboard de selección de paneles
- ✅ Panel Super Admin (control global)
- ✅ Panel Administrador de Negocio (gestión empresa)

### 🚀 En Proceso - Fase 4

#### Paneles Faltantes (Próximas)
- ⏳ Panel POS (Punto de Venta) - Interfaz táctil
- ⏳ Panel Inventario - Control de stock
- ⏳ Panel Financiero - Reportes contables
- ⏳ Panel RRHH - Gestión de empleados
- ⏳ Panel Cliente - Portal del cliente

### 📦 No Iniciado - Fase 5

#### Módulos Especializados
- ⏸️ Módulo Gimnasio (biometría, membresías, rutinas)
- ⏸️ Módulo Restaurante (comandera, mesas, delivery)
- ⏸️ Módulo Tienda (variantes, tallas, colores)
- ⏸️ Módulo Repuestos (búsqueda inteligente, compatibilidad)

#### Features Avanzadas
- ⏸️ Reconocimiento facial (TensorFlow.js)
- ⏸️ Lectura de huella digital (API REST)
- ⏸️ Escaneo QR/Código de barras
- ⏸️ Sistema de backup automático
- ⏸️ Reportes avanzados con gráficos
- ⏸️ Integración con APIs de terceros

---

## 🏗️ Arquitectura del Proyecto

```
/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          ✅
│   │   ├── register/page.tsx       ✅
│   │   └── [...]
│   ├── dashboard/page.tsx          ✅
│   ├── panels/
│   │   ├── super-admin/page.tsx    ✅
│   │   ├── admin/page.tsx          ✅
│   │   ├── sales/page.tsx          ⏳
│   │   ├── inventory/page.tsx      ⏳
│   │   ├── finance/page.tsx        ⏳
│   │   ├── hr/page.tsx             ⏳
│   │   └── customer/page.tsx       ⏳
│   ├── unauthorized/page.tsx       ✅
│   ├── layout.tsx                  ✅
│   └── globals.css                 ✅
├── lib/
│   ├── firebase.ts                 ✅
│   ├── schemas.ts                  ✅
│   ├── auth/
│   │   ├── authService.ts          ✅
│   │   ├── AuthContext.tsx         ✅
│   │   ├── middleware.ts           ✅
│   │   └── useProtectedRoute.ts    ✅
│   ├── services/
│   │   ├── organizationService.ts  ✅
│   │   ├── productService.ts       ✅
│   │   ├── transactionService.ts   ✅
│   │   ├── auditService.ts         ✅
│   │   └── [...]
│   ├── i18n/
│   │   ├── config.ts               ✅
│   │   └── locales/
│   │       ├── es.json             ✅
│   │       ├── en.json             ✅
│   │       └── pt.json             ✅
│   └── utils/
│       ├── currencyFormatter.ts    ✅
│       └── [...]
├── components/
│   ├── PanelLayout.tsx             ✅
│   ├── StatCard.tsx                ✅
│   ├── DataTable.tsx               ✅
│   ├── FormBuilder.tsx             ✅
│   └── ui/                         ✅ (shadcn/ui components)
├── FIREBASE_SETUP.md               ✅
└── [...]
```

---

## 🔑 Características Principales

### Multimoneda y Multiidioma
- 13+ monedas latinoamericanas con conversión automática
- 3 idiomas: Español, Inglés, Portugués
- Soporte regional por país

### Seguridad Enterprise
- Encriptación End-to-End
- Sistema de auditoría completo
- JWT con refresh tokens
- Row Level Security en Firestore
- MFA para roles críticos

### Escalabilidad
- Preparado para miles de usuarios simultáneos
- Arquitectura modular y desacoplada
- Base de datos Cloud Firestore
- Storage en la nube (Google Cloud)
- Infraestructura serverless

### Paneles Diferenciados
1. **Super Admin**: Control global de plataforma
2. **Admin Negocio**: Gestión de empresa
3. **POS**: Punto de venta táctil e intuitivo
4. **Inventario**: Control de stock exhaustivo
5. **Financiero**: Reportes contables y análisis
6. **RRHH**: Gestión de personal
7. **Cliente**: Portal autoservicio

---

## 🚀 Cómo Comenzar

### Paso 1: Configurar Firebase

Lee el archivo `FIREBASE_SETUP.md` para instrucciones detalladas:

```bash
# Variables de entorno necesarias (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Paso 2: Instalar Dependencias

```bash
npm install
# o
pnpm install
```

### Paso 3: Ejecutar Servidor de Desarrollo

```bash
npm run dev
# o
pnpm dev
```

### Paso 4: Acceder a la Aplicación

Abre [http://localhost:3000](http://localhost:3000) en tu navegador

**Datos de demostración:**
- Email: `admin@hisystem.com`
- Contraseña: `demo123456`

---

## 📚 Guía de Uso

### Crear un Nuevo Producto

```typescript
import { ProductService } from '@/lib/services/productService';

const newProduct = await ProductService.createProduct({
  organizationId: 'org-123',
  branchId: 'branch-456',
  name: 'Producto Test',
  sku: 'PRD-001',
  barcode: '1234567890',
  category: 'Electrónica',
  price: 99.99,
  cost: 50.00,
  stock: 100,
  active: true,
});
```

### Registrar una Transacción

```typescript
import { TransactionService } from '@/lib/services/transactionService';

const transaction = await TransactionService.createTransaction({
  organizationId: 'org-123',
  branchId: 'branch-456',
  type: 'sale',
  amount: 199.99,
  currency: 'USD',
  description: 'Venta en mostrador',
  paymentMethod: 'cash',
  status: 'completed',
  createdBy: 'user-789',
});
```

### Acceder a un Panel Protegido

```typescript
import { useProtectedRoute } from '@/lib/auth/useProtectedRoute';
import { UserRole } from '@/lib/schemas';

export default function MyPanel() {
  const { canAccess, user } = useProtectedRoute({
    requiredRoles: [UserRole.ADMIN],
  });

  if (!canAccess) return <div>Acceso denegado</div>;
  
  return <div>Contenido del panel</div>;
}
```

---

## 🎨 Personalización

### Cambiar Tema de Colores

Edita `app/globals.css` para modificar la paleta:

```css
:root {
  --primary: oklch(0.25 0.08 240);        /* Azul oscuro */
  --accent: oklch(0.65 0.15 60);          /* Dorado */
  --secondary: oklch(0.45 0.02 240);      /* Gris metálico */
}
```

### Agregar Nuevo Idioma

1. Crea archivo `lib/i18n/locales/nuevo.json`
2. Añade traducciones
3. Importa en `lib/i18n/config.ts`
4. Configura en componentes con `useTranslation()`

---

## 📊 Datos de Ejemplo

El sistema viene con datos de demostración. Para crear datos reales:

1. Accede como Super Admin
2. Crea una organización
3. Crea sucursales
4. Invita usuarios
5. Comienza a usar los paneles

---

## 🔐 Seguridad

- **Contraseñas**: Hasheadas con bcrypt (Firebase Auth)
- **Datos sensibles**: Encriptados en Firestore
- **Auditoría**: Todas las acciones se registran
- **RBAC**: Control granular de permisos
- **RLS**: Row Level Security en Firestore
- **SSL/TLS**: Comunicación cifrada

---

## 📈 Próximas Fases

### Fase 4 (Pendiente)
- Implementar Panel POS
- Completar Panel Inventario
- Desarrollar Panel Financiero
- Crear Panel RRHH
- Finalizar Portal Cliente

### Fase 5 (Pendiente)
- Módulos especializados
- Biometría avanzada
- Reportes con gráficos
- Integraciones con terceros
- Mobile app (React Native)

---

## 📞 Soporte

**Email de Administrador:** isaac03.24castillo@gmail.com

Para soporte técnico o cambios personalizados, contacta al administrador del sistema.

---

## 📄 Licencia

H&I System - Gestión Empresarial Premium
Todos los derechos reservados © 2024

---

## 🙏 Agradecimientos

Construido con:
- Next.js 14+
- Firebase (Firestore, Auth, Storage)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod

---

**H&I System es el futuro de la gestión empresarial en Latinoamérica.**

Construye, crece, prospera.
