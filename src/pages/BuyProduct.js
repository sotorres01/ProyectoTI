import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./BuyProduct.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "../components/ShoppingCart";


export const Buy = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const { data, setData } = ShoppingCart();
  const [numberStock, setnumberStock] = useState(1)
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  const handleClick = () => {
    navigate('/shopping-cart');
  };

  const handleClick2 = () => {
    navigate('/shop');
  };

  const get_product = async (id) => {
    try {
      const response = await fetch(
        `http://backec.eastus.cloudapp.azure.com/GET_PRODUCT/?id_product=${id}`,
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
      setnumberStock(json[0].stock);

    } catch (error) {
      setError(error);
    }
  };

  const addToCart = (product, quantity) => {
    const quantityINT = parseInt(quantity, 10);
    setData({
      ...data,
      list_products: [...data.list_products, product],
      list_amount: [...data.list_amount, quantityINT]
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    get_product(id);

  }, []);


  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };
  const numberOptions = Array.from({ length: numberStock }, (_, index) => index + 1);


  return (
    <div className="main-content-buy-product">
      <section className="section-1-buy-product">
        {products.map((products) => (
          <div className="section-buy-product-div">
            <div className="section-buy-product-div-specification-content-1">
              <div className="buy-product-main-img-container">
                <img src={products.image_1} alt="main-img-example" />
              </div>
            </div>
            <div className="section-buy-product-div-specification-content-2">
              <h2 className="buy-product-name">{products.name_product}</h2>
              <h3 className="buy-product-price">${products.price}</h3>
              <div className="buy-product-stars">
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
              <span>
                <b>Brand: </b>
                {products.brand}
              </span>
              <span>
                <b>Category: </b>
                {products.category}
              </span>
              <span className="bold-text span-buy-product-content-2">
                Description:
              </span>{" "}
              <p className="paragraph-buy-product-content-2">
                {products.description}
              </p>
              <div className="Quantity-buy-product-content"><span htmlFor="quantity" className="bold-text span-buy-product-content-2 ">
                  Quantity:
              </span>
              
              <select className="select-quantity-buy-product" id="quantity" value={quantity} onChange={handleQuantityChange}>
                {numberOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                  ))}
                </select></div>
                <div className="form-buy-product">
                <button className="buy-product-submit-button" type="submit" 
                onClick={() => { 
                  if(!isAuthenticated){
                    loginWithRedirect();
                    return;
                  }
                  handleClick(); addToCart(products.id_product, quantity); } }>
                    Buy
                  </button>
                  <button className="buy-product-submit-button" 
                  onClick={() =>{
                    if(!isAuthenticated){
                      loginWithRedirect();
                      return;
                    }
                    handleClick2();
                    addToCart(products.id_product, quantity)}} >
                    Add To Cart
                </button>

                </div>
            </div>
          </div>
        ))}
      </section>
      {/**<section className="section-2-buy-product">Esta es la sección 2</section>  */}
    </div>
  );
};

export default Buy;
