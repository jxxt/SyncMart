import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
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

    // Determine user's currency and symbol
    useEffect(() => {
        // Get the country from localStorage as intended
        const userCountry = localStorage.getItem("country")?.toLowerCase() || "india";
        
        // Map to remove spaces and standardize country names if needed
        const normalizedCountry = userCountry.replace(/\s+/g, '');
        
        const countryToCurrency = {
            "india": { code: "inr", symbol: "₹" },
            "unitedkingdom": { code: "gbp", symbol: "£" },
            "northkorea": { code: "kpw", symbol: "₩" },
            "japan": { code: "jpy", symbol: "¥" },
            "australia": { code: "aud", symbol: "A$" },
        };

        const currencyInfo = countryToCurrency[normalizedCountry] || countryToCurrency.india;
        setCurrencySymbol(currencyInfo.symbol);

        // Fetch currency rate
        const currencyRef = ref(db, "global/currency");
        onValue(currencyRef, (snapshot) => {
            const currencyData = snapshot.val();
            if (currencyData && currencyData[currencyInfo.code]) {
                setCurrencyRate(parseFloat(currencyData[currencyInfo.code]));
            }
        });
    }, []);

    // Fetch products once
    useEffect(() => {
        const productsRef = ref(db, "global/products");
        onValue(productsRef, (snapshot) => {
            const products = snapshot.val();
            if (products) {
                const productsArray = Object.values(products).map((product) => ({
                    ...product,
                    id: product.id,
                    outOfStock: !product.inStock || product.quantity <= 0,
                }));
                setRawProducts(productsArray);
            }
            setLoading(false);
        });
    }, []);

    // Recalculate prices whenever currencyRate or rawProducts change
    useEffect(() => {
        const updatedProducts = rawProducts.map((product) => ({
            ...product,
            displayPrice: (product.price * currencyRate).toFixed(2),
        }));
        setProductsData(updatedProducts);
    }, [currencyRate, rawProducts]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <Products products={productsData} currencySymbol={currencySymbol} />
            <Footer />
        </>
    );
}

export default HomePage;