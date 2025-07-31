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