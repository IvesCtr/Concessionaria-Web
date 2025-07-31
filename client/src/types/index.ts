export type Vehicle = {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  preco: number;
  imagemUrl?: string; 
  vendido: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: 'cliente' | 'funcionario' | 'gerente';
};

export type Sale = {
  id: string;
  finalPrice: number;
  saleDate: string;
  vehicle: {
    marca: string;
    modelo: string;
  };
  cliente: {
    name: string;
  };
  funcionario: {
    name: string;
  };
};
