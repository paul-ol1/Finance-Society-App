import React, { useState, useEffect } from "react";
import homepageimage from "/public/img/homeimage.jpg";
import Header from "./Header";
import Image from "next/image";
import Link from "next/link";
import SignUp from "./Signup";
import { getCookie } from "./checkcookie";

function homecontent(loggedin) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userAuthenticated = getCookie();
    setIsLoggedIn(userAuthenticated);
  }, []);

  return(
    isLoggedIn?(
      <div className="content">
        <div className="homecontent-left">
          <h1>Navigate Financial Tools</h1>
          <p>
            Discover the world of financial analysis on our website, offering
            essential tools to assess and value companies effectively.
          </p>
          <button>
            <Link
              href={"/Signup"}
              style={{ textDecoration: "none", color: "#031E40" }}>
              Get Started
            </Link>
          </button>
        </div>
        <div className="homecontent-right">
          <Image src={homepageimage} alt="" />
        </div>
      </div>
    ):
    <div className="content">
        <div className="homecontent-left">
          <h1>Navigate Financial Tools</h1>
          <p>
            Discover the world of financial analysis on our website, offering
            essential tools to assess and value companies effectively.
          </p>
        </div>
        <div className="homecontent-right">
          <Image src={homepageimage} alt="" />
        </div>
      </div>
  )
}

function Home() {
  let isUserAuthenticated = getCookie(); // Assuming getCookie returns a boolean
  return (
    <>
      {<Header />}
      {isUserAuthenticated ? homecontent(true) : homecontent(false)}
    </>
  );
}

export default Home;
