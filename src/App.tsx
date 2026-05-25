import { useState, useEffect, memo } from 'react';
import { ShoppingCart, Search, Menu, ArrowRight, ShieldCheck, Truck, Zap, Star, X } from 'lucide-react';

// Production-ready Product Type
interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
  inStock: boolean;
}

const FEATURED_PRODUCTS: Product[] = [
  { id: 1, name: "Edge Pro Keyboard", price: 149.00, rating: 4.9, category: "Peripherals", inStock: true },
  { id: 2, name: "Vite Velocity Monitor", price: 499.00, rating: 4.8, category: "Displays", inStock: true },
  { id: 3, name: "Cloudflare Developer Hoodie", price: 55.00, rating: 5.0, category: "Apparel", inStock: true },
  { id: 4, name: "Zero-Trust Security Key", price: 45.00, rating: 4.9, category: "Security", inStock: false }
];

// 1. Technical SEO: JSON-LD Injection
const injectStructuredData = (products: Product[]) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "CyberStore",
    "description": "High-performance gear for elite developers.",
    "offers": products.map(p => ({
      "@type": "Product",
      "name": p.name,
      "category": p.category,
      "offers": {
        "@type": "Offer",
        "price": p.price,
        "priceCurrency": "USD",
        "availability": p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": p.rating,
        "reviewCount": Math.floor(Math.random() * 100) + 50 // Mock data
      }
    }))
  };

  let script = document.getElementById('json-ld-store');
  if (!script) {
    script = document.createElement('script');
    script.id = 'json-ld-store';
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
};

// 2. Performance: Memoized Product Card
const ProductCard = memo(({ product, onAddToCart }: { product: Product, onAddToCart: () => void }) => (
  <article className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full">
    <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative group-hover:bg-slate-200 transition-colors">
      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-mono text-xs opacity-50">
        [ Image: {product.category} ]
      </div>
      {!product.inStock && (
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          Sold Out
        </div>
      )}
    </div>
    
    <div className="flex-grow">
      <p className="text-xs font-semibold text-blue-600 mb-1 tracking-wide uppercase">{product.category}</p>
      <h3 className="font-bold text-slate-900 leading-tight">
        <a href={`/product/${product.id}`} className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm">
          <span aria-hidden="true" className="absolute inset-0 z-0" />
          {product.name}
        </a>
      </h3>
    </div>
    
    <div className="flex items-center gap-1 my-3">
      <Star className="fill-yellow-400 text-yellow-400" size={14} aria-hidden="true" />
      <span className="text-xs font-medium text-slate-600" aria-label={`Rating ${product.rating} out of 5`}>
        {product.rating}
      </span>
    </div>

    <div className="flex items-center justify-between mt-auto border-t border-slate-100 pt-4">
      <p className="text-lg font-extrabold text-slate-900">${product.price.toFixed(2)}</p>
      <button 
        disabled={!product.inStock}
        className={`relative z-10 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
          product.inStock 
            ? 'bg-slate-900 hover:bg-blue-600 text-white shadow-md hover:shadow-blue-500/25' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
        aria-label={product.inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
        onClick={(e) => {
          e.preventDefault();
          onAddToCart();
        }}
      >
        <ShoppingCart size={18} />
      </button>
    </div>
  </article>
));

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Initialize SEO Data
  useEffect(() => {
    injectStructuredData(FEATURED_PRODUCTS);
  }, []);

  // UI/UX: Close mobile menu on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Announcement Bar */}
      <div 
        role="alert" 
        className="bg-slate-900 text-slate-50 py-2 text-center text-xs sm:text-sm font-medium tracking-wide z-50 relative"
      >
        Free global edge-routed shipping on orders over $100
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 transition-all">
            
            {/* Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -ml-2 text-slate-600 hover:text-slate-900 sm:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <a href="/" className="font-extrabold text-2xl tracking-tighter text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm">
                CYBER<span className="text-blue-600">STORE</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-8" aria-label="Main navigation">
              {['New Arrivals', 'Hardware', 'Apparel'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-1 py-0.5"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button aria-label="Search catalog" className="text-slate-600 hover:text-slate-900 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                <Search size={20} />
              </button>
              <button 
                className="relative text-slate-600 hover:text-slate-900 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                aria-label={`Shopping Cart, ${cartCount} items`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-sm">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <nav className="sm:hidden border-t border-slate-200 bg-white animate-in slide-in-from-top-2 duration-200">
            <ul className="px-4 pt-2 pb-4 space-y-1">
              {['New Arrivals', 'Hardware', 'Apparel', 'Accessories'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden border-b border-slate-200">
          {/* Subtle background gradient to replace heavy images */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70 pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:flex lg:items-center lg:gap-x-10">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-lg leading-[1.1]">
                High-Performance Gear for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Elite Developers.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 max-w-xl">
                Upgrade your workstation with peripherals engineered for zero latency. Built for professionals who demand execution speed.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
                <a href="#shop" className="bg-slate-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                  Shop the Collection 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#philosophy" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1">
                  Read our philosophy <span aria-hidden="true" className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Banners */}
        <section className="bg-slate-900 py-16 text-white" aria-labelledby="value-props">
          <h2 id="value-props" className="sr-only">Our Guarantees</h2>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              {[
                { icon: Zap, title: "Edge-Speed Fulfillment", desc: "Orders processed dynamically based on geographic proximity." },
                { icon: ShieldCheck, title: "Enterprise Security", desc: "Zero-trust checkout. Financial data never touches our state." },
                { icon: Truck, title: "Global Routing", desc: "Free shipping on hardware orders exceeding $100." }
              ].map((prop, i) => (
                <div key={i} className="flex flex-col items-center pt-8 sm:pt-0 first:pt-0 animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="bg-slate-800/50 p-3 rounded-2xl mb-4 text-blue-400">
                    <prop.icon size={28} aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg tracking-tight">{prop.title}</h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs">{prop.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="shop" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Hardware</h2>
                <p className="text-slate-500 mt-2 text-lg">Production-ready gear for your local environment.</p>
              </div>
              <a href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-1 flex items-center gap-1 group">
                View catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {FEATURED_PRODUCTS.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => setCartCount(c => c + 1)} 
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold tracking-tighter text-xl">
            CYBER<span className="text-blue-600">STORE</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CyberStore. Architected on Cloudflare Edge.
          </p>
          <nav className="flex space-x-6 text-sm font-medium text-slate-600" aria-label="Footer Navigation">
            {['Privacy', 'Terms', 'Shipping API'].map(link => (
              <a key={link} href={`/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-1">
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
