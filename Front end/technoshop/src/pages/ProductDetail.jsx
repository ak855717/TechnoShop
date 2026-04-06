import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, productsLoading, productsError, dispatch, isInWishlist, isInCart } = useShop();

  const product = useMemo(
    () => products.find((item) => String(item.id) === String(id) || String(item._id) === String(id)),
    [id, products]
  );

  const related = useMemo(
    () =>
      product
        ? products
            .filter(
              (item) =>
                item.category === product.category && String(item.id) !== String(product.id)
            )
            .slice(0, 4)
        : [],
    [product, products]
  );

  const [selectedColor, setSelectedColor] = useState("Default");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.color?.[0] || "Default");
      setActiveImg(0);
    }
  }, [product]);

  if (productsLoading) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold mb-2">Loading product...</h2>
        <p className="text-gray-500">Fetching the latest details from the database.</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold mb-2">Could not load product</h2>
        <p className="text-red-600 mb-4">{productsError}</p>
        <Link to="/shop" className="px-6 py-3 bg-black text-white rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="px-6 py-3 bg-black text-white rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", payload: { ...product, selectedColor } });
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-black font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden">
              <img
                src={product.images?.[activeImg] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1593640408182-31c228b2e0bc?w=800&q=80"; }}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-black" : "border-gray-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Brand + badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link to={`/shop?brand=${product.brand}`} className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                {product.brand}
              </Link>
              {product.isNew && <span className="px-2.5 py-1 bg-black text-white text-xs font-semibold rounded-full">NEW</span>}
              {product.discount > 0 && <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">-{product.discount}% OFF</span>}
              {product.stock <= 10 && <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full border border-orange-200">Only {product.stock} left</span>}
            </div>

            <h1 className="text-3xl font-bold text-black leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-semibold text-sm">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-black">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discount > 0 && (
                <span className="text-green-600 font-semibold text-sm">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Color */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Color: <span className="font-normal text-gray-500">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.color.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 text-sm border-2 rounded-lg transition-colors ${
                      selectedColor === c ? "border-black text-black font-medium" : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-xl text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(Math.max(product.stock, 1), quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center text-xl text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 font-semibold rounded-xl transition-colors ${
                  inCart ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {inCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <button
                onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product })}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${
                  inWishlist ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-black"
                }`}
              >
                <svg className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {inCart && (
              <button
                onClick={() => navigate("/cart")}
                className="w-full py-3.5 border-2 border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white transition-colors"
              >
                View Cart →
              </button>
            )}

            {/* Features */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-3">Key Features</p>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 gap-8 mb-8">
            {["description", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <p className="text-gray-600 leading-relaxed max-w-2xl">{product.description}</p>
          )}

          {activeTab === "specs" && (
            <div className="max-w-xl">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs || {}).map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100">
                      <td className="py-3 pr-8 font-semibold text-gray-900 w-40">{k}</td>
                      <td className="py-3 text-gray-600">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-6xl font-bold text-black">{product.rating}</p>
                <div className="flex justify-center mt-2 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{product.reviews.toLocaleString()} reviews</p>
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-black mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
