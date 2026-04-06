import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1593640408182-31c228b2e0bc?w=800&q=80";

const getItemId = (item) => item?._id || item?.product || item?.productId || item?.id || "";
const idsMatch = (left, right) => String(left ?? "") === String(right ?? "");
const normalizeText = (value) => String(value || "").trim().toLowerCase();
const isLikelyMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const findMatchingProduct = (item, productList = []) => {
  const itemId = getItemId(item);

  if (isLikelyMongoId(itemId)) {
    const directMatch = productList.find((product) => idsMatch(getItemId(product), itemId));
    if (directMatch) {
      return directMatch;
    }
  }

  return productList.find(
    (product) =>
      normalizeText(product.name) === normalizeText(item.name) &&
      (!normalizeText(item.brand) || normalizeText(product.brand) === normalizeText(item.brand)) &&
      (!normalizeText(item.category) || normalizeText(product.category) === normalizeText(item.category))
  ) || null;
};

const reconcileStoredCollection = (items, productList = []) => {
  if (!Array.isArray(items) || items.length === 0 || productList.length === 0) {
    return items;
  }

  let changed = false;

  const nextItems = items.reduce((accumulator, item) => {
    const matchedProduct = findMatchingProduct(item, productList);

    if (!matchedProduct) {
      changed = true;
      return accumulator;
    }

    const nextItem = {
      ...normalizeProduct(matchedProduct),
      selectedColor: item.selectedColor || matchedProduct.color?.[0] || "Default",
      quantity: Math.max(1, Number(item.quantity || 1)),
    };

    if (
      !idsMatch(getItemId(item), getItemId(nextItem)) ||
      item.selectedColor !== nextItem.selectedColor ||
      Number(item.quantity || 1) !== nextItem.quantity
    ) {
      changed = true;
    }

    accumulator.push(nextItem);
    return accumulator;
  }, []);

  return changed || nextItems.length !== items.length ? nextItems : items;
};

const normalizeProduct = (product = {}) => ({
  ...product,
  id: getItemId(product),
  image: product.image || product.images?.[0] || FALLBACK_IMAGE,
  images:
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [FALLBACK_IMAGE],
  color: Array.isArray(product.color) && product.color.length > 0 ? product.color : ["Default"],
  features: Array.isArray(product.features) ? product.features : [],
  specs: product.specs || {},
  reviews: Number(product.reviews || 0),
  rating: Number(product.rating || 0),
  originalPrice: Number(product.originalPrice ?? product.price ?? 0),
  discount: Number(product.discount || 0),
  stock: Number(product.stock ?? 0),
  price: Number(product.price ?? 0),
});

const parseStoredItems = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored)
      ? stored.map((item) => ({
          ...normalizeProduct(item),
          selectedColor: item.selectedColor || item.color?.[0] || "Default",
          quantity: Math.max(1, Number(item.quantity || 1)),
        }))
      : [];
  } catch {
    return [];
  }
};

const normalizeUser = (storedUser) => {
  if (!storedUser) {
    return null;
  }

  return {
    ...storedUser,
    phone: storedUser.phone || "",
    addresses: Array.isArray(storedUser.addresses) ? storedUser.addresses : [],
    avatar: storedUser.avatar || "",
  };
};

const parseStoredUser = () => {
  try {
    return normalizeUser(JSON.parse(localStorage.getItem("ts_user") || "null"));
  } catch {
    return null;
  }
};

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [cart, setCart] = useState(() => parseStoredItems("ts_cart"));
  const [wishlist, setWishlist] = useState(() => parseStoredItems("ts_wishlist"));
  const [user, setUser] = useState(() => parseStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const res = await fetch(`${API_BASE_URL}/products?limit=50&sortBy=createdAt&order=desc`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load products");
      }

      setProducts((data.products || []).map(normalizeProduct));
      setProductsError("");
    } catch (err) {
      setProducts([]);
      setProductsError(err.message || "Could not load products");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    setCart((prevCart) => reconcileStoredCollection(prevCart, products));
    setWishlist((prevWishlist) => reconcileStoredCollection(prevWishlist, products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("ts_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ts_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("ts_user", JSON.stringify(user));
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!isMounted) {
          return;
        }

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(normalizeUser(data.user));
      } catch (err) {
        console.warn("Could not fetch current user", err);
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [API_BASE_URL]);

  const addToCart = (product) => {
    const normalizedProduct = {
      ...normalizeProduct(product),
      selectedColor: product.selectedColor || product.color?.[0] || "Default",
    };
    const productId = getItemId(normalizedProduct);

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) =>
          idsMatch(getItemId(item), productId) &&
          item.selectedColor === normalizedProduct.selectedColor
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          idsMatch(getItemId(item), productId) &&
          item.selectedColor === normalizedProduct.selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (id, selectedColor) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(idsMatch(getItemId(item), id) && item.selectedColor === selectedColor)
      )
    );
  };

  const updateQuantity = (id, selectedColor, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        idsMatch(getItemId(item), id) && item.selectedColor === selectedColor
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = (userData) => {
    setUser(normalizeUser(userData));
  };

  const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    const nextUser = normalizeUser(data.user);
    setUser(nextUser);
    return nextUser;
  };

  const googleAuthUser = async (credential) => {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ credential }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Google sign-in failed");
    }

    const nextUser = normalizeUser(data.user);
    setUser(nextUser);
    return nextUser;
  };

  const registerUser = async (name, email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    const nextUser = normalizeUser(data.user);
    setUser(nextUser);
    return nextUser;
  };

  const logoutUser = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Logout request failed", error);
    }

    setUser(null);
    clearCart();
    setWishlist([]);
  };

  const updateProfile = async (userData) => {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Profile update failed");
    }

    const nextUser = normalizeUser(data.user);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    logoutUser();
  };

  const toggleWishlist = (product) => {
    const normalizedProduct = normalizeProduct(product);
    const productId = getItemId(normalizedProduct);

    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => idsMatch(getItemId(item), productId));

      if (exists) {
        return prevWishlist.filter((item) => !idsMatch(getItemId(item), productId));
      }

      return [...prevWishlist, normalizedProduct];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isInWishlist = (id) => wishlist.some((item) => idsMatch(getItemId(item), id));
  const isInCart = (id) => cart.some((item) => idsMatch(getItemId(item), id));

  const dispatch = (action) => {
    switch (action.type) {
      case "ADD_TO_CART":
        addToCart(action.payload);
        break;
      case "TOGGLE_WISHLIST":
        toggleWishlist(action.payload);
        break;
      case "REMOVE_FROM_CART":
        removeFromCart(action.payload.id, action.payload.selectedColor);
        break;
      case "UPDATE_QUANTITY":
        updateQuantity(action.payload.id, action.payload.selectedColor, action.payload.quantity);
        break;
      case "CLEAR_CART":
        clearCart();
        break;
      default:
        console.warn(`Unknown dispatch action type: ${action.type}`);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        productsLoading,
        productsError,
        refreshProducts: fetchProducts,
        cart,
        wishlist,
        cartCount,
        cartTotal,
        isInWishlist,
        isInCart,
        user,
        isLoggedIn,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        login,
        loginUser,
        googleAuthUser,
        registerUser,
        updateProfile,
        logout,
        logoutUser,
        dispatch,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
