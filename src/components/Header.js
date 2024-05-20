import React from "react";
import { Link } from "react-router-dom";
import iconImage from "../assets/img/iconImage.png";
import { useAuth0 } from "@auth0/auth0-react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faSearch,
  faEnvelope,
  faPhone,
  faShoppingCart,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";

export const Header = () => {
  const { logout } = useAuth0();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [roles, setRoles] = useState([]);
  const [userRol, setuserRol] = useState("");
  const [fetchData, setFetchData] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const get_token = useAuth0().getIdTokenClaims();
  const { data, setData } = ShoppingCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !fetchData) {
      // Realizar la primera solicitud fetch para obtener los roles
      fetchRoles();
      setFetchData(true); // Establecer fetchData a true para evitar futuras solicitudes
    }
  }, [isAuthenticated, fetchData]);

  const fetchRoles = async () => {
    let accessToken = await get_token;
    get_token.then((result) => {
      setAccessToken(result.__raw);
    });
    const token = accessToken.__raw;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ` + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const token_auth0 = await fetch(
      `http://backec.eastus.cloudapp.azure.com/GET_MANAGEMENT_TOKEN/`,
      requestOptions
    );
    const data_token = await token_auth0.json();

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ` + data_token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `https://asecommercesystem.us.auth0.com/api/v2/users/${user.sub}/roles`,
      requestOptions
    );
    const data = await response.json();

    if (Array.isArray(data)) {
      setRoles(data);

      let rolesStr = data.map((role) => role.name).join(", ");
      if (rolesStr === "") {
        rolesStr = "Client";
      }

      setuserRol(rolesStr);

      // Realizar la segunda solicitud fetch después de obtener los roles
      await fetch("http://backec.eastus.cloudapp.azure.com/ADD_USER/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.sub,
          user_name: user.nickname,
          email: user.email,
          role: rolesStr,
        }),
      });
    } else {
      console.error("Invalid data format:", data);
    }
  };

  const limpiarDatos = () => {
    setData({
      list_products: [],
      list_amount: []
    }); // Reinicia el estado, eliminando los datos locales
  };

  const cart = data.list_products.length;

  return (
    <div className="header-container">
      {isAuthenticated ? (
        userRol === "Admin" ? (
          <>
            <header className="header">
              <img className="logo-img" src={iconImage} alt="Icon" />
              <nav className="nav">
                <ul className="ul-list">
                  <li className="header-li">
                    <Link className="link-header" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/shop">
                      Shop
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/about">
                      About us
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/my-purchases">
                      My Purchases
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/inventory">
                      Inventory
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/purchases">
                       All Purchases
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="__header-logout-container">
                <Link className="faShoppingCart" to="/shopping-cart">
                  <div class="circle">
                    <span class="number">{cart}</span>
                  </div>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </Link>
                <img className="profile-img" src={user.picture} alt={user.name} />
                <button
                  className="logout-button"
                  onClick={() => {
                    limpiarDatos();
                    logout({ logoutParams: { returnTo: window.location.origin } })
                  }}
                >
                  Logout
                </button>
              </div>
            </header>
          </>
        ) : (
          <>
            <header className="header">
              <img className="logo-img" src={iconImage} alt="Icon" />
              <nav className="nav">
                <ul className="ul-list">
                  <li className="header-li">
                    <Link className="link-header" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/shop">
                      Shop
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/about">
                      About us
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link className="link-header" to="/my-purchases">
                      My Purchases
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="__header-logout-container">
                <Link className="faShoppingCart" to="/shopping-cart">
                  <div class="circle">
                    <span class="number">{cart}</span>
                  </div>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </Link>
                <img className="profile-img" src={user.picture} alt={user.name} />
                <button
                  className="logout-button"
                  onClick={() => {
                    limpiarDatos();
                    logout({ logoutParams: { returnTo: window.location.origin } })
                  }}
                >
                  Logout
                </button>
              </div>
            </header>
          </>

        )
      ) : (
        <>
          <header className="header">
            <img className="logo-img" src={iconImage} alt="Icon" />
            <nav className="nav">
              <ul className="ul-list">
                <li className="header-li">
                  <Link className="link-header" to="/">
                    Home
                  </Link>
                </li>
                <li className="header-li">
                  <Link className="link-header" to="/shop">
                    Shop
                  </Link>
                </li>
                <li className="header-li">
                  <Link className="link-header" to="/about">
                    About us
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="login-header-container">
              <button
                className="login-button"
                  onClick={() => {
                    limpiarDatos();
                    loginWithRedirect()
                  }}
              >
                Log In
              </button>
            </div>
          </header>
        </>
      )}
    </div>
  );
};

export default Header;
