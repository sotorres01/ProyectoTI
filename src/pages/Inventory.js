import React, { useEffect, useState } from "react";
import "./Inventory.css";
import { useFetcher } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PopupForm from "../components/AddItem";
import UpdateItem from "../components/UpdateItem";

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const get_token = useAuth0().getIdTokenClaims();
  const [error, setError] = useState(null);
  const { getIdTokenClaims } = useAuth0();
  const [showEditForm, setShowEditForm] = useState();
  const [editProductDetails, seteditProductDetails] = useState();

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://backec.eastus.cloudapp.azure.com/productos/${products.id_product}`
      );
      if (!response.ok) {
        throw new Error("It couldn't catch the product details...");
      }

      const productDetails = await response.json();
      seteditProductDetails(productDetails); 
      setShowEditForm(true);
    } catch (error) {
      console.error("Error to catch the product details", error);
    }
  };

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

  const removeproducts = async (id) => {
    try {
      let accessToken = await get_token;
      get_token.then((result) => {
        setAccessToken(result.__raw);
      });

      const token = accessToken.__raw;
      await fetch(
        "http://backec.eastus.cloudapp.azure.com/DELETE_PRODUCT/?id_product=" +
          id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      get_products();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const get_token = await getIdTokenClaims();
        get_products(get_token);
      } catch (error) {
        // Manejar errores aquí
        console.error("Error al obtener el token: ", error);
      }
    };

    fetchData();
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
    <main>
      <div className="grid-container-inventory">
        <PopupForm />
        <table className="table">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((products) => (
              <tr key={products.id_product} className="table-row">
                <td>{products.id_product}</td>
                <td>{products.name_product}</td>
                <td>${products.price}</td>
                <td>{products.brand}</td>
                <td>{products.category}</td>
                <td>{products.description}</td>
                <td>{products.stock}</td>
                <td>
                  <div className="buttons-inventory-order">
                    <button
                      className="removeButton"
                      onClick={() => removeproducts(products.id_product)}
                    >
                      Remove
                    </button>
                    <UpdateItem productID = {products.id_product}
                                product_name = {products.name_product}
                                product_price = {products.price}
                                product_brand = {products.brand}
                                product_category = {products.category}
                                product_description = {products.description}
                                product_stock = {products.stock}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Inventory;
