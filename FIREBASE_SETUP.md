# Instrucciones de Configuración de Firebase para H&I System

## Paso 1: Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: `H&I-System` (o el que prefieras)
4. Sigue el asistente de configuración
5. Habilita Google Analytics (opcional pero recomendado)

## Paso 2: Obtener Credenciales de Configuración

1. En Firebase Console, ve a Configuración del Proyecto (engranaje)
2. Copia la configuración de Firebase (tendrás que seleccionar la app)
3. Si no tienes una app creada, haz clic en "Agregar app" y selecciona Web

## Paso 3: Configurar Variables de Entorno

Copia el siguiente contenido en un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Opcional: Para desarrollo local con emulador
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

## Paso 4: Habilitar Autenticación

1. En Firebase Console, ve a "Autenticación"
2. En la pestaña "Método de acceso", haz clic en "Email/Contraseña"
3. Habilítalo
4. Opcionalmente, habilita otros proveedores (Google, GitHub, etc.)

## Paso 5: Crear Firestore Database

1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona tu región (recomendado: la más cercana a Latinoamérica)
4. Modo de inicio: Selecciona "Modo de producción" (luego configuraremos reglas)

## Paso 6: Configurar Reglas de Seguridad de Firestore

En Firestore, ve a "Reglas" y reemplaza con esto:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - cada usuario puede ver su propio documento
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Organizations collection
    match /organizations/{orgId} {
      allow read, write: if request.auth.uid != null;
      
      // Subcollections
      match /{document=**} {
        allow read, write: if request.auth.uid != null;
      }
    }
    
    // Deny everything by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Paso 7: Configurar Storage

1. En Firebase Console, ve a "Storage"
2. Haz clic en "Comenzar"
3. Ve a "Reglas" y configura:

```firebase
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /organizations/{allPaths=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

## Paso 8: Crear Estructura de Colecciones en Firestore

```
Firestore Database Structure:
/
├── users/
│   └── {userId}
│       ├── email
│       ├── name
│       ├── role
│       ├── organizationId
│       └── ...
├── organizations/
│   └── {orgId}
│       ├── name
│       ├── businessType
│       ├── modules
│       ├── users/ (subcollection)
│       └── ...
├── branches/
│   └── {branchId}
│       ├── name
│       ├── organizationId
│       └── ...
├── products/
│   └── {productId}
│       ├── name
│       ├── organizationId
│       └── ...
└── transactions/
    └── {transactionId}
        ├── amount
        ├── organizationId
        └── ...
```

## Paso 9: Verificar Instalación

1. Ejecuta `npm install` (ya se instalaron las dependencias)
2. Ejecuta `npm run dev`
3. Accede a `http://localhost:3000`
4. Intenta registrarte y loguearte

## Solución de Problemas

### Error: "Firebase Config Not Found"
- Verifica que el archivo `.env.local` existe y contiene todas las variables requeridas
- Reinicia el servidor de desarrollo

### Error: "Permission Denied" en Firestore
- Verifica las reglas de seguridad de Firestore
- Asegúrate de estar autenticado antes de acceder a datos

### Error: "Too Many Requests"
- Firestore tiene límites de velocidad en el plan gratuito
- Considera actualizar a un plan pagado si necesitas más capacidad

## Variables de Entorno Requeridas

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Todas estas comienzan con `NEXT_PUBLIC_` para que sean accesibles en el cliente.

## Próximos Pasos

Una vez configurado Firebase:
1. Crear paneles específicos para cada rol (Super Admin, Admin, POS, etc.)
2. Implementar módulos especializados (Gimnasio, Restaurante, Tienda, Repuestos)
3. Agregar biometría y lectores de códigos
4. Configurar reportes y análiticas
5. Implementar backup automático

¡H&I System está listo para despegar!
