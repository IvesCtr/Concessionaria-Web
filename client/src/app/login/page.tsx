import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';

// A página de login agora é um Server Component (async)
export default async function LoginPage() {
  // 1. Verifica no servidor se o cookie de autenticação já existe.
  const token = (await cookies()).get('authToken')?.value;

  // 2. Se o token existir, redireciona imediatamente para o dashboard.
  //    O formulário de login nem sequer será enviado para o navegador.
  if (token) {
    redirect('/dashboard');
  }

  // 3. Se não houver token, renderiza a página de login normalmente.
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Lado da Imagem */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/porsche_login.jpg" 
            alt="Carro desportivo amarelo"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Lado do Formulário */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <LoginForm />
        </div>

      </div>
    </div>
  );
}
