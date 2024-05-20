import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./Additem.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Inventory } from "../pages/Inventory";


Modal.setAppElement("#root");

export const PopupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const get_token = useAuth0().getIdTokenClaims();
  const [accessToken, setAccessToken] = useState("");
  const [name_product, setName_product] = useState("");
  const [price, setPrice] = useState(0.00);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  useEffect(() => { 

    setName_product("Name");
    setPrice(1.00);
    setBrand("Brand");
    setCategory("Category");
    setDescription("Description");
    setStock(1);
    setImage1("https://www.bicifan.uy/wp-content/uploads/2016/09/producto-sin-imagen.png");
    setImage2(null);
    setImage3(null);


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
    fetch(`http://backec.eastus.cloudapp.azure.com/ADD_PRODUCT/?image1=${encodeURIComponent(image1)}`, {
      method: "POST",
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
      <button className="add-button" onClick={togglePopUp}>
        Add Product
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
            type="text"
            onChange={(event) => setName_product(event.target.value)}
          />


          <label className="popup-form-child">Price</label>
          <input className="popup-form-child"
            placeholder="Price"
            type="number"
            min="1,000"
            step="0.01"
            onChange={(event) => setPrice(event.target.value)}
          />


          <label className="popup-form-child">Brand</label>
          <input className="popup-form-child"
            placeholder="Brand"
            type="text"
            onChange={(event) => setBrand(event.target.value)}
          />


          <label className="popup-form-child">Category</label>
          <input className="popup-form-child"
            placeholder="Category"
            type="text"
            onChange={(event) => setCategory(event.target.value)}
          />


          <label className="popup-form-child">Description</label>
          <input className="popup-form-child"
            placeholder="Description"
            type="text"
            onChange={(event) => setDescription(event.target.value)}
          />


          <label className="popup-form-child">Stock</label>
          <input className="popup-form-child"
            placeholder = "Stock"
            type="number"
            min="1"
            onChange={(event) => setStock(event.target.value)}
          />


          <label className="popup-form-child">Image 1</label>
          <input className="popup-form-child"
            placeholder="www.urldelaimagen1.com"
            type="text"
            onChange={(event) => setImage1(event.target.value)}
          />


          <label className="popup-form-child">Image 2</label>
          <input className="popup-form-child"
            placeholder="www.urldelaimagen2.com"
            type="text"
            onChange={(event) => setImage2(event.target.value)}
          />

          
          <label className="popup-form-child">Image 3</label>
          <input className="popup-form-child"
            placeholder="www.urldelaimagen2.com"
            type="text"
            onChange={(event) => setImage3(event.target.value)}
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

export default PopupForm;
