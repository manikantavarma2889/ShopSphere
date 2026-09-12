import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-xl font-bold text-primary">ShopSphere</Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm text-foreground hover:text-primary">Products</Link>
          <Link to="/cart" className="relative">Cart</Link>
          <Link to="/profile" className="text-sm text-foreground hover:text-primary">Profile</Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart" className="p-2" aria-label="Cart"><ShoppingCart className="h-5 w-5" /></Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          <Link to="/products" className="block" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link to="/cart" className="block" onClick={() => setIsMenuOpen(false)}>Cart</Link>
          <Link to="/profile" className="block" onClick={() => setIsMenuOpen(false)}>Profile</Link>
        </div>
      )}
    </nav>
  );
};
