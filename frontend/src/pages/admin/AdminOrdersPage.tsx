import React from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, Input, Select, Button, Separator, Table, TableHeader, TableRow, TableCell, TableHead, } from '@/components/ui';
import { Filter, Calendar, CheckCircle, Loader2, } from 'lucide-react';
import { useState } from 'react';

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

const [orders, setOrders] = useState(initialOrders);
const [filters, setFilters] = useState<{ status?: string; payment?: string; date?: string }>({});
const [searchQuery, setSearchQuery] = useState('');

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

const applyFilters = (order: Order) => {
  const matchesStatus = !filters.status || order.status === filters.status;
  const matchesPayment = !filters.payment || order.paymentStatus === filters.payment;
  const matchesSearch = !searchQuery || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesDate = !filters.date || order.date.includes(filters.date);

  return matchesStatus && matchesPayment && matchesSearch && matchesDate;
};

return (
  <div className="min-h-screen bg-background">
    <Navbar />

    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Order Management
          </h1>
          <p className="text-muted mt-1">View and manage orders</p>
        </div>

        {/* Filters */}
        <Card className="bg-white rounded-lg shadow-sm border-border p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              placeholder="Status"
              onValueChange={setFilters}
              className="flex-1"
              dataStatus={filters.status}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              placeholder="Payment"
              onValueChange={setFilters}
              className="flex-1"
              dataPayment={filters.payment}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              placeholder="Date"
              onValueChange={setFilters}
              className="flex-1"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Dates</SelectItem>
                <SelectItem value="Sep 2024">September 2024</SelectItem>
                <SelectItem value="Aug 2024">August 2024</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border-border px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>
        </Card>

        {/* Orders Table */}
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
              {orders
                .filter(applyFilters)
                .map((order) => (
                  <TableRow key={order.id} className="border-b">
                    <TableCell className="p-4 font-medium">
                      #{order.id}
                    </TableCell>
                    <TableCell className="p-4">
                      {order.customer}
                    </TableCell>
                    <TableCell className="p-4 text-sm text-muted">
                      {order.date}
                    </TableCell>
                    <TableCell className="p-4 font-medium text-primary">
                      $ {order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="p-4">
                      {order.paymentStatus === 'SUCCESS' ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell className="p-4">
                      <span
                        className={`
                          px-2 py-1 rounded text-xs ${
                            order.status === 'DELIVERED' ? 'bg-success text-success/90' :
                            order.status === 'SHIPPED' ? 'bg-primary text-primary/90' :
                            order.status === 'PENDING' ? 'bg-muted bg-border/50' :
                            ''
                        }`
                      }>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* No orders message */}
          {orders.filter(applyFilters).length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted">No orders found</p>
            </div>
          )}

          {/* Pagination */}
          <Separator />
          <div className="mt-6 flex justify-center">
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