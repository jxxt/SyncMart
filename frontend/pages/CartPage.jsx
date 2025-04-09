import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";

function Home() {
    return (
        <>
            <Header showCartButton={false} />
            <Cart />
            <Footer showLogoutButton={false}/>
        </>
    );
}

export default Home;
