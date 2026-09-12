import React, { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card, Separator, Steps, Step, Stepper, } from '@/components/ui';
import { Check, CreditCard, Lock, AlertCircle, } from 'lucide-react';

const stepperSteps = [
  { number: 1, label: 'Address', description: 'Enter shipping details' },
  { number: 2, label: 'Order Review', description: 'Review your order' },
  { number: 3, label: 'Payment', description: 'Complete payment' },
  { number: 4, label: 'Confirmation', description: 'Order confirmed' },
];

export const CheckoutPage = () => {
  const [step, setStep] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    // Step 1: Address
    () => (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Shipping Address</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              placeholder="123 Main St"
              className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ZIP
              </label>
              <input
                type="text"
                placeholder="ZIP"
                className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                required
              />
            </div>
          </div>
          <button
            onClick={() => setStep(1)}
            className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            disabled={formErrors?.['fullName'] || formErrors?.['address1']}
          >
            Continue to Order Review
          </button>
        </form>
      </div>
    ),

    // Step 2: Order Review
    () => (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Order Review</h2>
        <div className="bg-white rounded-lg shadow-sm border-border p-6">
          <h3 className="text-semibold mb-4">Items</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-12 h-12 rounded bg-border/50 flex items-center justify-center flex-shrink-0">
                <Pizza className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">Item 1</div>
                <div className="text-sm text-muted">$49.99 × 1</div>
              </div>
              <span className="text-foreground">$49.99</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-12 h-12 rounded bg-border/50 flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">Item 2</div>
                <div className="text-sm text-muted">$39.99 × 1</div>
              </div>
              <span className="text-foreground">$39.99</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>Subtotal</span>
              <span>$89.98</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-primary">
              <span>Total</span>
              <span>$89.98</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(0)}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            onClick={() => setStep(step + 1)}
            className="w-full mt-2 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            disabled={step >= 2}
          >
            {step === 0 ? 'Continue to Payment' : step === 2 ? 'Confirm Order' : 'Next'}
          </button>
        </div>
      </div>
    ),

    // Step 3: Payment
    () => (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Payment</h2>
        <p className="text-muted mb-6">
          Demo Payment — No real money will be charged.
        </p>

        <Card className="p-6">
          <form onSubmit={e => e.preventDefault()} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Demo Card Number
              </label>
              <Input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                autoComplete="cc-number"
              />
              <p className="text-xs text-muted mt-1">
                Use demo card numbers: 4242 4242 4242 4242 (SUCCESS) or 4000 0000 0000 0002 (FAILED)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="12/28"
                  className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  required
                />
                <p className="text-xs text-muted mt-1">
                  Demo CVV only — no real card data stored
                </p>
              </div>
            </div>

            <button
              type="submit"
              onClick={() => setStep(3)}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </form>
        </Card>
      </div>
    ),

    // Step 4: Confirmation
    () => (
      <div className="p-6 max-w-md mx-auto">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
          <p className="text-muted mb-6">Your order has been successfully processed.</p>

          <div className="bg-white rounded-lg shadow-sm border-border p-6">
            <h3 className="text-semibold mb-4">Order Details</h3>
            <ul className="space-y-3 text-left">
              <li>
                <span className="font-medium text-foreground">Order Number:</span>
                <span className="ml-2 text-muted">#ORD-2024-001</span>
              </li>
              <li>
                <span className="font-medium text-foreground">Payment Status:</span>
                <span className="ml-2 text-success">Success</span>
              </li>
              <li>
                <span className="font-medium text-foreground">Estimated Delivery:</span>
                <span className="ml-2 text-muted">3-5 business days</span>
              </li>
              <li>
                <span className="font-medium text-foreground">Shipping Address:</span>
                <span className="ml-2 text-muted">123 Main St, City</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-6 py-3 bg-background text-foreground rounded hover:bg-gray-100 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.location.href = '/cart'}
              className="flex-1 px-6 py-3 border-border rounded hover:bg-background transition-colors"
            >
              View Order
            </button>
          </div>
        </div>
      </div>
    ),
  ][step];
};

const Pizza = Pizza;
const Package = Package;
const Loader2 = Loader2;