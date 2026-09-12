import React from 'react';
import { AddToCart } from 'lucide-react';

interface ProductCardProps {
  product: {
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
  };
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const { id, name, description, price, originalPrice, sku, image, category, rating, stock } = product;
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const isInStock = stock > 0;

  return (
    <div
      className="group bg-white rounded-lg overflow-shadow-sm hover:shadow-md transition-shadow cursor-pointer border-border"
      onClick={() => window.location.href = `/product/${id}`}
    >
      {/* Image */}
      <div className="relative aspect-square rounded-t-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-xs text-primary-foreground rounded px-2 py-1">
            {discount}% Off
          </span>
        )}
        {!isInStock && (
          <span className="absolute top-2 right-2 bg-destructive text-xs text-primary-foreground rounded px-2 py-1">
            Out of stock
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-muted capitalize">{category}</span>
        <h3 className="text-sm font-medium line-clamp-2">{name}</h3>
        <p className="text-xs text-muted line-clamp-2">{description}</p>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <s