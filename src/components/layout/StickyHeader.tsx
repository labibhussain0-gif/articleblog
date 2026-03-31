import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Politics', href: '/category/politics' },
  { name: 'Economy', href: '/category/economy' },
  { name: 'Culture', href: '/category/culture' },
  { name: 'Tech', href: '/category/tech' },
];

export default function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md'
        : 'bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold tracking-normal"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="text-red-700">The Daily</span>
            <span className="text-amber-500"> Pulse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${location.pathname === link.href || location.pathname.startsWith(link.href)
                  ? 'bg-red-700 text-white dark:bg-red-900/40 dark:text-red-400'
                  : 'bg-slate-700 text-white dark:bg-slate-700 dark:text-white hover:bg-red-700 hover:text-white dark:hover:bg-red-900/30 dark:hover:text-red-400'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="search"
                aria-label="Search articles"
                placeholder="Search articles..."
                className="w-48 lg:w-64 px-4 py-2 pl-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-4 py-3 rounded-full text-base font-medium transition-colors ${location.pathname === link.href || location.pathname.startsWith(link.href)
                  ? 'bg-red-700 text-white dark:bg-red-900/40 dark:text-red-400'
                  : 'bg-slate-700 text-white dark:bg-slate-700 dark:text-white hover:bg-red-700 hover:text-white dark:hover:bg-red-900/30 dark:hover:text-red-400'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <div className="relative">
                <input
                  type="search"
                  aria-label="Search articles"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 pl-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
