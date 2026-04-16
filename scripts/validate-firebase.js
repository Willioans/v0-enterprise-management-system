#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Validando configuración de Firebase...\n');

const envPath = path.join(process.cwd(), '.env.local');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let errors = [];
let warnings = [];

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  errors.push('❌ .env.local no existe. Copia .env.local.example y rellena tus credenciales.');
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check each required variable
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      errors.push(`❌ Variable ${varName} no encontrada en .env.local`);
    } else {
      const hasValue = new RegExp(`${varName}=.+`).test(envContent);
      if (!hasValue || envContent.includes(`${varName}=`) && !envContent.split(`${varName}=`)[1].trim()) {
        errors.push(`❌ Variable ${varName} está vacía`);
      }
    }
  });

  // Check for placeholder values
  if (envContent.includes('your_api_key') || envContent.includes('tu_proyecto')) {
    errors.push('❌ Aún hay valores placeholder en .env.local. Usa valores reales.');
  }
}

// Check .gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignoreContent.includes('.env') || !gitignoreContent.includes('.local')) {
    warnings.push('⚠️ .gitignore no protege .env.local. Añade ".env*.local"');
  } else {
    console.log('✅ .gitignore protege correctamente .env.local\n');
  }
} else {
  warnings.push('⚠️ .gitignore no existe');
}

// Print results
if (errors.length > 0) {
  console.log('ERRORES ENCONTRADOS:\n');
  errors.forEach(error => console.log(`  ${error}`));
  console.log('\n');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('ADVERTENCIAS:\n');
  warnings.forEach(warning => console.log(`  ${warning}`));
  console.log('\n');
}

console.log('✅ Configuración de Firebase VÁLIDA');
console.log('\n📋 PASOS SIGUIENTES:');
console.log('1. Configura Reglas de Firestore en Firebase Console');
console.log('2. Añade dominios autorizados a la API Key');
console.log('3. Habilita autenticación multi-factor');
console.log('4. Revisa SECURITY_GUIDE.md para más detalles\n');
