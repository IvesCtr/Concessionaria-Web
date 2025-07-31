// client/src/app/login/page.tsx
import Image from 'next/image';
import { LoginForm } from '@/components/LoginForm';

// REMOVA ESTA LINHA:
// import loginImage from '@/public/porsche_login.jpg'; 

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Lado da Imagem */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            // ALTERE AQUI: passe o caminho como uma string começando com /
            src="/porsche_login.jpg" 
            alt="Carro esportivo amarelo"
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