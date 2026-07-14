export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  unit: string;
  image: string;
  featured: boolean;
  popular: boolean;
  bestSeller: boolean;
  hotDeal: boolean;
  description: string;
  sku: string;
  brand: string;
  weight: string;
  dimensions: string;
  origin: string;
  benefits: string[];
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Address {
  id: string;
  type: string;
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  fullName: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Placed" | "In Transit" | "Delivered" | "Cancelled";
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  shippingFee: number;
  discount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}
