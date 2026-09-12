import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card } from '@/components/ui';

interface TimelineStep {
  label: string;
  status: 'completed' | 'current' | 'pending';
  description?: string;
}

const timelineSteps: TimelineStep[] = [
  { label: 'Order Placed', status: 'completed', description: 'Sep 10, 2024' },
  { label: 'Confirmed', status: 'current', description: 'Sep 11, 2024' },
  { label: 'Paid', status: 'pending' },
  { label: 'Processing', status: 'pending' },
  { label: 'Shipped', status: 'pending' },
  { label: 'Delivered', status: 'pending' },
];

export const OrderTrackingPage = React.memo(() => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Track Your Order</h1>
            <p className="text-muted mt-2">Enter your order number to track status</p>
          </div>
          <Card className="p-6">
            <h2 className="text-semibold mb-6">Order Timeline</h2>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.status === 'completed' ? 'text-success bg-success/10' : step.status === 'current' ? 'text-primary bg-primary/10 border-2 border-primary' : 'text-muted bg-border/10'}`}>
                    {step.status === 'current' ? '•' : step.status === 'completed' ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{step.label}</p>
                    {step.description && <p className="text-xs text-muted mt-1">{step.description}</p>}
                  </div>
                  {index < timelineSteps.length - 1 && <div className={`w-px h-6 bg-border/50 mx-2 ${timelineSteps[index].status === 'current' ? 'bg-primary' : ''}`} />}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-success" /><span className="font-medium text-success">Currently: Confirmed</span></div>
              <p className="text-xs text-muted mt-1">You will receive updates as your order progresses</p>
            </div>
          </Card>
          <div className="mt-8"><button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">Continue Shopping</button></div>
        </div>
      </main>
    </div>
  );
});
