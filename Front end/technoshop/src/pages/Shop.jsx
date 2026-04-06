import React, { useState, useMemo, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useShop } from "../context/ShopContext";
import Header from "../components/Header";

function Shop() {
  const { products, productsLoading, productsError, addToCart, toggleWishlist, isInCart, isInWishlist } = useShop();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectBrand, setSelectBrand] = useState("All");
  const [priceRange, setPriceRange] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const categoryOptions = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );
  const brandOptions = useMemo(
    () => ["All", ...new Set(products.map((product) => product.brand).filter(Boolean))],
    [products]
  );
  const showNewOnly = searchParams.get("tag") === "new";

  useEffect(() => {
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    if (brand) {
      setSelectBrand(brand);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedCategory, selectBrand, priceRange, sortBy, showNewOnly]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesBrand = selectBrand === "All" || product.brand === selectBrand;
      const matchesPrice =
        priceRange === null ||
        (product.price >= priceRange.min && product.price <= priceRange.max);
      const matchesTag = !showNewOnly || product.isNew;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesTag;
    });

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectBrand, priceRange, sortBy, showNewOnly]);

  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleBrandFilter = (selectBrand) => {
    setSelectBrand(selectBrand);
  };
  const handlePriceFilter = (min, max) => {
    setPriceRange(
      priceRange?.min === min && priceRange?.max === max ? null : { min, max },
    );
  };

  const data = "Shop"

  return (
    <>
      <div className="pt-16">
        <Header data={data} />
        <section className="px-4 py-3 mx-30">
          {/* Header with sort */}
          <div className="flex items-center gap-6 mb-6 pb-4 border-b">
            <h4 className="text-sm font-medium whitespace-nowrap">
              {filteredProducts.length === 0
                ? "Showing 0 results"
                : `Showing ${currentPage * itemsPerPage + 1}–${Math.min(
                    (currentPage + 1) * itemsPerPage,
                    filteredProducts.length,
                  )} of ${filteredProducts.length} results`}
            </h4>
            <div className="flex-1">
              <form className="text-sm font-medium" action="#">
                <label htmlFor="sort"></label>
                <select
                  name="sort"
                  id="sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                  }}
                  className="w-full max-w-xs px-3 py-2 border rounded"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-asc">Price: Low - High</option>
                  <option value="price-desc">Price: High - Low</option>
                  <option value="name-asc">Price: a - z</option>
                  <option value="name-desc">Price: z - a</option>
                </select>
              </form>
            </div>
          </div>

          {/* Main content with filters and products */}
          <div className="flex gap-8">
            {/* Products Section */}
            <div className="flex-1">
              {productsLoading ? (
                <div className="bg-white rounded-lg shadow-md text-center py-16">
                  <p className="text-xl text-gray-600">Loading products from the database...</p>
                </div>
              ) : productsError ? (
                <div className="bg-white rounded-lg shadow-md text-center py-16">
                  <p className="text-xl text-red-600">{productsError}</p>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedProducts.map((prod) => {
                      const inCart = isInCart(prod.id);
                      const inWishlist = isInWishlist(prod.id);

                      return (
                        <div
                          key={prod.id}
                          className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
                        >
                          <Link
                            to={`/product/${prod.id}`}
                            className="h-64 bg-gray-200 overflow-hidden flex items-center justify-center"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="h-full w-full object-cover hover:scale-105 transition duration-300"
                            />
                          </Link>
                          <div className="p-4">
                            <h4 className="text-lg font-semibold mb-2 line-clamp-2">
                              {prod.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Brand: <span className="font-medium">{prod.brand}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                              Type: <span className="font-medium">{prod.category}</span>
                            </p>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-red-600 font-bold text-lg">
                                ₹{prod.price.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    addToCart({
                                      ...prod,
                                      selectedColor: prod.color?.[0] || "",
                                    })
                                  }
                                  className={`px-3 py-2 rounded text-sm font-semibold transition ${inCart
                                      ? "bg-green-500 text-white"
                                      : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                  {inCart ? "✓ Added" : "Add to Cart"}
                                </button>

                                <button
                                  onClick={() => toggleWishlist(prod)}
                                  className={`px-2 py-2 rounded text-sm transition ${inWishlist
                                      ? "bg-black text-white"
                                      : "bg-white text-gray-600 border border-gray-300 hover:border-black hover:text-black"
                                    }`}
                                >
                                  {inWishlist ? "♥" : "♡"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center py-6 border-t">
                    <ReactPaginate
                      previousLabel={"← Previous"}
                      nextLabel={"Next →"}
                      breakLabel={"..."}
                      pageCount={Math.ceil(
                        filteredProducts.length / itemsPerPage,
                      )}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageChange}
                      containerClassName={
                        "flex items-center gap-2 flex-wrap justify-center"
                      }
                      pageClassName={""}
                      pageLinkClassName={
                        "px-3 py-2 border rounded hover:bg-red-50 transition"
                      }
                      activeClassName={""}
                      activeLinkClassName={
                        "px-3 py-2 border-red-600 bg-red-600 text-white rounded font-semibold"
                      }
                      previousClassName={""}
                      previousLinkClassName={
                        "px-3 py-2 border rounded hover:bg-red-50 transition"
                      }
                      nextClassName={""}
                      nextLinkClassName={
                        "px-3 py-2 border rounded hover:bg-red-50 transition"
                      }
                      disabledClassName={"opacity-50 cursor-not-allowed"}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md text-center py-16">
                  <p className="text-xl text-gray-600">No products found</p>
                </div>
              )}
            </div>

            {/* Filters Sidebar */}
            <div className="w-64 shrink-0">
              <div className="flex items-center gap-2 mb-6">
                <input
                  className="flex-1 h-10 px-4 bg-white rounded-l-xl border border-gray-300 placeholder:text-gray-500"
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <div className="flex justify-center items-center rounded-r-xl h-10 w-10 bg-red-600 text-white text-xl hover:bg-red-700 transition cursor-pointer">
                  <CiSearch />
                </div>
              </div>

              <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                {/* Categories */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    {categoryOptions.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => handleCategoryFilter(category)}
                          className={`text-sm transition duration-200 flex items-center w-full ${selectedCategory === category
                              ? "text-red-600 font-semibold"
                              : "text-gray-600 hover:text-red-600"
                            }`}
                        >
                          <span className="mr-2">•</span> {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Brands */}
                <section className="border-b pb-4">
                  <h3 className="text-base font-bold mb-3 text-gray-800">
                    Brands
                  </h3>
                  <ul className="space-y-2">
                    {brandOptions.map((items) => (
                      <li key={items}>
                        <button
                          onClick={() => {
                            handleBrandFilter(items);
                          }}
                          className={`text-sm w-full flex items-center duration-200 transition rounded px-2 py-1 ${selectBrand === items
                              ? "text-red-600 font-semibold bg-red-50"
                              : "hover:text-red-600 text-gray-600 hover:bg-gray-50"
                            } `}
                        >
                          <span className="mr-2">•</span>
                          {items}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Price Filter */}
                <div>
                  <h3 className="text-base font-bold mb-3 text-gray-800">
                    Price Range
                  </h3>
                  <ul className="space-y-2">
                    {[
                      { label: "Less than ₹10,000", min: 0, max: 10000 },
                      { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
                      { label: "₹20,000 - ₹50,000", min: 20000, max: 50000 },
                      { label: "₹50,000 - ₹100,000", min: 50000, max: 100000 },
                      { label: "Above ₹100,000", min: 100000, max: Infinity },
                    ].map((items) => (
                      <li
                        key={items.label}
                        onClick={() => {
                          handlePriceFilter(items.min, items.max);
                        }}
                        className={`text-sm w-full flex items-center duration-200 transition rounded px-2 py-1 cursor-pointer ${priceRange?.min === items.min &&
                            priceRange?.max === items.max
                            ? "text-red-600 font-semibold bg-red-50"
                            : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                          }`}
                      >
                        <span className="mr-2">•</span>
                        {items.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Shop;
