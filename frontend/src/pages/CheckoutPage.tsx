import { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card, Input } from '@/components/ui';
import { CheckCircle, Loader2, Package, Pizza } from 'lucide-react';

const checkoutSteps = ['Address', 'Order Review', 'Payment', 'Confirmation'];

export const CheckoutPage = () => {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const nextStep = () => setStep((current) => Math.min(current + 1, checkoutSteps.length - 1));
  const previousStep = () => setStep((current) => Math.max(current - 1, 0));

  const processPayment = () => {
    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8 grid grid-cols-4 gap-2">
            {checkoutSteps.map((label, index) => (
              <div key={label} className={`rounded-lg p-3 text-center text-sm ${index <= step ? 'bg-primary text-primary-foreground' : 'bg-border/50 text-muted'}`}>
                {index + 1}. {label}
              </div>
            ))}
          </div>

          {step === 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full rounded-lg border border-border px-3 py-2" />
                <input type="text" placeholder="Address Line 1" className="w-full rounded-lg border border-border px-3 py-2" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" className="w-full rounded-lg border border-border px-3 py-2" />
                  <input type="text" placeholder="ZIP" className="w-full rounded-lg border border-border px-3 py-2" />
                </div>
                <button type="button" onClick={nextStep} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded">Continue to Order Review</button>
              </div>
            </Card>
          )}

          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Review</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-4"><div className="w-12 h-12 rounded bg-border/50 flex items-center justify-center"><Pizza className="h-6 w-6 text-primary" /></div><div className="flex-1"><p className="font-medium">Item 1</p><p className="text-sm text-muted">$49.99 × 1</p></div><span>$49.99</span></div>
                <div className="flex items-center gap-3 border-b border-border pb-4"><div className="w-12 h-12 rounded bg-border/50 flex items-center justify-center"><Package className="h-6 w-6 text-primary" /></div><div className="flex-1"><p className="font-medium">Item 2</p><p className="text-sm text-muted">$39.99 × 1</p></div><span>$39.99</span></div>
                <div className="flex justify-between font-bold text-primary"><span>Total</span><span>$89.98</span></div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={previousStep} className="px-4 py-2 border rounded">Previous</button><button type="button" onClick={nextStep} className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded">Continue to Payment</button></div>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Payment</h2>
              <p className="text-muted mb-6">Demo Payment — No real money will be charged.</p>
              <div className="space-y-4">
                <input type="text" placeholder="Cardholder Name" className="w-full rounded-lg border border-border px-3 py-2" />
                <Input type="text" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
                <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="12/28" className="w-full rounded-lg border border-border px-3 py-2" /><input type="text" placeholder="123" className="w-full rounded-lg border border-border px-3 py-2" /></div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={previousStep} className="px-4 py-2 border rounded">Previous</button><button type="button" onClick={processPayment} disabled={isProcessing} className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded disabled:opacity-50">{isProcessing ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Processing...</span> : 'Confirm Payment'}</button></div>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-muted mb-6">Your order has been successfully processed.</p>
              <div className="flex gap-3 justify-center"><button type="button" onClick={() => window.location.href = '/'} className="px-6 py-3 bg-primary text-primary-foreground rounded">Continue Shopping</button><button type="button" onClick={() => window.location.href = '/cart'} className="px-6 py-3 border rounded">View Cart</button></div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};
