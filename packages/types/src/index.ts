export type ProductId = number;

export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = {
  id: ProductId;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
};

export type CartItem = {
  productId: ProductId;
  quantity: number;
};
