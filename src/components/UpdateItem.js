import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./Additem.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Inventory } from "../pages/Inventory";
import "./UpdateItem.css";


Modal.setAppElement("#root");

export const UpdateItem = ({ productID, 
                            product_name, 
                            product_price,
                            product_brand,
                            product_category,
                            product_description,
                            product_stock}) => {


  const [isOpen, setIsOpen] = useState(false);
  const get_token = useAuth0().getIdTokenClaims();
  const [accessToken, setAccessToken] = useState("");
  const [name_product, setName_product] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);


  useEffect(() => { 

    setName_product(product_name);
    setPrice(product_price);
    setBrand(product_brand);
    setCategory(product_category);
    setDescription(product_description);
    setStock(product_stock);

  }, []);



  const handleSubmit = async (event) => {
    let accessToken = await get_token;
    get_token.then((result) => {
      setAccessToken(result.__raw);
    });
    const token = accessToken.__raw;

    const requestBody = {
      name_product: name_product,
      price: price,
      category: category,
      brand: brand,
      description: description,
      stock: stock,
    };


    event.preventDefault();
    fetch(`http://backec.eastus.cloudapp.azure.com/UPDATE_PRODUCT/?id_product=${productID}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + token,
      },
      body:
        JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload(); 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="update-button-inventory" onClick={togglePopUp}>
        Update
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={togglePopUp}
        contentLabel="Example Modal"
        className="popup-content"
      >
        <form className="popup-form" onSubmit={handleSubmit}>
          <label className="popup-form-child">Name</label>
          <input className="popup-form-child"
            placeholder="Name"
            value={name_product}
            type="text"
            onChange={(event) => setName_product(event.target.value)}
          />


          <label className="popup-form-child">Price</label>
          <input className="popup-form-child"
            placeholder="Price"
            value={price}
            type="number"
            min="1,000"
            step="0.01"
            onChange={(event) => setPrice(event.target.value)}
          />


          <label className="popup-form-child">Brand</label>
          <input className="popup-form-child"
            placeholder="Brand"
            value={brand}
            type="text"
            onChange={(event) => setBrand(event.target.value)}
          />


          <label className="popup-form-child">Category</label>
          <input className="popup-form-child"
            placeholder="Category"
            value={category}
            type="text"
            onChange={(event) => setCategory(event.target.value)}
          />


          <label className="popup-form-child">Description</label>
          <input className="popup-form-child"
            placeholder="Description"
            value={description}
            type="text"
            onChange={(event) => setDescription(event.target.value)}
          />


          <label className="popup-form-child">Stock</label>
          <input className="popup-form-child"
            placeholder = "Stock"
            value={stock}
            type="number"
            min="1"
            onChange={(event) => setStock(event.target.value)}
          />
          <div className="center-items">
            <button
              className="popup-form-child button-form-add-item"
              type="submit">
              Enviar
            </button>
          </div>
        </form>
        <div className="flex-container">
          <div>
            <button className="close" onClick={togglePopUp}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateItem;
