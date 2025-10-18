// app/login/page.tsx (VERSÃO ULTRA-SIMPLES COM HTML BÁSICO)
'use client';

import { useState } from 'react';

// Todos os imports de @/components/ui foram removidos

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // A função de login está aqui, mas o formulário não a chama, só para teste
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // A lógica do Supabase seria chamada aqui
  };

  return (
    // Usamos estilos inline básicos em vez de classes do Tailwind
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: 'white' }}>
      <div style={{ border: '1px solid #27272a', borderRadius: '0.5rem', width: '100%', maxWidth: '448px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>⚽</div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Estádio Finance</h1>
          <p style={{ color: '#a1a1aa' }}>Entre para acessar sua conta</p>
        </div>
        
        {/* Formulário com HTML puro */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '0.375rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '0.375rem' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px', background: '#fafafa', color: '#09090b', borderRadius: '0.375rem', cursor: 'pointer' }}>
            Acessar
          </button>
        </form>
      </div>
    </div>
  );
}

