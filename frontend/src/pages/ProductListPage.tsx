import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input, Label } from '@/components/ui';
import { productApi, type Product } from '../services/api';

export const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{id:number;name:string}>>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { productApi.categories().then(setCategories).catch(() => setError('Unable to load categories.')); }, []);
  useEffect(() => { setLoading(true); const timer = window.setTimeout(() => { productApi.list({ search, categoryId: categoryId ? Number(categoryId) : undefined, sort }).then(setProducts).catch(() => setError('Unable to load products.')).finally(() => setLoading(false)); }, 250); return () => window.clearTimeout(timer); }, [search, categoryId, sort]);

  return <div className="min-h-screen bg-background"><main className="pt-8"><div className="max-w-7xl mx-auto px-4">
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div><Label htmlFor="product-search" className="sr-only">Search products</Label><Input id="product-search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} suffixIcon={<Search />} /></div>
      <div><Label htmlFor="category" className="sr-only">Category</Label><select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full rounded-lg border px-3 py-2"><option value="">All Categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div><Label htmlFor="sort" className="sr-only">Sort</Label><select id="sort" value={sort} onChange={e => setSort(e.target.value)} className="w-full rounded-lg border px-3 py-2"><option value="newest">Newest</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name">Name: A-Z</option></select></div>
    </div></div>
    {error && <p role="alert" className="mb-4 text-destructive">{error}</p>}
    {loading ? <p role="status" className="py-12 text-center">Loading products…</p> : products.length === 0 ? <div className="py-12 text-center"><h2 className="text-xl font-semibold">No products found</h2><p className="text-muted mt-2">Try a different search or category.</p></div> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{products.map(product =>
        <Link key={product.id} to={'/products/' + product.id} className="group bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-square bg-muted/20 overflow-hidden">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="h-full flex items-center justify-center text-muted">No image</div>}</div>
          <div className="p-4"><p className="text-xs text-muted">{product.categoryName || 'Uncategorized'}</p><h2 className="font-semibold mt-1">{product.name}</h2><p className="text-sm text-muted line-clamp-2 mt-1">{product.description}</p><div className="mt-4 flex justify-between"><span className="font-bold">${Number(product.price).toFixed(2)}</span><span className={product.stockQuantity > 0 ? 'text-success text-sm' : 'text-destructive text-sm'}>{product.stockQuantity > 0 ? product.stockQuantity + ' in stock' : 'Out of stock'}</span></div></div>
        </Link>)}</div>}
  </div></main></div>;
};
