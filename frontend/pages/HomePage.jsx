import { useEffect, useState } from "react";
import { ref, onValue, update, serverTimestamp } from "firebase/database";
import { db } from "../firebaseConfig";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Products from "../components/Products";

function HomePage() {
    const [productsData, setProductsData] = useState([]);
    const [rawProducts, setRawProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currencyRate, setCurrencyRate] = useState(1);
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [cart, setCart] = useState([]);
    const [userId, setUserId] = useState(null);

    // Get user ID from localStorage on initial render
    useEffect(() => {
        const authId = localStorage.getItem("authId");
        if (authId) {
            setUserId(authId);
        }
    }, []);

    // Add to cart function
    const addToCart = (product) => {
        if (product.quantity <= 0 || !product.inStock) {
            return; // Don't add if out of stock
        }

        // FIRST: Immediately update the addedToCart in Firebase
        const immediateUpdateRef = ref(
            db,
            `global/products/${product.id}/addedToCart`
        );
        const addedToCartUpdate = {
            [userId]: serverTimestamp(),
        };
        update(immediateUpdateRef, addedToCartUpdate);

        // Update local cart state immediately for better UX
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id
            );
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });

        // SECOND: After delay, update the quantity and stock status
        setTimeout(() => {
            const productRef = ref(db, `global/products/${product.id}`);
            const newQuantity = product.quantity - 1;
            const updatedProduct = {
                quantity: newQuantity,
                inStock: newQuantity > 0,
            };
            update(productRef, updatedProduct);
        }, 1000); // 1 second delay
    };

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Determine user's currency and symbol
    useEffect(() => {
        const userCountry =
            localStorage.getItem("country")?.toLowerCase() || "india";
        const normalizedCountry = userCountry.replace(/\s+/g, "");

        const countryToCurrency = {
            india: { code: "inr", symbol: "₹" },
            unitedkingdom: { code: "gbp", symbol: "£" },
            northkorea: { code: "kpw", symbol: "₩" },
            japan: { code: "jpy", symbol: "¥" },
            australia: { code: "aud", symbol: "A$" },
        };

        const currencyInfo =
            countryToCurrency[normalizedCountry] || countryToCurrency.india;
        setCurrencySymbol(currencyInfo.symbol);

        const currencyRef = ref(db, "global/currency");
        onValue(currencyRef, (snapshot) => {
            const currencyData = snapshot.val();
            if (currencyData && currencyData[currencyInfo.code]) {
                setCurrencyRate(parseFloat(currencyData[currencyInfo.code]));
            }
        });
    }, []);

    // Fetch products
    useEffect(() => {
        const productsRef = ref(db, "global/products");
        onValue(productsRef, (snapshot) => {
            const products = snapshot.val();
            if (products) {
                const productsArray = Object.values(products).map(
                    (product) => ({
                        ...product,
                        id: product.id,
                        outOfStock: !product.inStock || product.quantity <= 0,
                    })
                );
                setRawProducts(productsArray);
            }
            setLoading(false);
        });
    }, []);

    // Recalculate prices
    useEffect(() => {
        const updatedProducts = rawProducts.map((product) => ({
            ...product,
            displayPrice: (product.price * currencyRate).toFixed(2),
        }));
        setProductsData(updatedProducts);
    }, [currencyRate, rawProducts]);

    // Check if user is logged in before adding to cart
    const handleAddToCart = (product) => {
        if (!userId) {
            alert("Please log in to add items to your cart");
            return;
        }

        addToCart(product);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Header
                cartCount={cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                )}
            />
            <Products
                products={productsData}
                currencySymbol={currencySymbol}
                addToCart={handleAddToCart}
            />
            <Footer />
        </>
    );
}

export default HomePage;
