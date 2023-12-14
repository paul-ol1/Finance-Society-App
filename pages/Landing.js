import React, { useState, useEffect } from "react";
import homepageimage from "../public/img/homeimage.jpg";
import Invest from "../public/img/InvestmentIllustration.jpeg";
import Portfolio from "../public/img/portfolio.png";
import val from "../public/img//Valuation.png";
import Header from "./Header";
import Image from "next/image";
import Link from "next/link";
import SignUp from "./Signup";
import styles from "../styles/landing.module.css";
import { getCookie } from "./checkcookie";

function typewriter(text, id) {
  let newP = document.createElement("p");
  let currentIndex = 0; // Initialize an index variable
  newP.style.display = "block";
  document.getElementById(id).appendChild(newP); // Append the <p> element at the start
  function addLetter() {
    if (currentIndex < text.length) {
      // Add the current letter to the paragraph
      newP.textContent += text[currentIndex];
      // Increment the index
      currentIndex++;
      // use timeout to create recursion
      setTimeout(addLetter, 50);
    }
  }

  addLetter();
}

function LandingContent() {
  useEffect(() => {
    typewriter(
      "Empower yourself with our financial insights and tools to navigate the intricacies of the financial world. Join Finance Society and gain access to essential financial tools for effective company analysis, valuation, and a generally less complex perspective to the use of financial tools.",
      "intro-text"
    );
  }, []);
  return (
    <div className="content">
      <div className={styles.intro}>
        <div className={styles.homecontent_left} id="intro-text">
          <h1>Demystifying the complexities of Financial Tools</h1>
        </div>
        <div className={styles.homecontent_right}>
          <Image src={homepageimage} alt="" style={{ transform: "scale(1)" }} />
        </div>
      </div>
      <div className={styles.Investments_section}>
        <div className={styles.homecontent_left}>
          <Image
            src={Invest}
            alt=""
            style={{ transform: "scale(1)", width: "700px" }}
          />
        </div>
        <div className={styles.homecontent_right} id="invtext">
          <h1>Investments</h1>
          <p>
            Use our investment hub, where you'll unlock the power of wealth
            creation. Manage your investments, track stocks, bonds, options, and
            more. Get real-time insights and start your investment journey
            today.
          </p>
        </div>
      </div>
      <div className={styles.Portfolio_section}>
        <div className={styles.homecontent_left}>
          <h1>Portfolio Power at Your Fingertips</h1>
          <p>
            Experience portfolio management like never before. Simulate,
            optimize, and manage your investments with ease. Track performance,
            analyze diversification, and make informed decisions. Elevate your
            wealth strategy with our portfolio tools.
          </p>
        </div>
        <div className={styles.homecontent_right}>
          <Image src={Portfolio} alt="" style={{ transform: "scale(1)" }} />
        </div>
      </div>
      <div className={styles.valuation_section}>
        <div className={styles.homecontent_left}>
          <Image src={val} alt="" style={{ transform: "scale(1)" }} />
        </div>
        <div className={styles.homecontent_right}>
          <h1>Explore Company Valuation</h1>
          <p>
            Get a better exposure to financial analysis with our Company
            Valuation tools. Explore various Dividend Discounting Models (DDMs),
            including Gordon Growth Model (GGM), and Two-Stage DDM. Dive into
            Pro Forma analysis to project future financials. Make informed
            investment decisions by assessing and valuing companies effectively.
          </p>
        </div>
      </div>
    </div>
  );
}

function Landing() {
  let isUserAuthenticated = getCookie(); // Assuming getCookie returns a boolean
  return (
    <>
      {<Header />}
      {LandingContent()}
    </>
  );
}

export default Landing;
