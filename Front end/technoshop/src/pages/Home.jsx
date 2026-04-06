import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

const categoryConfig = [
  { name: "Smartphones", icon: "📱" },
  { name: "Laptops", icon: "💻" },
  { name: "Headphones", icon: "🎧" },
  { name: "Cameras", icon: "📷" },
  { name: "Gaming", icon: "🎮" },
  { name: "Drones", icon: "🚁" },
  { name: "Wearables", icon: "⌚" },
  { name: "Tablets", icon: "📲" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const { products, productsLoading } = useShop();

  const categories = useMemo(
    () =>
      categoryConfig.map((category) => ({
        ...category,
        count: products.filter((product) => product.category === category.name).length,
      })),
    [products]
  );

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
    return uniqueBrands.length > 0 ? uniqueBrands : ["Apple", "Samsung", "Sony", "DJI"];
  }, [products]);

  const featured = useMemo(() => {
    const featuredProducts = products.filter((product) => product.isFeatured);
    return (featuredProducts.length > 0 ? featuredProducts : products).slice(0, 8);
  }, [products]);

  const newArrivals = useMemo(() => {
    const latestProducts = products.filter((product) => product.isNew);
    return (latestProducts.length > 0 ? latestProducts : products).slice(0, 4);
  }, [products]);

  const stats = [
    [`${products.length || 0}+`, "Products"],
    [`${brands.length || 0}`, "Brands"],
    ["10K+", "Happy Customers"],
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvNqtCPiO6QsLGIpHsl8-Qbzsbrs8PYxjYZw&s",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-[#F2F0EB] min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-1 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-wider uppercase">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                New Arrivals — Tech 2025
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-black mb-6">
                Gear Up for the{" "}
                <span className="relative">
                  Future
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-black rounded-full" />
                </span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
                The only store exclusively built for tech lovers. From Apple to Sony, DJI to Samsung — discover the latest innovations, all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-center"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 border-2 border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white transition-colors text-center"
                >
                  Our Story
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-12">
                {stats.map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-black">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative col-2">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] ">
                <Slider {...sliderSettings}>
                  {heroImages.map((image, idx) => (
                    <div key={idx} className="w-full h-full">
                      <img
                        src={image}
                        alt={`Hero ${idx + 1}`}
                        className="w-full h-full object-cover aspect-[4/3]"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              {/* Floating cards */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl p-4 shadow-xl z-20 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-black">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $99</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-black text-white rounded-2xl p-4 shadow-xl z-20">
                <p className="text-2xl font-bold">4.9★</p>
                <p className="text-xs text-gray-400 mt-1">10K+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <section className="border-y border-gray-100 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">Official Products From</p>
          <div className="grid grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand}
                to={`/shop?brand=${brand}`}
                className="flex items-center justify-center py-4 px-6 border border-gray-100 rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-xl font-bold text-gray-300 group-hover:text-black transition-colors">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Browse By</p>
              <h2 className="text-3xl font-bold text-black">Categories</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1">
              View all <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                className="group flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-2xl hover:bg-black transition-all duration-300 cursor-pointer"
              >
                <span className="text-4xl mb-3">{cat.icon}</span>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-white transition-colors">{cat.name}</p>
                <p className="text-xs text-gray-400 group-hover:text-gray-400 mt-1">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#F2F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Handpicked For You</p>
              <h2 className="text-3xl font-bold text-black">Featured Products</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1">
              See all <span className="text-lg">→</span>
            </Link>
          </div>
          {productsLoading ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500">Loading products from the database...</div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500">No products found in the database yet.</div>
          )}
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Just Dropped</p>
              <h2 className="text-3xl font-bold text-black">New Arrivals</h2>
            </div>
            <Link to="/shop?tag=new" className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1">
              See all <span className="text-lg">→</span>
            </Link>
          </div>
          {productsLoading ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center text-gray-500">Loading new arrivals...</div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Big feature */}
              <div className="lg:col-span-1 relative overflow-hidden rounded-3xl bg-black group cursor-pointer">
                <Link to={`/product/${newArrivals[0]?.id}`}>
                  <img
                    src={newArrivals[0]?.image}
                    alt={newArrivals[0]?.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500 min-h-[350px]"
                  />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="inline-block px-2.5 py-1 bg-white text-black text-xs font-bold rounded-full mb-2 w-fit">NEW</span>
                    <h3 className="text-white text-xl font-bold leading-tight">{newArrivals[0]?.name}</h3>
                    <p className="text-gray-300 text-sm mt-1">${newArrivals[0]?.price?.toLocaleString()}</p>
                  </div>
                </Link>
              </div>
              {/* 3 stacked */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {newArrivals.slice(1, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-8 text-center text-gray-500">No new arrivals are available yet.</div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Limited Time Offer</p>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">Up to 25% Off on Sony Headphones</h2>
              <p className="text-gray-400 mb-8">Premium audio, premium experience. Don't miss out on the world's best noise cancellation.</p>
              <Link
                to="/shop?brand=Sony&category=Headphones"
                className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Shop Sony Audio
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"
                alt="Sony Headphones"
                className="w-80 h-80 object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why TechnoShop */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-black">The TechnoShop Promise</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🎯", title: "Tech Exclusive", desc: "Only tech products, no clutter. Curated for enthusiasts." },
              { icon: "✅", title: "Genuine Products", desc: "100% authentic from official brand channels." },
              { icon: "🚀", title: "Fast Delivery", desc: "Same-day dispatch on orders before 2 PM." },
              { icon: "🔄", title: "Easy Returns", desc: "30-day hassle-free return policy on all products." },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-black transition-colors group">
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="font-bold text-black mb-2 group-hover:text-black">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        className="py-20 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-gray-200 mb-8">Get notified about exclusive deals, new launches, and tech news.</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
              alert("Thanks for subscribing!");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-white text-sm bg-white"
            />
            <button type="submit" className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
