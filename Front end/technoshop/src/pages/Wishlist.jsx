import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

export default function Wishlist() {
  const { wishlist, dispatch } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-7xl mb-6">🤍</div>
          <h2 className="text-2xl font-bold text-black mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save your favorite tech products for later!</p>
          <Link to="/shop" className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
            Discover Products
          </Link>
        </div>
      </div>
    );
  }
  const data = "Wishlist"

  return (
    <div className="pt-16 min-h-screen bg-white">
      <Header data={data} />
      <div className="bg-[#F2F0EB] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 mt-1">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => {
              wishlist.forEach((p) => dispatch({ type: "TOGGLE_WISHLIST", payload: p }));
            }}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
