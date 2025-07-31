import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Esta função é acionada por uma requisição GET para /api/logout
export async function GET() {
  try {
    // Apaga o cookie de autenticação
    (await cookies()).delete('authToken');

    return NextResponse.json({ message: 'Logout bem-sucedido' }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de logout:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
