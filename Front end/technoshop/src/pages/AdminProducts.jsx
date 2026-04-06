import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function AdminProducts() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const { user } = useShop();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", brand: "", category: "", price: "", stock: "", image: "", description: "", isNew: false, discount: 0 });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not load products");
      }
      setProducts(data.products || data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm({ name: "", brand: "", category: "", price: "", stock: "", image: "", description: "", isNew: false, discount: 0 });
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.brand || !form.category || !form.price || !form.stock || !form.image || !form.description) {
      setError("Fill in all required fields.");
      return;
    }

    try {
      const endpoint = editingId ? `${API_BASE_URL}/products/${editingId}` : `${API_BASE_URL}/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), discount: Number(form.discount), isNew: !!form.isNew }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Product save failed");

      setMessage(editingId ? "Product updated successfully" : "Product added successfully");
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price || "",
      stock: product.stock || "",
      image: product.image || "",
      description: product.description || "",
      isNew: !!product.isNew,
      discount: product.discount || 0,
    });
    setMessage("");
    setError("");
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Product Management</h1>
          <button onClick={() => navigate("/")} className="px-3 py-2 bg-black text-white rounded-md">Back to store</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">{editingId ? "Edit Product" : "Add Product"}</h2>

          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <form onSubmit={handleSave} className="grid gap-3 md:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product Name" className="border p-2 rounded" />
            <input value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} placeholder="Brand" className="border p-2 rounded" />
            <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" className="border p-2 rounded" />
            <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className="border p-2 rounded" />
            <input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} placeholder="Stock" className="border p-2 rounded" />
            <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL" className="border p-2 rounded" />
            <input type="number" value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} placeholder="Discount %" className="border p-2 rounded" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm((p) => ({ ...p, isNew: e.target.checked }))} /> Is New</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="border p-2 rounded md:col-span-2" rows={4} />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingId ? "Update" : "Create"}</button>
              {editingId && (<button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>)}
            </div>
          </form>
        </div>

        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product._id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.brand} - {product.category}</p>
                  <p className="text-sm text-gray-500">₹{product.price} | stock {product.stock}</p>
                </div>
                <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-yellow-400 text-black rounded">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}