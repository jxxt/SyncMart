import Header from "../components/Header";
import Footer from "../components/Footer";
import Signup from "../components/Signup";

function Home() {
    return (
        <>
            <Header showCartButton={false} />
            <Signup />
            <Footer showLogoutButton={false} />
        </>
    );
}

export default Home;
