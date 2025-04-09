const ProductCard = ({ product, currencySymbol, addToCart }) => {
    const {
        image,
        name,
        displayPrice,
        oldPrice,
        rating,
        tag,
        tagColor = "white",
        tagTextColor = "gray-900",
        outOfStock,
    } = product;

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <span key={i} className="text-yellow-400">
                        ★
                    </span>
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-yellow-400">
                        ★
                    </span>
                );
            } else {
                stars.push(
                    <span key={i} className="text-gray-300">
                        ★
                    </span>
                );
            }
        }
        return stars;
    };

    return (
        <div className={`relative group ${outOfStock ? "opacity-60" : ""}`}>
            <div className="overflow-hidden h-70">
                <img
                    className={`object-cover w-full h-70 transition-all duration-300 ${
                        outOfStock ? "" : "group-hover:scale-125"
                    }`}
                    src={image}
                    alt={name}
                />
            </div>

            {tag && (
                <div className="absolute left-3 top-3">
                    <p
                        className={`sm:px-3 sm:py-1.5 px-1.5 py-1 text-[8px] sm:text-xs font-bold tracking-wide text-${tagTextColor} uppercase bg-${tagColor} rounded-full`}
                    >
                        {tag}
                    </p>
                </div>
            )}

            {outOfStock && (
                <div className="absolute right-3 top-3">
                    <p className="sm:px-3 sm:py-1.5 px-1.5 py-1 text-[8px] sm:text-xs font-bold tracking-wide text-white uppercase bg-gray-700 rounded-full">
                        Out of Stock
                    </p>
                </div>
            )}

            <div className="flex items-start justify-between mt-4 space-x-4">
                <div>
                    <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                        {name}
                    </h3>
                    <div className="flex items-center mt-2.5 space-x-px">
                        {renderStars()}
                    </div>
                </div>

                <div className="text-right">
                    {oldPrice ? (
                        <>
                            <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                {currencySymbol}
                                {displayPrice}
                            </p>
                            <del className="mt-0.5 text-xs sm:text-sm font-bold text-gray-500">
                                {currencySymbol}
                                {oldPrice}
                            </del>
                        </>
                    ) : (
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            {currencySymbol}
                            {displayPrice}
                        </p>
                    )}
                </div>
            </div>

            <button
                className={`w-full mt-4 py-2 px-4 rounded-md transition-colors mb-15 ${
                    outOfStock
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                }`}
                disabled={outOfStock}
                onClick={(e) => {
                    if (!outOfStock) {
                        e.stopPropagation();
                        addToCart(product);
                    }
                }}
            >
                {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
        </div>
    );
};

const Products = ({ products, currencySymbol, addToCart }) => {
    return (
        <section className="py-12 bg-white sm:py-16 lg:py-20">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="font-bold text-gray-900 sm:text-4xl underline">
                        Our top-selling items
                    </h1>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
                    {products.map((product, index) => (
                        <ProductCard
                            key={index}
                            product={product}
                            currencySymbol={currencySymbol}
                            addToCart={addToCart}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
