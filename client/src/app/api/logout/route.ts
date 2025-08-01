import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {

    (await cookies()).delete('authToken');

    return NextResponse.json({ message: 'Logout bem-sucedido' }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de logout:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
