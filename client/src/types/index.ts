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