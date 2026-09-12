import { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Separator, Input } from '@/components/ui';
import { Search } from 'lucide-react';
import { ProductCard } from '../components/products/ProductCard';

type SortOption = 'price-low' | 'price-high' | 'name';

const allProducts = [
  { id: 1, name: 'Premium Leather Sofa', description: 'Elegant leather sofa with modern design', price: 1299.99, originalPrice: 1599.99, sku: 'LS-001', image: '/placeholder-sofa.jpg', category: 'Furniture', rating: 4.5, stock: 12, discount: 19 },
  { id: 2, name: 'Modern Dining Table', description: 'Extendable dining table for 6-8 people', price: 899.99, originalPrice: null, sku: 'DT-002', image: '/placeholder-table.jpg', category: 'Furniture', rating: 4.8, stock: 8, discount: 0 },
  { id: 3, name: 'Ergonomic Office Chair', description: 'Comfortable office chair with lumbar support', price: 399.99, originalPrice: 599.99, sku: 'OC-003', image: '/placeholder-chair.jpg', category: 'Office', rating: 4.3, stock: 25, discount: 33 },
  { id: 4, name: 'Wooden Bookshelf', description: 'Multi-tier wooden bookshelf', price: 249.99, originalPrice: 349.99, sku: 'BS-004', image: '/placeholder-bookshelf.jpg', category: 'Furniture', rating: 4.7, stock: 15, discount: 28 },
  { id: 5, name: 'Smartwatch Pro', description: 'Health tracking and smart notifications', price: 299.99, originalPrice: 349.99, sku: 'SW-005', image: '/placeholder-watch.jpg', category: 'Electronics', rating: 4.6, stock: 30, discount: 14 },
  { id: 6, name: 'Wireless Headphones', description: 'Noise cancelling over-ear headphones', price: 199.99, originalPrice: 299.99, sku: 'WH-006', image: '/placeholder-headphones.jpg', category: 'Electronics', rating: 4.4, stock: 45, discount: 33 },
  { id: 7, name: 'Coffee Maker', description: 'Programmable coffee maker with grinder', price: 149.99, originalPrice: 249.99, sku: 'CM-007', image: '/placeholder-coffee.jpg', category: 'Home', rating: 4.2, stock: 18, discount: 40 },
  { id: 8, name: 'Desk Lamp', description: 'Adjustable LED desk lamp with wireless charger', price: 89.99, originalPrice: null, sku: 'DL-008', image: '/placeholder-lamp.jpg', category: 'Home', rating: 4.5, stock: 50, discount: 0 },
];

const categories = ['All', 'Furniture', 'Electronics', 'Home', 'Office'];

export const ProductListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('price-low');

  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  const filteredProducts = sortedProducts.filter((product) => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    return categoryMatch && (product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query));
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border-border p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} suffixIcon={<Search />} />
              <label className="sr-only" htmlFor="category-filter">Category</label>
              <select id="category-filter" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="block w-full rounded-lg border border-border px-3 py-2 text-sm">
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <label className="sr-only" htmlFor="sort-filter">Sort</label>
              <select id="sort-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="block w-full rounded-lg border border-border px-3 py-2 text-sm">
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
              <p className="text-sm text-muted self-center">{filteredProducts.length} of {allProducts.length} products</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={() => {}} />)}
          </div>

          {filteredProducts.length > 8 && (
            <>
              <Separator />
              <div className="mt-8 flex justify-center gap-2">
                <button type="button" className="px-4 py-2 border rounded">Previous</button>
                <button type="button" className="px-4 py-2 border rounded bg-primary text-primary-foreground">1</button>
                <button type="button" className="px-4 py-2 border rounded">Next</button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
