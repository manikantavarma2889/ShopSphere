import React from 'react';
import { ShoppingCart } from 'lucide-react';

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

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { id, name, description, price, originalPrice, image, category, stock } = product;
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const isInStock = stock > 0;

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
      onClick={() => { window.location.href = `/product/${id}`; }}
    >
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

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-muted capitalize">{category}</span>
        <h3 className="text-sm font-medium line-clamp-2">{name}</h3>
        <p className="text-xs text-muted line-clamp-2">{description}</p>
      </div>

      <div className="p-4 border-t border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <s className="text-xs text-muted">${originalPrice.toFixed(2)}</s>
          )}
        </div>
        <button
          type="button"
          disabled={!isInStock}
          onClick={(event) => {
            event.stopPropagation();
            onAddToCart?.();
          }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

ProductCard.displayName = 'ProductCard';

export { ProductCard };
export type { ProductCardProps };
