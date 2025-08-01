import Image from 'next/image';
import { LoginForm } from '@/components/LoginForm';


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Lado da Imagem */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image

            src="/porsche_login.jpg" 
            alt="Carro esportivo amarelo"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <LoginForm />
        </div>

      </div>
    </div>
  );
}