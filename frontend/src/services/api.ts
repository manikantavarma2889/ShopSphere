export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl?: string | null;
  stockQuantity: number;
  active: boolean;
  categoryId?: number | null;
  categoryName?: string | null;
};

export type CartItem = {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Cart = { id: number; userId: number; items: CartItem[]; itemCount: number; subtotal: number };
export type Order = {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: string;
  orderItems: Array<{ id: number; productId: number; productName: string; unitPrice: number; quantity: number; subtotal: number }>;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('shopSphereToken');
  const userId = localStorage.getItem('shopSphereUserId') || '1';
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && token !== 'mock-jwt-token' ? { Authorization: `Bearer ${token}` } : {}),
      'X-User-Id': userId,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const productApi = {
  list: (params: { search?: string; categoryId?: number; sort?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.categoryId) query.set('categoryId', String(params.categoryId));
    if (params.sort) query.set('sort', params.sort);
    return request<Product[]>(`/api/products?${query.toString()}`);
  },
  get: (id: number) => request<Product>(`/api/products/${id}`),
  categories: () => request<Array<{ id: number; name: string; description?: string }>>('/api/categories'),
};

export const cartApi = {
  get: () => request<Cart>('/api/cart'),
  add: (productId: number, quantity = 1) => request<Cart>('/api/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  update: (productId: number, quantity: number) => request<Cart>(`/api/cart/items/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  remove: (productId: number) => request<void>(`/api/cart/items/${productId}`, { method: 'DELETE' }),
};

export const orderApi = {
  create: (shippingAddress: string) => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify({ shippingAddress }) }),
  list: () => request<Order[]>('/api/orders'),
  get: (id: number) => request<Order>(`/api/orders/${id}`),
};
