import { useEffect, useRef, useState } from "react";
import {
    ProductSVGAddToCart,
    ProductSVGFilter,
    ProductSVGLoading,
    ProductSVGOne,
    ProductSVGSort,
    ProductSVGTwo
} from "./ProductSectionSvg";

export default function ProductSection() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [sortOrder, setSortOrder] = useState(null);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const sortRef = useRef(null);
    const categoryRef = useRef(null);

    // Fetching products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://fakestoreapi.com/products");
                if (!response.ok) throw new Error("Failed to fetch products.");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Fetching categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("https://fakestoreapi.com/products/categories");
                if (!response.ok) throw new Error("Failed to fetch categories.");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error.message);
            }
        };

        fetchCategories();
    }, []);

    // Debouncing search query
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Handle search change
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    // Toggle Sort dropdown visibility
    const toggleSortOptions = () => setShowSortOptions((prev) => !prev);

    // Toggle Category dropdown visibility
    const toggleCategoryOptions = () => setShowCategoryOptions((prev) => !prev);

    // Handle sort order selection
    const handleSortSelect = (order) => {
        setSortOrder(order);
        setShowSortOptions(false);
    };

    // Handle category selection (allow only one selected at a time)
    const handleCategorySelect = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category); // Toggle selection
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSortOptions(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategoryOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtering and sorting products
    const sortedAndFilteredProducts = products
        .filter((product) =>
            product.title.toLowerCase().includes(debouncedQuery.toLowerCase()) &&
            (!selectedCategory || product.category === selectedCategory)
        )
        .sort((a, b) => {
            if (sortOrder === "asc") return a.price - b.price;
            if (sortOrder === "desc") return b.price - a.price;
            return 0;
        });

    // Handle Add to Cart
    const handleAddToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    // Handle Remove from Cart
    const handleRemoveFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Check if product is in cart
    const isInCart = (productId) => cart.some((item) => item.id === productId);

    // Loading and error states
    if (loading) return (
        <div role="status" className="flex justify-center items-center min-h-screen">
            <ProductSVGLoading />
            <span className="sr-only">Loading...</span>
        </div>
    );
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="pt-16 sm:pt-24 lg:pt-40">
                <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-center">
                        New Arrivals
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 text-center">
                        Thoughtfully designed objects for the workspace, home, and travel.
                    </p>
                </div>
                <div className="mt-10">
                    <div className="flex justify-between relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                        <div className="w-full">
                            {/* Sort Dropdown */}
                            <div className="relative inline-block text-left" ref={sortRef}>
                                <button
                                    type="button"
                                    onClick={toggleSortOptions}
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-8 py-8 text-sm text-gray-400 hover:text-gray-500 focus:text-gray-700 transition-all"
                                    aria-haspopup="true"
                                >
                                    Sort
                                    <ProductSVGSort />
                                </button>
                                {showSortOptions && (
                                    <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <button
                                            onClick={() => handleSortSelect("asc")}
                                            className={`text-center block w-full py-2 text-sm text-gray-700 hover:bg-gray-100 ${sortOrder === "asc" ? "bg-gray-200" : ""}`}
                                        >
                                            Low to High
                                        </button>
                                        <button
                                            onClick={() => handleSortSelect("desc")}
                                            className={`block w-full text-center py-2 text-sm text-gray-700 hover:bg-gray-100 ${sortOrder === "desc" ? "bg-gray-200" : ""}`}
                                        >
                                            High to Low
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative inline-block text-left ml-4" ref={categoryRef}>
                                <button
                                    type="button"
                                    onClick={toggleCategoryOptions}
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-400 hover:text-gray-500 focus:text-gray-700 transition-all"
                                    aria-haspopup="true"
                                >
                                    Filter
                                    <ProductSVGFilter />
                                </button>
                                {showCategoryOptions && (
                                    <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        {categories.map((category) => (
                                            <label
                                                key={category}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategory === category}
                                                    onChange={() => handleCategorySelect(category)}
                                                    className="mr-2"
                                                />
                                                {category}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            {/* Search Input */}
                            <div className="flex flex-1 items-center px-3.5 py-2 text-gray-400 group hover:ring-1 hover:ring-gray-300 focus-within:ring-2 ring-inset focus-within:ring-teal-500 rounded-md">
                                <ProductSVGOne />
                                <input
                                    className="block w-full appearance-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 focus:outline-none placeholder:text-sm sm:text-sm sm:leading-6"
                                    placeholder="Find anything..."
                                    aria-label="Search components"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{ careColor: "rgb(107, 114, 128)" }}
                                />
                            </div>
                            <div className="flow-root">
                                <a href="#" className="group -m-2 flex items-center p-2">
                                    <ProductSVGTwo />
                                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cart.length}</span>
                                    <span className="sr-only">items in cart, view bag</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Cards */}
                <div className="bg-white">
                    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {sortedAndFilteredProducts.map((product) => (
                                <div key={product.id} className="group relative">
                                    <div className="min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                        />
                                    </div>
                                    <div className="mt-4 px-3 pb-4">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                <a href="#">
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.title}
                                                </a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                    </div>
                                    <div
                                        className="cursor-pointer rounded-md bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 ring-1  hover:ring-1 ring-slate-700/10 hover:bg-slate-50 hover:text-slate-900 items-center text-center mb-3  flex-1"
                                    >
                                        <div
                                            onClick={() =>
                                                isInCart(product.id)
                                                    ? handleRemoveFromCart(product.id)
                                                    : handleAddToCart(product)
                                            }
                                            className="cursor-pointer rounded-md bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 ring-1 hover:ring-1 ring-slate-700/10 hover:bg-slate-50 hover:text-slate-900 items-center text-center mb-3 flex-1"
                                        >
                                            <div className="flex px-3 mx-auto py-2 justify-center">
                                                <ProductSVGAddToCart />
                                                <span className="text-l ml-2">
                                                    {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
