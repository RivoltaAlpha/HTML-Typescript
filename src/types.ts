export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
  };
}
