import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // 1. Pega o email e a senha do corpo da requisição
    const { email, password } = await request.json();

    // 2. Contacta o seu backend Nest.js para autenticar
    const nestApiResponse = await fetch('http://localhost:7654/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Se o login no backend falhar, retorna o erro
    if (!nestApiResponse.ok) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const { access_token } = await nestApiResponse.json();

    // 3. Se o login for bem-sucedido, guarda o token no cookie
    //    CORREÇÃO: Adicionado 'await' antes de cookies()
    (await cookies()).set('authToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    // 4. Retorna uma resposta de sucesso para o formulário de login
    return NextResponse.json({ message: 'Login bem-sucedido' });

  } catch (error) {
    console.error("Erro na API de login:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
