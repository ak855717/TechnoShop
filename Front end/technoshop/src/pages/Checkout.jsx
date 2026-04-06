import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function Checkout() {
  const { cart, cartTotal, user, clearCart, products } = useShop();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  const addresses = user?.addresses || [];

  useEffect(() => {
    const defaultIndex = addresses.findIndex((address) => address.isDefault);
    setSelectedAddressIndex(defaultIndex >= 0 ? defaultIndex : 0);
  }, [addresses]);

  const shipping = cartTotal > 99 ? 0 : 9.99;
  const tax = Number((cartTotal * 0.08).toFixed(2));
  const total = Number((cartTotal + shipping + tax).toFixed(2));

  const selectedAddress = addresses[selectedAddressIndex] || null;

  const shippingAddress = useMemo(() => {
    if (!selectedAddress || !user) return null;

    return {
      fullName: user.name || "",
      phone: user.phone || "",
      address: selectedAddress.street || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "NA",
      postalCode: selectedAddress.postalCode || "000000",
      country: selectedAddress.country || "India",
    };
  }, [selectedAddress, user]);

  const orderItems = useMemo(
    () =>
      cart.map((item) => {
        const directId = item?._id || item?.id || "";
        const matchedProduct =
          /^[a-f\d]{24}$/i.test(String(directId))
            ? null
            : products.find(
                (product) =>
                  String(product.name || "").trim().toLowerCase() === String(item.name || "").trim().toLowerCase() &&
                  (!item.brand || String(product.brand || "").trim().toLowerCase() === String(item.brand || "").trim().toLowerCase())
              );

        return {
          product: String(matchedProduct?._id || matchedProduct?.id || directId || ""),
          name: item.name,
          brand: item.brand,
          category: item.category,
          quantity: item.quantity,
          selectedColor: item.selectedColor || "",
        };
      }),
    [cart, products]
  );

  const placeCodOrder = async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        shippingAddress,
        paymentMethod: "COD",
        orderItems,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Could not place order.");
    }

    clearCart();
    setSuccessOrder(data.order);
    setError("");
  };

  const payWithRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error("Razorpay checkout failed to load. Please check your internet connection.");
    }

    const orderResponse = await fetch(`${API_BASE_URL}/orders/razorpay/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        shippingAddress,
        paymentMethod: "Razorpay",
        orderItems,
      }),
    });

    const orderData = await orderResponse.json();
    if (!orderResponse.ok) {
      throw new Error(orderData.message || "Unable to initialize Razorpay payment.");
    }

    await new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: orderData.key,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "TechnoShop",
        description: `Payment for ${cart.length} item${cart.length !== 1 ? "s" : ""}`,
        order_id: orderData.razorpayOrder.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          shippingAddress: shippingAddress?.address || "",
        },
        theme: {
          color: "#111827",
        },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/orders/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                ...paymentResponse,
                shippingAddress,
                paymentMethod: "Razorpay",
                orderItems,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || "Payment verification failed.");
            }

            clearCart();
            setSuccessOrder(verifyData.order);
            setError("");
            resolve();
          } catch (verificationError) {
            reject(verificationError);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment window was closed before completion.")),
        },
      });

      razorpay.on("payment.failed", (response) => {
        reject(new Error(response.error?.description || "Payment failed. Please try again."));
      });

      razorpay.open();
    });
  };

  const handleCheckout = async () => {
    if (!user?.phone || !shippingAddress) {
      setError("Please update your profile with a phone number and shipping address before checkout.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (orderItems.some((item) => !/^[a-f\d]{24}$/i.test(String(item.product || "")))) {
      setError("Your cart has an outdated product. Please remove it and add it again before checkout.");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      if (paymentMethod === "COD") {
        await placeCodOrder();
      } else {
        await payWithRazorpay();
      }
    } catch (checkoutError) {
      setError(checkoutError.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (successOrder) {
    return (
      <div className="pt-24 min-h-screen bg-[#F2F0EB] flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order placed successfully</h1>
          <p className="text-gray-600 mb-2">Your order ID is <span className="font-semibold">{successOrder._id}</span>.</p>
          <p className="text-gray-600 mb-6">
            Payment status: <span className="font-semibold">{successOrder.isPaid ? "Paid" : "Cash on Delivery"}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
            <Link to="/profile" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-[#F2F0EB] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add products to the cart to start your checkout.</p>
          <Link to="/shop" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#F2F0EB] px-4 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600 mb-6">Pay online with Razorpay or place a cash-on-delivery order.</p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping address</h2>
            {addresses.length === 0 ? (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                No saved address found. Please update your profile before checkout. <Link to="/profile" className="font-semibold underline">Go to Profile</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address, index) => (
                  <label key={`${address.street}-${index}`} className={`block border rounded-xl p-4 cursor-pointer ${selectedAddressIndex === index ? "border-black bg-gray-50" : "border-gray-200"}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingAddress"
                        checked={selectedAddressIndex === index}
                        onChange={() => setSelectedAddressIndex(index)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {address.label || "Saved Address"} {address.isDefault ? "(Default)" : ""}
                        </p>
                        <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state || ""} {address.postalCode || ""}</p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment method</h2>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer ${paymentMethod === "Razorpay" ? "border-black bg-gray-50" : "border-gray-200"}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "Razorpay"}
                  onChange={() => setPaymentMethod("Razorpay")}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-gray-900">Razorpay</p>
                  <p className="text-sm text-gray-600">UPI, cards, net banking and wallets.</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer ${paymentMethod === "COD" ? "border-black bg-gray-50" : "border-gray-200"}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Place the order now and pay when it arrives.</p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order summary</h2>
          <div className="space-y-3 text-sm">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedColor}`} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}{item.selectedColor ? ` • ${item.selectedColor}` : ""}</p>
                </div>
                <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>₹{tax.toFixed(2)}</span></div>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing || addresses.length === 0}
            className="w-full mt-6 py-3.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : paymentMethod === "COD" ? "Place COD Order" : `Pay ₹${total.toFixed(2)} with Razorpay`}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Your payment is processed securely. Use test mode cards/UPI in Razorpay checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
