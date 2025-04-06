const ProductCard = ({ product }) => {
    const { 
        image, 
        name, 
        price, 
        oldPrice, 
        rating, 
        tag, 
        tagColor = 'white', 
        tagTextColor = 'gray-900' 
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
        <div className="relative group">
            <div className="overflow-hidden aspect-w-1 aspect-h-1">
                <img
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
                    src={image}
                    alt={name}
                />
            </div>
            
            {tag && (
                <div className="absolute left-3 top-3">
                    <p className={`sm:px-3 sm:py-1.5 px-1.5 py-1 text-[8px] sm:text-xs font-bold tracking-wide text-${tagTextColor} uppercase bg-${tagColor} rounded-full`}>
                        {tag}
                    </p>
                </div>
            )}
            
            <div className="flex items-start justify-between mt-4 space-x-4">
                <div>
                    <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                        <a href="#" title="">
                            {name}
                            <span className="absolute inset-0" aria-hidden="true"></span>
                        </a>
                    </h3>
                    <div className="flex items-center mt-2.5 space-x-px">
                        {renderStars()}
                    </div>
                </div>

                <div className="text-right">
                    {oldPrice ? (
                        <>
                            <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                ${price}
                            </p>
                            <del className="mt-0.5 text-xs sm:text-sm font-bold text-gray-500">
                                ${oldPrice}
                            </del>
                        </>
                    ) : (
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            ${price}
                        </p>
                    )}
                </div>
            </div>
            
            <button className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
                Add to Cart
            </button>
        </div>
    );
};

const Products = ({ products }) => {
    return (
        <section className="py-12 bg-white sm:py-16 lg:py-20">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Our featured items
                    </h2>
                    <p className="mt-4 text-base font-normal leading-7 text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Purus faucibus massa dignissim tempus.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;