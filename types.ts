export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  imageUrls: string[];
  isActive: boolean;
}

export interface ProductIdProps {
  id: string;
}