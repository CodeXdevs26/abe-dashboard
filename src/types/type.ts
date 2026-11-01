export type TProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  description: string;
  image: string;
  salesCount: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export type TQuoteProduct = {
  _id: string;
  name: string;
  category: string;
  shortDescription: string;
  image: string;
};

export type TJwtPayload = {
  email: string;
  role: "user" | "rider" | "admin" | "broker" | "vendor";
  _id: string;
  iat: number;
  exp: number;
}

export type TResponse<T> = {
  data?: T;
  error?: TError;
  message?: string;
  statusCode?: number;
  success?: boolean;
  token?: string;
  meta?: TMeta;
};

export type TError = {
  data?: {
    message: string;
    stack?: string;
    statusCode: number;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};