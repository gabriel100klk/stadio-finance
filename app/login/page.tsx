// app/login/page.tsx (VERSÃO EXTREMAMENTE SIMPLES PARA TESTE FINAL)
'use client';

// Importamos APENAS o mínimo necessário para a UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react'; // Só para os inputs funcionarem minimamente

export default function LoginPage() {
  // Deixamos o state só para os inputs não darem erro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REMOVEMOS COMPLETAMENTE a função handleLogin e o useRouter

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="border-2 w-full max-w-md"> 
        <CardHeader className="space-y-1 text-center">
          <div className="text-6xl mb-4">⚽</div>
          <CardTitle className="text-3xl font-bold text-balance">Estádio Finance</CardTitle>
          <CardDescription className="text-pretty">Entre para acessar sua conta</CardDescription> 
        </CardHeader>
        <CardContent>
          {/* O form agora não faz NADA ao ser enviado */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // disabled={isLoading} // Removido isLoading
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
                // disabled={isLoading} // Removido isLoading
              />
            </div>
            {/* Removido o display de erro */}
            <Button type="submit" className="w-full" /* disabled={isLoading} */ > 
              {/* Removido isLoading */}
              Acessar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}