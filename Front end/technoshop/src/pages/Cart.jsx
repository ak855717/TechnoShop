import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import Header from "../components/Header";

export default function Cart() {
  const { cart, cartTotal, dispatch, user } = useShop();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-black mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any tech yet!</p>
          <Link to="/shop" className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 99 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const data = "Cart"

  return (
    <div className="pt-16 min-h-screen bg-white">
      <Header data={data} />
      <div className="bg-[#F2F0EB] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 mt-1">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedColor}`} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl bg-gray-50"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1593640408182-31c228b2e0bc?w=200&q=80"; }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{item.brand}</p>
                      <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 text-sm leading-snug hover:text-black line-clamp-2">
                        {item.name}
                      </Link>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-400 mt-1">Color: {item.selectedColor}</p>
                      )}
                    </div>
                    <button
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: { id: item.id, selectedColor: item.selectedColor } })}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            dispatch({ type: "REMOVE_FROM_CART", payload: { id: item.id, selectedColor: item.selectedColor } });
                          } else {
                            dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, selectedColor: item.selectedColor, quantity: item.quantity - 1 } });
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, selectedColor: item.selectedColor, quantity: item.quantity + 1 } })}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-black">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
              <Link to="/shop" className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F2F0EB] rounded-2xl p-6 sticky top-24">
              <h2 className="font-bold text-lg text-black mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                    🎉 You qualify for free shipping!
                  </div>
                )}
                {shipping > 0 && (
                  <div className="text-xs text-gray-500 bg-white rounded-lg px-3 py-2">
                    Add ${(99 - cartTotal).toFixed(2)} more for free shipping
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login", { state: { from: { pathname: "/checkout" } }, replace: true });
                    return;
                  }

                  const hasPhone = user.phone && user.phone.trim().length > 0;
                  const hasAddress = Array.isArray(user.addresses) && user.addresses.length > 0;

                  if (!hasPhone || !hasAddress) {
                    alert("Please add your phone number and at least one address in your profile before checkout.");
                    navigate("/profile");
                    return;
                  }

                  navigate("/checkout");
                }}
                className="w-full mt-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
