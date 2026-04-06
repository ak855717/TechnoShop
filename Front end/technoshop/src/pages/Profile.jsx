import { useShop } from "../context/ShopContext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, logout, updateProfile } = useShop();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: "Home", street: "", city: "", state: "", postalCode: "", country: "", isDefault: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    setAddresses(user.addresses || []);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
          <a href="/login" className="text-blue-600 hover:text-blue-800">Go to Login</a>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await updateProfile({ ...form, addresses });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.country) {
      setError("Please fill Street, City and Country for new address.");
      return;
    }

    const next = newAddress.isDefault
      ? addresses.map((addr) => ({ ...addr, isDefault: false }))
      : addresses;

    setAddresses([...next, newAddress]);
    setNewAddress({ label: "Home", street: "", city: "", state: "", postalCode: "", country: "", isDefault: false });
    setError("");
  };

  const removeAddress = (idx) => {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  };

  const setDefaultAddress = (idx) => {
    setAddresses((prev) => prev.map((addr, i) => ({ ...addr, isDefault: i === idx })));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex flex-wrap items-center justify-between mb-8 gap-3">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2"
                      placeholder="e.g. +1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
                {addresses.length === 0 ? (
                  <p className="text-sm text-gray-500">No addresses yet. Add one below.</p>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address, idx) => (
                      <div key={`${address.street}-${idx}`} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm text-gray-900">{address.label || "Saved Address"}</strong>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDefaultAddress(idx)}
                              className={`text-xs font-semibold px-2 py-1 rounded ${address.isDefault ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
                            >
                              {address.isDefault ? "Default" : "Set Default"}
                            </button>
                            <button
                              onClick={() => removeAddress(idx)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state || ""} {address.postalCode || ""}</p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-4">
                <input
                  type="text"
                  placeholder="Label (Home, Work)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress((p) => ({ ...p, postalCode: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress((p) => ({ ...p, country: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress((p) => ({ ...p, isDefault: e.target.checked }))}
                  id="defaultAddress"
                  className="rounded"
                />
                <label htmlFor="defaultAddress" className="text-sm text-gray-700">Make default</label>
              </div>
              <button
                onClick={handleAddAddress}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Address
              </button>
            </div>

            <div className="mt-8 space-y-2">
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}