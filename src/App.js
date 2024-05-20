import { useAuth0 } from "@auth0/auth0-react";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Shop from "./pages/Shop";
import Buy from "./pages/BuyProduct";
import "./App.css";
// Cambia la importación de Principal
import { Routes, Route } from "react-router-dom";
import { DataProvider } from "./components/ShoppingCart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import ShoppingCartFront from "./pages/ShoppingCartPage";
import Purchases from "./pages/Purchases";
import MyPurchases from "./pages/MyPurchases";

function App() {
  // Defining the state of the user
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <DataProvider>
          <Header />
          {/* Las rutas muestran el contenido principal */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/buy-product/:id" element={<Buy/>}/>
              <Route path="/shopping-cart" element={<ShoppingCartFront />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/my-purchases" element={<MyPurchases />} />
            </Routes>
          </div>
          <Footer />
        </DataProvider>
      ) : (
        <DataProvider>
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/shop" element={<Shop />} />
              <Route path={`/buy-product/:id`} element={<Buy/>} />
            </Routes>
          </div>
          <Footer />
        </DataProvider>
      )}
    </div>
  );
}

export default App;
