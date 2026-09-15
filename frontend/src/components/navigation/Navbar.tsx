import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <nav aria-label="Primary navigation" className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-xl font-bold text-primary" aria-label="ShopSphere home">ShopSphere</Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/products"
            className="text-sm text-foreground hover:text-primary"
            aria-current={isCurrent('/products') ? 'page' : undefined}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="relative text-sm text-foreground hover:text-primary"
            aria-current={isCurrent('/cart') ? 'page' : undefined}
          >
            Cart
          </Link>
          <Link
            to="/profile"
            className="text-sm text-foreground hover:text-primary"
            aria-current={isCurrent('/profile') ? 'page' : undefined}
          >
            Profile
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/cart"
            className="p-2"
            aria-label="Shopping cart"
            aria-current={isCurrent('/cart') ? 'page' : undefined}
          >
            <ShoppingCart aria-hidden="true" className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="p-2"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-border bg-background p-4 space-y-3" aria-label="Mobile navigation">
          <Link to="/products" className="block" aria-current={isCurrent('/products') ? 'page' : undefined}>Products</Link>
          <Link to="/cart" className="block" aria-current={isCurrent('/cart') ? 'page' : undefined}>Cart</Link>
          <Link to="/profile" className="block" aria-current={isCurrent('/profile') ? 'page' : undefined}>Profile</Link>
        </div>
      )}
    </nav>
  );
};
