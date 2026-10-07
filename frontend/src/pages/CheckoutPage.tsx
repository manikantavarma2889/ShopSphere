import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';

export const CheckoutPage = () => {
  const navigate=useNavigate(); const [address,setAddress]=useState(''); const [error,setError]=useState(''); const [submitting,setSubmitting]=useState(false);
  const submit=async(event:FormEvent)=>{event.preventDefault();setSubmitting(true);setError('');try{const order=await orderApi.create(address);navigate('/order/success?orderId='+order.id);}catch(e){setError(e instanceof Error?e.message:'Unable to create order.');}finally{setSubmitting(false);}};
  return <div className="max-w-2xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-6">Checkout</h1><form onSubmit={submit} className="space-y-5 rounded-lg border bg-white p-6"><div><label htmlFor="address" className="block text-sm font-medium mb-2">Shipping address</label><textarea id="address" required minLength={5} value={address} onChange={e=>setAddress(e.target.value)} className="w-full rounded border px-3 py-2 min-h-32" placeholder="123 Main Street, City, ZIP"/></div>{error&&<p role="alert" className="text-destructive">{error}</p>}<button disabled={submitting} className="w-full rounded bg-primary px-6 py-3 text-primary-foreground disabled:opacity-50">{submitting?'Creating order…':'Place Order'}</button></form><Link to="/cart" className="inline-block mt-4 text-sm underline">Back to cart</Link></div>;
};
