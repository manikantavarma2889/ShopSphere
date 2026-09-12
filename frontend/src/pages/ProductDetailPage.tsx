import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card, Separator } from '@/components/ui';
import { Star, Truck } from 'lucide-react';
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
  description:
    'Elegant leather sofa with modern design and premium cushioning for ultimate comfort. Upholstered in high-quality genuine leather, this sofa combines sophistication with durability. Perfect for living rooms and entertainment spaces.',
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
  const productId = parseInt(id || '1', 10);
  const product = { ...productDetail, id: productId };

  const handleAddToCart = () => {
    // Add to cart logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="rounded-lg overflow-hidden border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </Card>

            <div className="space-y-3">
              {product.images?.map((img, index) => (
                <button
                  type="button"
                  key={img.url}
                  className={`rounded-lg border p-2 transition-colors ${
                    index === 0 ? 'border-primary' : 'border-border hover:border-primary'
                  }`}
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

          <div className="max-w-4xl">
            <span className="text-xs text-muted capitalize">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.round(product.rating)
                      ? 'fill-current text-yellow-500'
                      : 'text-muted'
                  }`}
                />
              ))}
              <span className="text-muted ml-2">
                {product.rating} ({product.stock} in stock)
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <s className="text-sm text-muted">
                  ${product.originalPrice.toFixed(2)}
                </s>
              )}
              {product.discount > 0 && (
                <span className="text-sm text-success">{product.discount}% off</span>
              )}
            </div>

            <p className="text-foreground leading-7 mb-6">{product.description}</p>

            <Separator className="mb-6" />

            <div className="flex items-center gap-3 mb-6">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Fast and reliable delivery</p>
                <p className="text-sm text-muted">Usually delivered within 3–5 business days.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <div className="mt-6 text-sm text-muted">
              SKU: {product.sku}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};