import React, { useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import {
  Card,
  Input,
  Button,
  Separator,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from '@/components/ui';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Order {
  id: number;
  customer: string;
  date: string;
  amount: number;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

const initialOrders: Order[] = [
  { id: 1, customer: 'John Doe', date: 'Sep 10, 2024', amount: 1299.99, paymentStatus: 'SUCCESS', status: 'DELIVERED' },
  { id: 2, customer: 'Jane Smith', date: 'Sep 08, 2024', amount: 89.99, paymentStatus: 'SUCCESS', status: 'SHIPPED' },
  { id: 3, customer: 'Bob Wilson', date: 'Sep 05, 2024', amount: 349.99, paymentStatus: 'FAILED', status: 'CANCELLED' },
];

const statusFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const paymentFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Pending', value: 'PENDING' },
];

export const AdminOrdersPage: React.FC = () => {
  const [orders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
    const matchesSearch = !searchQuery || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || order.date.includes(dateFilter);
    return matchesStatus && matchesPayment && matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted mt-1">View and manage orders</p>
          </div>

          <Card className="bg-white rounded-lg shadow-sm border-border p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                aria-label="Filter by status"
              >
                {statusFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                aria-label="Filter by payment status"
              >
                {paymentFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                aria-label="Filter by date"
              >
                <option value="">All Dates</option>
                <option value="Sep 2024">September 2024</option>
                <option value="Aug 2024">August 2024</option>
              </select>

              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-4">Order ID</TableHead>
                  <TableHead className="p-4">Customer</TableHead>
                  <TableHead className="p-4">Date</TableHead>
                  <TableHead className="p-4">Amount</TableHead>
                  <TableHead className="p-4">Payment</TableHead>
                  <TableHead className="p-4">Status</TableHead>
                  <TableHead className="p-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-b">
                    <TableCell className="p-4 font-medium">#{order.id}</TableCell>
                    <TableCell className="p-4">{order.customer}</TableCell>
                    <TableCell className="p-4 text-sm text-muted">{order.date}</TableCell>
                    <TableCell className="p-4 font-medium text-primary">$ {order.amount.toFixed(2)}</TableCell>
                    <TableCell className="p-4">
                      {order.paymentStatus === 'SUCCESS' ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="px-2 py-1 rounded text-xs">{order.status}</span>
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      <Button size="sm" variant="ghost">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted">No orders found</p>
              </div>
            )}

            <Separator />
            <div className="mt-6 flex justify-center pb-6">
              <nav aria-label="Order pagination">
                <div className="flex gap-2">
                  <Button size="sm" disabled>Previous</Button>
                  <Button size="sm" variant="secondary">1</Button>
                  <Button size="sm" variant="primary">2</Button>
                  <Button size="sm" disabled>Next</Button>
                </div>
              </nav>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};