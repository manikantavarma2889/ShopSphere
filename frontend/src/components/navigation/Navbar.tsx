import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/products' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useWindowSize();
  const { user } = useAuth();

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-primary">
          ShopSphere
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}

          <Link to="/cart" className="relative flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Link>

          <Link to="/profile" className="text-sm text-foreground hover:text-primary">
            Profile
          </Link>

          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="text-sm text-foreground hover:text-primary">
              Admin Dashboard
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="p-2 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMobile && isMenuOpen && (
        <div className="border-t border-border bg-background p-6 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

function useWindowSize() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
