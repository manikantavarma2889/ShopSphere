import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui';
import { cartApi, productApi, type Product } from '../services/api';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>(); const [product,setProduct]=useState<Product|null>(null); const [quantity,setQuantity]=useState(1); const [message,setMessage]=useState(''); const [error,setError]=useState('');
  useEffect(()=>{if(id) productApi.get(Number(id)).then(setProduct).catch(()=>setError('Product not found.'));},[id]);
  if(error) return <div className="max-w-3xl mx-auto p-8" role="alert">{error}</div>; if(!product) return <div className="max-w-3xl mx-auto p-8" role="status">Loading product…</div>;
  const addToCart=async()=>{try{await cartApi.add(product.id,quantity);setMessage('Added to cart.');}catch(e){setError(e instanceof Error?e.message:'Unable to add to cart.');}};
  return <div className="max-w-5xl mx-auto px-4 py-8"><Link to="/products" className="inline-flex items-center gap-2 text-sm mb-6"><ArrowLeft className="h-4 w-4"/> Back to products</Link>
    <div className="grid md:grid-cols-2 gap-8"><Card className="overflow-hidden"><div className="aspect-square bg-muted/20 flex items-center justify-center">{product.imageUrl?<img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"/>:<span className="text-muted">No image</span>}</div></Card>
    <div><p className="text-sm text-muted">{product.categoryName||'Uncategorized'}</p><h1 className="text-3xl font-bold mt-1">{product.name}</h1><p className="text-2xl font-bold text-primary mt-4">${Number(product.price).toFixed(2)}</p><p className="mt-6 leading-7">{product.description||'No description available.'}</p><p className="mt-4 text-sm text-muted">SKU: {product.sku}</p><p className={product.stockQuantity>0?'mt-2 text-success':'mt-2 text-destructive'}>{product.stockQuantity>0?product.stockQuantity+' available':'Out of stock'}</p>
      <div className="flex gap-3 mt-6"><input aria-label="Quantity" type="number" min={1} max={Math.max(product.stockQuantity,1)} value={quantity} onChange={e=>setQuantity(Math.min(product.stockQuantity,Math.max(1,Number(e.target.value)||1)))} className="w-20 rounded border px-3 py-2"/><button type="button" disabled={product.stockQuantity<1} onClick={addToCart} className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"><ShoppingCart className="h-4 w-4"/> Add to Cart</button><Link to="/cart" className="rounded border px-5 py-2">View Cart</Link></div>
      {message&&<p className="mt-3 text-success" role="status">{message}</p>}{error&&<p className="mt-3 text-destructive" role="alert">{error}</p>}</div></div></div>;
};
