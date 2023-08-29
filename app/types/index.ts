export interface MenuItems {
  href: string;
  icon: React.JSX.Element;
  label: string;
}

export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface EmailVerifyRequest {
  token: string;
  userId: string;
}

export interface UpdatePasswordRequest {
  token: string;
  userId: string;
  password: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  verified: boolean;
}

export interface NewProductInfo {
  title: string;
  description: string;
  bulletPoints: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
  thumbnail?: File;
  images: File[];
}

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    id: string;
  };
  price: {
    base: number;
    discounted: number;
  };
  bulletPoints?: string[];
  images?: {
    url: string;
    id: string;
  }[];
  category: string;
  quantity: number;
}
