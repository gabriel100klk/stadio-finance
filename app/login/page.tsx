// app/login/page.tsx (VERSÃO SIMPLIFICADA PARA TESTE DE BUILD)
'use client';

import type React from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Importa a PONTE CORRETA que já consertamos
import { createClient } from "@/lib/supabaseClient"; 

// Importa os componentes de UI (verifique se os caminhos estão corretos para SEU projeto)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// REMOVEMOS a importação do dynamic e a criação do MotionDiv

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
        setError("Falha no login. Verifique seu email e senha.");
        console.error("Erro no login:", error instanceof Error ? error.message : error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // A estrutura externa permanece, mas sem o MotionDiv
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* O MotionDiv foi removido daqui */}
      <Card className="border-2 w-full max-w-md"> 
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
      {/* O fechamento do MotionDiv foi removido daqui */}
    </div>
  );
}