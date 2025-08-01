import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const nestApiResponse = await fetch('http://localhost:7654/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!nestApiResponse.ok) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const { access_token } = await nestApiResponse.json();

    (await cookies()).set('authToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24, //24 horas
      path: '/',
    });

    return NextResponse.json({ message: 'Login bem-sucedido', token: access_token }, { status: 200 });

  } catch (error) {
    console.error("Erro na API de login:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
