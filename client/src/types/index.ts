export type Vehicle = {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  quilometragem: number;
  preco: number;
  descricao?: string;
  imagemUrl?: string; 
  vendido: boolean;
};