import Header from "../components/Header";
import Products from "../components/Products";

function Home() {
    const productsData = [
        {
            image: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png",
            name: "Bluetooth Speaker",
            price: "99.00",
            rating: 4,
            tag: "New",
        },
        {
            image: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png",
            name: "Homele Smart Watch",
            price: "299.00",
            rating: 5,
        },
        {
            image: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png",
            name: "Beylob 90 Speaker",
            price: "49.00",
            oldPrice: "99.00",
            rating: 0,
            tag: "Sale",
            tagColor: "gray-900",
            tagTextColor: "white",
        },
        {
            image: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-4.png",
            name: "Martino 75 Bluetooth",
            price: "79.00",
            rating: 3.5,
        },
    ];
    return (
        <>
            <Header />
            <Products products={productsData} />
        </>
    );
}

export default Home;
