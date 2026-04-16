# DEPLOYMENT GUIDE - H&I System

## Despliegue en Vercel (Recomendado)

### Opción 1: Deploy Automático (Recomendado)

#### Paso 1: Conectar Repositorio
1. Push del código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Haz click en "New Project"
4. Conecta tu repositorio de GitHub
5. Selecciona "H&I System"

#### Paso 2: Configurar Variables de Entorno
En Vercel dashboard:
```
Settings → Environment Variables
```

Copia todas las variables de `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

#### Paso 3: Deploy
1. Click en "Deploy"
2. Espera a que compile (2-3 minutos)
3. Tu aplicación estará en vivo

### Opción 2: Deploy Manual con CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Autenticarse
vercel login

# 3. Deploy
vercel

# 4. Seguir las instrucciones
# - Project name: h-i-system
# - Framework: Next.js
# - Root directory: ./
```

---

## Despliegue en Docker

### Crear Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Crear docker-compose.yml

```yaml
version: '3.8'

services:
  h-i-system:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
```

### Ejecutar con Docker

```bash
# Build
docker build -t h-i-system .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=xxx \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx \
  h-i-system

# Con docker-compose
docker-compose up
```

---

## Despliegue en Servidor Personal

### Requisitos
- Node.js 18+
- PM2 o similar para process management
- Nginx o Apache como reverse proxy
- SSL certificate (Let's Encrypt)

### Pasos

#### 1. Conectar por SSH
```bash
ssh user@your-server.com
```

#### 2. Clonar Repositorio
```bash
cd /home/user
git clone https://github.com/your-repo/h-i-system.git
cd h-i-system
```

#### 3. Instalar Dependencias
```bash
npm install
```

#### 4. Crear .env.production
```bash
cp .env.local.example .env.production
# Edita con tus valores
nano .env.production
```

#### 5. Build Optimizado
```bash
npm run build
```

#### 6. Instalar PM2
```bash
npm install -g pm2
```

#### 7. Iniciar con PM2
```bash
pm2 start npm --name "h-i-system" -- start
pm2 save
pm2 startup
```

#### 8. Configurar Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 9. SSL con Let's Encrypt
```bash
sudo certbot --nginx -d your-domain.com
```

---

## Verificación Post-Deploy

### Checklist
- [ ] Sitio accesible en dominio
- [ ] Login funciona
- [ ] Firebase conectado (ver consola)
- [ ] Formularios funcionan
- [ ] Base de datos responde
- [ ] SSL válido
- [ ] Performance > 3s (Lighthouse)

### Test Automatizado
```bash
npm run test
```

---

## Monitoreo

### Usar Sentry para errores
```bash
npm install @sentry/nextjs
```

### Configurar analytics
```typescript
// pages/_app.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
});
```

---

## Escalabilidad

### Para > 10k usuarios:
- Implementar CDN (Cloudflare)
- Caché de Firestore
- Optimizar imágenes
- Lazy loading
- Compresión gzip

### Para > 100k usuarios:
- Load balancer
- Multiple instances
- Database replication
- Microservicios

---

## Rollback Plan

Si algo falla en producción:

```bash
# 1. Parar aplicación
pm2 stop h-i-system

# 2. Volver a versión anterior
git revert HEAD
git push

# 3. Reinstalar y rebuild
npm install
npm run build

# 4. Reiniciar
pm2 restart h-i-system
```

---

## Actualizar Aplicación

### En Vercel
```
Auto-deploy en cada push a main
```

### En servidor personal
```bash
cd /home/user/h-i-system
git pull
npm install
npm run build
pm2 restart h-i-system
```

---

## Seguridad en Producción

- [ ] HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] Variables secretas en server-side solo
- [ ] Rate limiting activado
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Firewall activado

---

## Backups

### Automático con Firebase
Firebase realiza backups automáticos. Pero también implementa:

```typescript
// lib/services/backupService.ts
export class BackupService {
  static async createBackup(): Promise<void> {
    // Exportar datos de Firestore
    // Almacenar en Cloud Storage
    // Guardar en bucket seguro
  }

  static async restoreBackup(backupId: string): Promise<void> {
    // Restaurar desde backup
  }
}
```

---

## Monitoreo de Performance

### Metrics Importantes
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3s

### Herramientas
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

---

## Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules .next
npm install
npm run build
```

### "Firebase credentials error"
```bash
# Verifica .env.production
cat .env.production
# Reinicia servidor
pm2 restart h-i-system
```

### "Port already in use"
```bash
# Cambiar puerto
PORT=3001 npm start
```

---

## Contacto para Issues

Email: isaac03.24castillo@gmail.com

---

**H&I System está listo para ir a producción.**

Despliegua con confianza.
