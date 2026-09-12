import { useState, useEffect } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Separator, SkeletonCard } from '@/components/ui';
import { ShoppingCart, X, Plus } from 'lucide-react';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  sku?: string;
  price: number;
  quantity: number;
  image: string;
}

const initialCartItems: CartItem[] = [];

export const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setIsLoading(false), []);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const removeItem = (productId: number) => setCartItems(cartItems.filter(item => item.productId !== productId));
  const increaseQuantity = (productId: number) => setCartItems(cartItems.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQuantity = (productId: number) => setCartItems(cartItems.map(item => item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><SkeletonCard /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16"><div className="max-w-7xl mx-auto px-4"><div className="bg-white rounded-lg shadow-sm border-border p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Cart</h2>
        {cartItems.length === 0 ? <div className="empty-state text-center"><ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" /><h3 className="text-base font-medium">Your cart is empty</h3><p className="text-muted">Add products to your cart to get started</p><button onClick={() => window.location.href = '/products'} className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded">Browse Products</button></div> : <div className="space-y-4">
          {cartItems.map((item) => <div key={item.id} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg"><img src={item.image} alt={item.productName} className="w-16 h-16 object-cover border-border" /><div className="flex-1 min-w-0"><h3 className="font-medium text-foreground line-clamp-1">{item.productName}</h3><p className="text-xs text-muted">SKU: {item.sku || 'N/A'}</p></div><div className="flex items-center gap-3"><button onClick={() => decreaseQuantity(item.productId)} className="p-1 rounded border-border" disabled={item.quantity <= 1} aria-label="Decrease quantity"><X className="h-4 w-4" /></button><span className="min-w-16 text-center">{item.quantity}</span><button onClick={() => increaseQuantity(item.productId)} className="p-1 rounded border-border" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span><button onClick={() => removeItem(item.productId)} className="text-xs text-destructive hover:underline" aria-label="Remove item">Remove</button></div>)}
          <Separator /><div className="flex justify-between text-foreground"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div><div className="flex justify-between text-muted"><span>Shipping</span><span>Free</span></div><div className="flex justify-between font-bold text-primary py-2"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div><button onClick={() => window.location.href = '/checkout'} className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded">Proceed to Checkout</button>
        </div>}
      </div></div></main>
    </div>
  );
};
