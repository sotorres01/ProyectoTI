import React from "react";
import imgAboutSection1 from "../assets/img/imgAboutSection1.png";
import "./About.css";
import Applelogo from "../assets/img/Applelogo.png";
import hplogo from "../assets/img/hplogo.png";
import ztechlogo from "../assets/img/ztechlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SoundMastersLogo from "../assets/img/SoundMastersLogo.png";
import {
  faTruck,
  faExchangeAlt,
  faPercent,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export const About = () => {
  return (
    <div className="about">
      <section className="__div-section-1">
        <div className="container-about-section-1">
          <h2>About Us</h2>
          <p>
            Dear customers, It is a pleasure to introduce you to our electronic
            products sales company. In our online store, we offer a wide variety
            of high-quality electronic products, from mobile phones to smart TVs
            and audio devices
          </p>
          </div>
        <div className="section-1-container-img">
          <img className="publicity-section-1-about-us" src={imgAboutSection1} alt="Computers" />
        </div>  
      </section>
      <section className="__div-section-2">
        <div>
          <div>
            <h2 className="title-about">Our Services</h2>
            <p className="flex-container-about-section-2-span-1">
              At our company, we strive to offer the highest quality products at
              competitive prices.
            </p>
          </div>
        </div>
        <div className="__div_section-2-father-about">
          <div className="transition-section-2-about shadow">
            <div className="__div_section-2-child-about">
              <div>
                <FontAwesomeIcon
                  icon={faTruck}
                  className="about-icons-section-2"
                />
              </div>
              <h2 className="about-services-section-2">Delivery Services</h2>
            </div>
          </div>
          <div className="transition-section-2-about shadow">
            <div className="__div_section-2-child-about">
              <div>
                <FontAwesomeIcon
                  icon={faExchangeAlt}
                  className="about-icons-section-2"
                />
              </div>
              <h2 className="about-services-section-2 ">Shipping & Return</h2>
            </div>
          </div>
          <div className="transition-section-2-about shadow">
            <div className="__div_section-2-child-about">
              <div>
                <FontAwesomeIcon
                  icon={faPercent}
                  className="about-icons-section-2"
                />
              </div>
              <h2 className="about-services-section-2 ">Promotion</h2>
            </div>
          </div>
          <div className="transition-section-2-about shadow">
            <div className="__div_section-2-child-about">
              <div>
                <FontAwesomeIcon
                  icon={faUser}
                  className="about-icons-section-2"
                />
              </div>
              <h2 className="about-services-section-2 ">24 Hours Service</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="__div-section-3">
        <div className="__about--div-section-3-child">
          <div className="__about--div-section-3-child-inner">
            <p className="title-about">Our Brands</p>
            <p>
              We offer the best brands on the market so that you have the best
              quality of products 
            </p>
          </div>
          <div className="__about--div--section-3-child-inner-div ">
            <div className="__about--div--section-3-child-inner-div-img-1">
              <img src={hplogo} alt="Hp logo" />
            </div>
            <div className="__about--div--section-3-child-inner-div-img-2">
              <img src={Applelogo} alt="Apple logo" />
            </div>
            <div className="__about--div--section-3-child-inner-div-img-3">
              <img src={ztechlogo} alt="ztech-logo" />
            </div>
            <div className="__about--div--section-3-child-inner-div-img-4">
              <img src={SoundMastersLogo} alt="SoundMastersLogo" />
            </div>
          </div>
        </div>
      </section>
      <section className="__div-section-4"></section>
    </div>
  );
};

export default About;
