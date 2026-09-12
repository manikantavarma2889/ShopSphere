import React from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Card } from '@/components/ui';
import { Users, Box, TrendingUp, Calendar } from 'lucide-react';

interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'success' | 'warning' | 'destructive';
}

const dashboardMetrics: DashboardMetric[] = [
  { label: 'Total Users', value: '2,431', change: '+12%', icon: Users, color: 'primary' },
  { label: 'Total Products', value: '1,247', change: '+8%', icon: Box, color: 'primary' },
  { label: 'Total Orders', value: '3,982', change: '+15%', icon: TrendingUp, color: 'success' },
  { label: 'Revenue', value: '$45,231', change: '+22%', icon: Calendar, color: 'primary' },
];

export const AdminDashboardPage = React.memo(() => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6"><h1 className="text-3xl md:text-4xl font-bold text-foreground">Admin Dashboard</h1><p className="text-muted mt-1">Manage your store operations</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardMetrics.map((metric) => <Card key={metric.label} className="p-6 bg-white rounded-lg shadow-sm border-border"><div className="flex items-start gap-3"><metric.icon className={`h-6 w-6 ${metric.color === 'success' ? 'text-success opacity-80' : 'text-primary'}`} /><div className="flex-1 ml-4"><p className="text-sm text-muted">{metric.label}</p><p className="text-2xl font-bold text-foreground">{metric.value}</p><p className="text-sm text-muted">{metric.change}</p></div></div></Card>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-full"><div className="p-4"><h3 className="text-sm font-medium text-foreground mb-4">Orders This Month</h3><div className="h-24 w-full bg-border/50 rounded-lg" /></div></Card>
          <Card className="h-full"><div className="p-4"><h3 className="text-sm font-medium text-foreground mb-4">Top Products</h3><p className="text-muted text-sm">No data available</p></div></Card>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-8">
          <Card className="p-4"><Box className="h-6 w-6 mb-3 text-primary" /><span className="text-sm font-medium text-foreground">Products</span></Card>
          <Card className="p-4"><TrendingUp className="h-6 w-6 mb-3 text-success" /><span className="text-sm font-medium text-success">Orders</span></Card>
          <Card className="p-4"><Users className="h-6 w-6 mb-3 text-primary" /><span className="text-sm font-medium text-foreground">Users</span></Card>
          <Card className="p-4"><Calendar className="h-6 w-6 mb-3 text-primary" /><span className="text-sm font-medium text-foreground">Analytics</span></Card>
        </div>
      </div>
    </main>
  </div>
));
