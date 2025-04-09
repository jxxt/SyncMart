import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Cart = () => {
    const { country } = useParams();
    const location = useLocation();

    // State to store cart items
    const [cartItems, setCartItems] = useState([]);
    const [currencySymbol, setCurrencySymbol] = useState("₹");

    // Load cart data on component mount
    useEffect(() => {
        // First try to get from location state
        if (location.state?.cart && location.state.cart.length > 0) {
            setCartItems(location.state.cart);
            if (location.state.currencySymbol) {
                setCurrencySymbol(location.state.currencySymbol);
            }
        } else {
            // If not in location state, try localStorage
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }

            // Get currency symbol based on country
            const userCountry =
                localStorage.getItem("country")?.toLowerCase() || "india";
            const normalizedCountry = userCountry.replace(/\s+/g, "");

            const countryToCurrency = {
                india: { symbol: "₹" },
                unitedkingdom: { symbol: "£" },
                northkorea: { symbol: "₩" },
                japan: { symbol: "¥" },
                australia: { symbol: "A$" },
            };

            const currencyInfo =
                countryToCurrency[normalizedCountry] || countryToCurrency.india;
            setCurrencySymbol(currencyInfo.symbol);
        }
    }, [location.state]);

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.displayPrice) * item.quantity,
        0
    );
    const shipping = subtotal > 5000 ? 0 : 200;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    // Handle quantity change
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cartItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );

        // Update state and localStorage
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Handle item removal
    const handleRemoveItem = (productId) => {
        const updatedCart = cartItems.filter((item) => item.id !== productId);

        // Update state and localStorage
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Cart</h1>
                <span className="text-gray-600">
                    {cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                    )}{" "}
                    Items
                </span>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Looks like you haven't added anything to your cart yet
                    </p>
                    <Link
                        to={`/${country}`}
                        className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-md"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <>
                    <div className="border-t border-gray-200">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="py-6 border-b border-gray-200"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mr-4 mb-4 sm:mb-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="max-w-full max-h-full p-2 object-contain"
                                        />
                                    </div>

                                    <div className="flex-grow sm:mr-4">
                                        <h3 className="font-bold text-lg">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-500">
                                            {item.description || ""}
                                        </p>
                                        <div className="mt-2 flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`${
                                                        i <
                                                        Math.floor(item.rating)
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="font-bold text-lg">
                                            {currencySymbol}
                                            {(
                                                parseFloat(item.displayPrice) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                                {currencySymbol}
                                {subtotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                                {shipping === 0
                                    ? "FREE"
                                    : `${currencySymbol}${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Tax (18%)</span>
                            <span className="font-medium">
                                {currencySymbol}
                                {tax.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between py-4 border-t border-gray-200 font-bold text-lg">
                            <span>Total</span>
                            <span>
                                {currencySymbol}
                                {total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <button className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition-colors">
                            Proceed to Checkout
                        </button>
                        <Link
                            to={`/${country}`}
                            className="block w-full text-center bg-white hover:bg-gray-50 text-black font-medium py-3 px-4 rounded-md border border-gray-300 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
