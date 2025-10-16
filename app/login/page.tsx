// Caminho do arquivo: app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // 1. Importamos a "ponte" que acabamos de criar

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Esta função será chamada quando o usuário clicar em "Entrar"
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Impede que a página recarregue
    setError('');
    setLoading(true);

    try {
      // 3. A ligação para o Supabase para verificar o login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        // 4. Se o Supabase retornar um erro, avisamos o usuário
        setError('Email ou senha inválidos.');
        throw authError;
      }
      
      // 5. Se o login for um sucesso, enviamos o usuário para a página principal
      router.push('/'); 

    } catch (error) {
      console.error("Ocorreu um erro no login:", error);
    } finally {
      // 6. Independentemente de sucesso ou falha, paramos o "loading"
      setLoading(false);
    }
  };

  // 7. Aqui está a parte visual (UI) da sua página
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Entrar no Estádio Finance</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
        <div>
          <label htmlFor="email" style={{ marginBottom: '5px', display: 'block' }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label htmlFor="password" style={{ marginBottom: '5px', display: 'block' }}>Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        {/* 8. Mostra a mensagem de erro para o usuário se algo der errado */}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {/* 9. O texto do botão muda se estiver carregando */}
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}