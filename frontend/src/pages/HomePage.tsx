import React from 'react';
import { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card } from '@/components/ui';
import { ArrowRight, Search } from 'lucide-react';
import { ProductCard } from '../components/products/ProductCard';

const products = [
  { id: 1, name: 'Premium Leather Sofa', description: 'Elegant leather sofa with modern design', price: 1299.99, originalPrice: 1599.99, sku: 'LS-001', image: '/placeholder-sofa.jpg', category: 'Furniture', rating: 4.5, stock: 12, discount: 19 },
  { id: 2, name: 'Modern Dining Table', description: 'Extendable dining table for 6-8 people', price: 899.99, originalPrice: null, sku: 'DT-002', image: '/placeholder-table.jpg', category: 'Furniture', rating: 4.8, stock: 8, discount: 0 },
  { id: 3, name: 'Ergonomic Office Chair', description: 'Comfortable office chair with lumbar support', price: 399.99, originalPrice: 599.99, sku: 'OC-003', image: '/placeholder-chair.jpg', category: 'Office', rating: 4.3, stock: 25, discount: 33 },
  { id: 4, name: 'Wooden Bookshelf', description: 'Multi-tier wooden bookshelf', price: 249.99, originalPrice: 349.99, sku: 'BS-004', image: '/placeholder-bookshelf.jpg', category: 'Furniture', rating: 4.7, stock: 15, discount: 28 },
];

const categories = [
  { name: 'All', count: 24 },
  { name: 'Furniture', count: 12 },
  { name: 'Office', count: 5 },
  { name: 'Electronics', count: 7 },
];

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="py-20 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <section className="mb-12">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Welcome to ShopSphere</h1>
              <p className="text-lg text-muted max-w-2xl mx-auto mb-6">Discover quality products from trusted sellers</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setSearchQuery('')} className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-border rounded-full hover:bg-background transition-colors">Browse Categories</button>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button key={category.name} onClick={() => setSelectedCategory(category.name)} className="text-left">
                  <Card className="p-4 text-center hover:bg-primary/5 transition-colors">
                    <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-medium">{category.name}</h3>
                    <p className="text-xs text-muted">{category.count} items</p>
                  </Card>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
              ))}
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center"><p className="text-3xl font-bold text-primary">10K+</p><p className="text-sm text-muted">Happy Customers</p></div>
              <div className="text-center"><p className="text-3xl font-bold text-primary">500+</p><p className="text-sm text-muted">Products</p></div>
              <div className="text-center"><p className="text-3xl font-bold text-primary">98%</p><p className="text-sm text-muted">Positive Reviews</p></div>
              <div className="text-center"><p className="text-3xl font-bold text-primary">24/7</p><p className="text-sm text-muted">Support</p></div>
            </div>
          </section>
        </div>
      </header>
    </div>
  );
};
