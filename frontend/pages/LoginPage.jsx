import Header from "../components/Header";
import Footer from "../components/Footer";
import Login from "../components/Login";

function Home() {
    return (
        <>
            <Header showCartButton={false} />
            <Login />
            <Footer showLogoutButton={false}/>
        </>
    );
}

export default Home;
