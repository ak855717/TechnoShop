import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">
                Techno<span className="text-gray-400 font-light">Shop</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for premium tech products. Exclusively curated for technology enthusiasts.
            </p>
            <div className="flex gap-4 mt-6">
              {["twitter", "instagram", "youtube", "github"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:border-white hover:text-white transition-colors text-xs capitalize">{s[0].toUpperCase()}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-4 text-gray-400">Shop</h4>
            <ul className="space-y-3">
              {["Smartphones", "Laptops", "Headphones", "Cameras", "Gaming", "Drones", "Wearables"].map((c) => (
                <li key={c}>
                  <Link to={`/shop?category=${c}`} className="text-sm text-gray-400 hover:text-white transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-4 text-gray-400">Company</h4>
            <ul className="space-y-3">
              {[["About", "/about"], ["Contact", "/contact"], ["Wishlist", "/wishlist"], ["Cart", "/cart"]].map(([l, p]) => (
                <li key={l}>
                  <Link to={p} className="text-sm text-gray-400 hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-4 text-gray-400">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get the latest tech deals and launches.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-600"
              />
              <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Go
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 TechnoShop. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
              <a key={t} href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
