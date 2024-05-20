import React, { useEffect } from "react";
import "./Shop.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faEye, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

export const Shop = () => {
  const [Images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data, setData } = ShoppingCart();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const get_products = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://backec.eastus.cloudapp.azure.com/GET_PRODUCT/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const json = await response.json();
      setProducts(json);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart =  async (product, quantity) => {
    const quantityINT = parseInt(quantity, 10);
    setData({
      ...data,
      list_products: [...data.list_products, product],
      list_amount: [...data.list_amount, quantityINT]
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    get_products();
  }, []);

  if (loading)
     return (<div class="lds-roller">
     <div></div>
     <div></div>
     <div></div>
     <div></div>
     <div></div>
     <div></div>
     <div></div>
     <div></div>
   </div>); 

  return (
    <main className="main-content-shop">
      <h1 className= "text-align-center title-shopping">
       Products from the best brands
      </h1>
      <p class="text-align-center">
       Product categories: Smartphones, Gaming Consoles, Audio, Computers and Wearables
     </p>
      <div className="grid-container">
        {products.map((products, index) => (
          <div key={index} className="grid-item">
            <div className="card-image-container">
            <div className="links-shop-watch-product">
                <Link to={`/buy-product/${products.id_product}`} className="link-shop-watch-product">
                <FontAwesomeIcon className="icon-link-shop" icon={faHeart} />
                </Link>
                <Link to={`/buy-product/${products.id_product}`} className="link-shop-watch-product">
                <FontAwesomeIcon className="icon-link-shop" icon={faEye} />
                </Link>
                <Link to="/shopping-cart" className="link-shop-watch-product">
                  <FontAwesomeIcon className="icon-link-shop" icon={faShoppingCart} 
                    onClick={(event) => {
                      event.preventDefault();
                      if(!isAuthenticated){
                        loginWithRedirect();
                      }else{
                        addToCart(products.id_product, 1);
                        navigate('/shopping-cart');
                      }
                    }}/>
                </Link>
              </div>
              <img src={products.image_1} alt={`shop_${index + 1}`} />
            </div>
            <div className="card-text-container">
              <Link
                to={`/buy-product/${products.id_product}`}
                className="link-shop"
              >
                {products.name_product}
              </Link>
              <div className="card-text-container-brand">
                <span>{products.brand}</span>
              </div>
              <div className="flex-container-star-shop">
                <div className="star">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="star">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="star">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="star">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="star">
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div>
              <div className="price-container-shop">
                <p>${products.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>{" "}
      {/* End Grid-Container */}
    </main>
  );
};

export default Shop;
