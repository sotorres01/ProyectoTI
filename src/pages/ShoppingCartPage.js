import React, { useEffect } from "react";
import "./ShoppingCartPage.css";
import { useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useAuth0 } from "@auth0/auth0-react";
import ReactModal from "react-modal";
import Modal from "react-modal";

export const ShoppingCartFront = () => {
  const [Images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [amount, setAmount] = useState([]);
  const [total_buy, setTotal_buy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data, setData } = ShoppingCart();
  const [accessToken, setAccessToken] = useState("");
  const get_token = useAuth0().getIdTokenClaims();
  const [shipping_address, setShipping_address] = useState("");
  const [phone_contact, setPhone_contact] = useState("");
  const { user } = useAuth0();
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [stateBuy, setStateBuy] = useState([]);

  const upPopUp = () => {
    setShowAnnouncement(!showAnnouncement);
    limpiarDatos();
    window.location.reload();
  };

  const handleAnnouncement = async () => {
    if (shipping_address.trim() !== "" && phone_contact.trim() !== "") {
      setShowAnnouncement(true);
      setTimeout(() => {
        setShowAnnouncement(false);
        limpiarDatos();
        window.location.reload();
      }, 10000);
    } else {
      alert("¡Please, fill the fields shipping address and phone contact!");
    }
  };

  const GetShoppingCartProducts = async () => {
    try {
      let accessToken = await get_token;
      get_token.then((result) => {
        setAccessToken(result.__raw);
      });
      const token = accessToken.__raw;
      setLoading(true);
      const response = await fetch(
        "http://backec.eastus.cloudapp.azure.com/SEE-SHOOPING-CART/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + token,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const json = await response.json();
      setProducts(json.list_product);
      setAmount(json.list_amount);
      setTotal_buy(json.total_purchase);
    } catch (error) {
      setError(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const DeleteProduct_from_shopping_cart = async (id) => {
    const index = data.list_products.indexOf(id);

    if (index !== -1) {
      const newListProducts = [...data.list_products];
      const newListAmount = [...data.list_amount];
      newListProducts.splice(index, 1);
      newListAmount.splice(index, 1);

      setData({
        list_products: newListProducts,
        list_amount: newListAmount,
      });
    }
    window.location.reload();
  };

  const BuyProducts = async (event) => {
    const requestBody = {
      id_purchase: 0,
      user_id: user.sub,
      date_of_purchase: new Date(),
      shipping_address: shipping_address,
      phone_contact: phone_contact,
      status: "pending",
      total_purchase: 0,
      list_product: data.list_products,
      list_amount: data.list_amount,
    };

    try {
      let accessToken = await get_token;
      get_token.then((result) => {
        setAccessToken(result.__raw);
      });
      const token = accessToken.__raw;
      setLoading(true);
      const response = await fetch(
        "http://backec.eastus.cloudapp.azure.com/BUY/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + token,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const json = await response.json();
      if (json === "compra realizada") {
        setStateBuy("Purchase made🛍️");
        handleAnnouncement();
      }
      else{
        setStateBuy(Object.keys(json).map((key) => `${json[key]}`).join("\n"));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarDatos = async () => {
    setData({
      list_products: [],
      list_amount: []
    }); // Reinicia el estado, eliminando los datos locales
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    GetShoppingCartProducts();
  }, []);

  if (loading)
    return (
      <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );

  return (
    <div className="shopping-cart-content">
      <main className="shopping-cart-main-content">
        {/* Main content*/}
        <h2 className="text-align-center title-shopping-cart-front">
          My Products
        </h2>
        {products.map((products, index) => (
          <div key={index} className="shopping-cart-item">
            <div className="img-shopping-front-item-container">
              <img
                className="img-shopping-front-item"
                src={products.image_1}
                alt={`shop_${index + 1}`}
              />
            </div>
            <div className="description-container-shoppping-front">
              <span>{products.name_product} </span>
              <span>
                <b>Price: </b>${products.price}{" "}
              </span>
              <span>
                <b>Brand: </b> {products.brand}{" "}
              </span>
              <span>
                <b>Quantity: </b>
                {amount[index]}
              </span>
              <button
                className="button-delete-shopping-cart-front"
                onClick={() =>
                  DeleteProduct_from_shopping_cart(products.id_product)
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </main>
      <aside className="shopping-cart-aside">
        {" "}
        {/*Secondary Content */}
        <h1 className="title-aside-shopping-front text-align-center">
          Purchase Summary
        </h1>
        <div className="to-pay-shopping-cart-front">
          <h2 className="text-align-start">
            Total to
            pay.......................................
          </h2>
          <span>${total_buy}</span>
        </div>
        <div className="div-form-shopping-cart-front">
          <form className="form-shopping-cart-front" onSubmit={() => {BuyProducts();}}>
            <h1 className="text-align-start">Purchase shipping information </h1>
            <label className="label-shopping-cart-front">
              Shipping Address
            </label>
            <input
              required
              className="input-shopping-cart-front"
              type="text"
              placeholder="Address..."
              value={shipping_address}
              onChange={(event) => setShipping_address(event.target.value)}
            />
            <label className="label-shopping-cart-front">Phone Contact</label>
            <input
              required
              className="input-shopping-cart-front"
              type="text"
              placeholder="Phone..."
              value={phone_contact}
              onChange={(event) => setPhone_contact(event.target.value)}
            />
            <div>
              <button
                className="button-pay-aside-shopping-cart-front"
                type="submit"
              >
                Pay
              </button>
              {showAnnouncement && (
                <Modal
                  isOpen={showAnnouncement}
                  className="pay-announcement"
                  contentLabel="Modal-Pay-Announcement"
                >
                  <h1 className="text-align-center">
                  {stateBuy}
                  </h1>   
                  <button className="close-pay-announcement" onClick={upPopUp}>
                    Close
                  </button>
                </Modal>
              )}
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default ShoppingCartFront;
