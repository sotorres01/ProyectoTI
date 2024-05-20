import "./Home.css";
import Propaganda from "../assets/img/Propaganda.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export const Home = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  } , []);

  return (
    <div className="home-container">
      <div className="content-container">
        <div className="__content-container-text">
          <div className="last-day-container">
            <p className="last-days last-day-container-items">🚀 Latest news in technology 🚀</p>
          </div>
          <p className="prod">NEW PRODUCTS</p>
          <p className="selected-products">Choose your favorite products</p>
        </div>
        <img className="publicity-img" src={Propaganda} alt="Publicidad"></img>
      </div>
      <Link to="/shop" className="shop-now">
        SHOP NOW
      </Link>
      <section className="section">
        <div className="show-by-category">
          <h2 className="shop-by-category">Shop By Category</h2>
        </div>
        <div className="product-category-home-container">
          <Link to="/shop" className="product-category-home">
            Smartphones 
          </Link>
          <Link to="/shop" className="product-category-home">
            Gaming Consoles 
          </Link>
          <Link to="/shop" className="product-category-home">
            Audio
          </Link>
          <Link to="/shop" className="product-category-home">
            Computers 
          </Link>
          <Link to="/shop" className="product-category-home">
            Wearables 
          </Link>
        </div>
        <p className="text">Don't miss the opportunity to experience excellence in every detail. Explore the new and take your technology experience to the next level! 🌟</p>
        <p className="text">  Visit our store now and discover the excitement of the latest in technology. Don't be left behind, join the future today! 🚀💻📱🎮</p>
      </section>
    </div>
  );
};

export default Home;
