'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth/AuthContext';
import { Loader2, Lock, Mail, Building2, TrendingUp, Shield, Globe } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f1629] flex-col justify-between p-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c9a84c] rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">H&I System</span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Gestión Empresarial<br />
              <span className="text-[#c9a84c]">de Clase Mundial</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              La plataforma líder en Latinoamérica para la gestión integral de negocios. Multimoneda, multiidioma y diseño premium.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: TrendingUp, text: 'Control total de ventas, inventario y finanzas en tiempo real' },
              { icon: Shield, text: 'Seguridad enterprise con encriptación end-to-end' },
              { icon: Globe, text: 'Multimoneda y multiidioma para toda Latinoamérica' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#c9a84c]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {[{ v: '500+', l: 'Empresas' }, { v: '15+', l: 'Países' }, { v: '99.9%', l: 'Uptime' }].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-bold text-[#c9a84c]">{s.v}</div>
                <div className="text-white/40 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-sm">© 2026 H&I System. Todos los derechos reservados.</p>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-3 lg:hidden mb-8">
            <div className="w-9 h-9 bg-[#0f1629] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <span className="text-xl font-bold">H&I System</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground mt-1">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="usuario@empresa.com" className="pl-10"
                      value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10"
                      value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-[#0f1629] hover:bg-[#1a2540] text-white h-11">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Ingresando...</> : 'Ingresar al Sistema'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            ¿Primera vez en H&I System?{' '}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">Solicitar acceso</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
