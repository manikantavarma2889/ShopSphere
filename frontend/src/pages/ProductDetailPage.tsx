import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card, Separator, } from '@/components/ui';
import { Star, Truck, Lupe, } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface ProductImage {
  url: string;
  alt: string;
}

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  sku: string;
  image: string;
  category: string;
  rating: number;
  stock: number;
  discount: number;
  images?: ProductImage[];
}

const productDetail: ProductDetail = {
  id: 1,
  name: 'Premium Leather Sofa',
  description: 'Elegant leather sofa with modern design and premium cushioning for ultimate comfort. Upholstered in high-quality genuine leather, this sofa combines sophistication with durability. Perfect for living rooms and entertainment spaces.',
  price: 1299.99,
  originalPrice: 1599.99,
  sku: 'LS-001',
  image: '/placeholder-sofa.jpg',
  category: 'Furniture',
  rating: 4.5,
  stock: 12,
  discount: 19,
  images: [
    { url: '/placeholder-sofa.jpg', alt: 'Premium Leather Sofa - Front view' },
    { url: '/placeholder-sofa-2.jpg', alt: 'Premium Leather Sofa - Side view' },
    { url: '/placeholder-sofa-3.jpg', alt: 'Premium Leather Sofa - Back view' },
  ],
};

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '1');

  const product = productDetail; // In real app, fetch from API

  const handleAddToCart = () => {
    // Add to cart logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Product Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Main Image */}
            <Card className="rounded-lg overflow-hidden border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </Card>

            {/* Thumbnail Gallery */}
            <div className="space-y-2">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  className={`rounded-lg border-border ${index === 0 ? 'border-primary' : ''} p-2 hover:bg-primary/5 transition-colors`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-24 object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <span className="text-xs text-muted capitalize">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            <div className="flex gap-2 mb-4">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 text-yellow-500 ${i < product.rating ? 'fill' : 'outline'} transition-colors`}
                />
              ))}
              <span className="text-muted ml-2">{product.rating} ({product.stock} in stock)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <s