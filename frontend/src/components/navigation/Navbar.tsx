import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  Search,
  Box,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  showForAdmin?: boolean;
}

const NavItems: NavItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
];

const MobileNavItems: NavItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Cart', href: '/cart' },
  { label: 'Profile', href: '/profile' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useWindowSize();

  const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold text-primary">
            ShopSphere
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NavItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <Link to="/cart" className="relative">
            Cart
            <span className="absolute -top-1 -right-1 bg-primary text-xs text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center">
              {isMobile ? 0 : 3}
            </span>
          </Link>

          {user?.role === 'ADMIN' && (
            <Link to="/admin/dashboard" className="text-sm text-foreground hover:text-primary transition-colors">
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleMenuOpen}
          className="md:hidden p-2"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile Cart Count */}
        <button className="md:hidden p-2">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-primary text-xs text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-background/90 z-40 flex flex-col items-center justify-center pt-20 gap-8">
          <Link to="/products" className="text-2xl font-bold hover:text-primary transition-colors">
            Products
          </Link>
          <Link to="/cart" className="text-2xl font-bold hover:text-primary transition-colors">
            Cart
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin/dashboard" className="text-2xl font-bold hover:text-primary transition-colors">
              Admin
            </Link>
          )}
          <button onClick={handleCloseMenu} className="text-2xl font-bold hover:text-destructive transition-colors">
            Close
          </button>
        </div>
      )}
    </nav>
  );
};

// Helper hook to detect window size
function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width < 768;
}