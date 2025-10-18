// app/login/page.tsx (O CÓDIGO CORRETO E FINAL)
'use client';

import type React from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; // Importa o dynamic

// Importa a PONTE CORRETA que acabamos de consertar
import { createClient } from "@/lib/supabaseClient"; 

// Importa os componentes de UI (verifique se os caminhos estão corretos para SEU projeto)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Cria o MotionDiv dinamicamente (para corrigir o erro de build)
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient(); // Usa a ponte correta
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check subscription status (ADICIONE SUA LÓGICA DE VERIFICAÇÃO DE PROFILE AQUI SE NECESSÁRIO)
      // Exemplo simplificado:
      // const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
      // if (profile?.subscription_status !== 'active') { ... }

      router.push("/"); // Redireciona para a home após login (ajuste se necessário)

    } catch (error: unknown) {
        // Ajuste na mensagem de erro para ser mais genérica e segura
        setError("Falha no login. Verifique seu email e senha.");
        console.error("Erro no login:", error instanceof Error ? error.message : error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Usa o MotionDiv corrigido */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <div className="text-6xl mb-4">⚽</div>
            <CardTitle className="text-3xl font-bold text-balance">Estádio Finance</CardTitle>
            <CardDescription className="text-pretty">Entre para acessar sua conta</CardDescription> 
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Acessando..." : "Acessar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      {/* Fecha o MotionDiv corrigido */}
      </MotionDiv>
    </div>
  );
}