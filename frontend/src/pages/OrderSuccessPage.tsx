import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card, } from '@/components/ui';
import { CheckCircle } from 'lucide-react';

export const OrderSuccessPage = React.memo(() => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <CheckCircle className="h-12 w-12 text-success mx-auto" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Order Confirmed
          </h1>
          <p className="text-lg text-muted mb-6">
            Thank you for shopping with ShopSphere!
          </p>

          <Card className="p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
            <ul className="space-y-3 text-left max-w-sm mx-auto">
              <li className="flex justify-between text-sm">
                <span>Order Number</span>
                <span>#ORD-2024-001</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Items</span>
                <span>2 × Premium Leather Sofa</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>$1,299.98</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </li>
              <li className="flex justify-between font-bold text-primary">
                <span>Total</span>
                <span>$1,299.98</span>
              </li>
            </ul>
          </Card>

          <div className="mt-8 space-x-3">
            <button
              onClick={() => window.location.href = '/products'}
              className="flex-1 px-6 py-3 bg-background text-foreground rounded hover:bg-gray-100 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-6 py-3 border-border rounded hover:bg-background transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </main>
    </div>
  );
});