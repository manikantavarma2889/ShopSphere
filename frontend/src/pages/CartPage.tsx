import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui';
import { cartApi, type Cart } from '../services/api';

export const CartPage=()=>{const navigate=useNavigate();const[cart,setCart]=useState<Cart|null>(null);const[error,setError]=useState('');const load=()=>cartApi.get().then(setCart).catch(e=>setError(e instanceof Error?e.message:'Unable to load cart.'));useEffect(load,[]);
const update=async(id:number,quantity:number)=>{try{setCart(await cartApi.update(id,quantity));}catch(e){setError(e instanceof Error?e.message:'Unable to update cart.');}};
const remove=async(id:number)=>{try{await cartApi.remove(id);load();}catch(e){setError(e instanceof Error?e.message:'Unable to remove item.');}};
if(!cart)return <div className="max-w-4xl mx-auto p-8" role="status">Loading cart…</div>;
return <div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-6">Your Cart</h1>{error&&<p role="alert" className="mb-4 text-destructive">{error}</p>}
{cart.items.length===0?<div className="text-center py-12"><ShoppingCart className="mx-auto h-12 w-12 opacity-50"/><p className="mt-4">Your cart is empty.</p><Link className="inline-block mt-4 rounded bg-primary px-4 py-2 text-primary-foreground" to="/products">Browse Products</Link></div>:
<div className="space-y-4">{cart.items.map(item=><div key={item.id} className="flex flex-wrap items-center gap-4 rounded border p-4"><div className="flex-1 min-w-48"><h2 className="font-semibold">{item.productName}</h2><p className="text-sm text-muted">${Number(item.unitPrice).toFixed(2)} each</p></div><div className="flex items-center gap-2"><button onClick={()=>update(item.productId,item.quantity-1)} disabled={item.quantity<=1} className="rounded border px-3 py-1">−</button><span>{item.quantity}</span><button onClick={()=>update(item.productId,item.quantity+1)} className="rounded border px-3 py-1">+</button></div><strong>${Number(item.subtotal).toFixed(2)}</strong><button onClick={()=>remove(item.productId)} className="text-destructive hover:underline">Remove</button></div>)}<Separator/><div className="flex justify-between text-xl font-bold"><span>Total</span><span>${Number(cart.subtotal).toFixed(2)}</span></div><button onClick={()=>navigate('/checkout')} className="w-full rounded bg-primary px-6 py-3 text-primary-foreground">Proceed to Checkout</button></div>}</div>;
};
