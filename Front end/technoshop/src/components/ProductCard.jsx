import { Link, useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function ProductCard({ product }) {
  const { dispatch, isInWishlist, isInCart, isLoggedIn } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="group relative bg-white">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-50 rounded-2xl aspect-square mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1593640408182-31c228b2e0bc?w=600&q=80"; }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-black text-white text-xs font-semibold rounded-full">NEW</span>
          )}
          {product.discount > 0 && (
            <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">-{product.discount}%</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) {
              navigate("/login", { state: { from: location }, replace: true });
              return;
            }
            dispatch({ type: "TOGGLE_WISHLIST", payload: product });
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 ${
            inWishlist ? "bg-black text-white" : "bg-white text-gray-500 hover:text-black shadow-md"
          }`}
        >
          <svg className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!isLoggedIn) {
                navigate("/login", { state: { from: location }, replace: true });
                return;
              }
              dispatch({
                type: "ADD_TO_CART",
                payload: { ...product, selectedColor: product.color?.[0] || "Default" },
              });
            }}
            className={`w-full py-3 text-sm font-semibold transition-colors ${
              inCart
                ? "bg-green-500 text-white"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {inCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="font-medium text-gray-900 text-sm leading-snug hover:text-black line-clamp-2 block mb-2">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-black">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-gray-400 text-sm line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {/* Stars */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>
      </div>
    </div>
  );
}
