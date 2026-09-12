import React, { useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, Input, Button, Separator, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, } from '@/components/ui';
import { Plus, Trash, Edit, Search, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Premium Leather Sofa', sku: 'LS-001', price: 1299.99, category: 'Furniture', stock: 12, active: true },
  { id: 2, name: 'Modern Dining Table', sku: 'DT-002', price: 899.99, category: 'Furniture', stock: 8, active: true },
  { id: 3, name: 'Ergonomic Office Chair', sku: 'OC-003', price: 399.99, category: 'Office', stock: 25, active: true },
];

const [products, setProducts] = useState(initialProducts);
const navigate = useNavigate();

const handleAddProduct = () => {
  // Open add product dialog
};

const handleEditProduct = (product: Product) => {
  // Open edit product dialog
};

const handleDeleteProduct = (id: number) => {
  setProducts(products.filter(p => p.id !== id));
};

const handleToggleActive = (id: number) => {
  setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
};

return (
  <div className="min-h-screen bg-background">
    <Navbar />

    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Product Management
          </h1>
          <p className="text-muted mt-1">Manage your product catalog</p>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Button
            onClick={handleAddProduct}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <Card className="bg-white rounded-lg shadow-sm border-border overflow-x-auto">
          <div className="p-6 border-b border-border">
            <h2 className="text-font-medium text-foreground">Products</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-foreground p-4">Product</th>
                  <th className="text-left text-sm font-medium text-foreground p-4">SKU</th>
                  <th className="text-left text-sm font-medium text-foreground p-4">Price</th>
                  <th className="text-left text-sm font-medium text-foreground p-4">Category</th>
                  <th className="text-left text-sm font-medium text-foreground p-4">Stock</th>
                  <th className="text-left text-sm font-medium text-foreground p-4">Status</th>
                  <th className="text-left text-sm font-medium text-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4 font-medium text-foreground">
                      {product.name}
                    </td>
                    <td className="p-4 text-sm text-muted">{product.sku}</td>
                    <td className="p-4 font-medium text-primary">$ {product.price.toFixed(2)}</td>
                    <td className="p-4 text-sm text-muted">{product.category}</td>
                    <td className="p-4 text-sm">
                      {product.stock} <span className="text-xs text-muted">in stock</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`
                          px-2 py-1 rounded ${
                            product.active ? 'bg-success text-success/90' : 'bg-destructive text-destructive/90'
                        }`
                      }>
                        {product.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 text-xs text-primary hover:underline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleToggleActive(product.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          {product.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* No products message */}
        {products.length === 0 && (
          <p className="text-muted text-center py-12">
            No products found. Add your first product.
          </p>
        )}

        {/* Pagination */}
        <Separator />
        <div className="mt-6 flex justify-center">
          <nav aria-label="Product pagination">
            <div className="flex gap-2">
              <Button size="sm" disabled>Previous</Button>
              <Button size="sm" variant="secondary">1</Button>
              <Button size="sm" variant="primary">2</Button>
              <Button size="sm" disabled>Next</Button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
});