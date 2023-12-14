import React, { useState, useEffect } from "react";
import FSlogo from "/public/img/FS-logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { getCookie } from "./checkcookie";
import { useRouter } from "next/router";
import styles from "styles/header.module.css";
import usericon from "public/img/usericon.png";


function logout(){
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

}
function usericonfunc(){
  return (
    <div className={styles.usericonfunc}>
      <button>
        <Link href="/profile">Profile</Link>
      </button>
      <button>
        <Link href="/settings">Settings</Link>
      </button>
      <button onClick={()=>{
        logout()
      }}>
        <Link href="/">Log Out</Link>
      </button>
    </div>
  );
}
function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [revealIcon, setRevealIcon]= useState(false)
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userAuthenticated = getCookie("Userdetails");
    setIsLoggedIn(userAuthenticated);
    setLoading(false);
  }, []);

  const beforeLogin = ["About", "Help"];
  const afterLogin = [
    "Feed",
    "Investment",
    "Valuation",
    "Portfolio",
    "Worksheet",
  ];
  const content = isLoggedIn ? afterLogin : beforeLogin;

  if (loading) {
    return null;
  }
  return (
    <>
    <div className={styles.header}>
      <div className={styles.header_left}>
        <div id={styles.logo} className={styles.header_elem}>
          <Link
            href={`/Landing`}
            style={{ textDecoration: "none", color: "#031E40" }}>
            <Image src={FSlogo} alt="logo" />
          </Link>
        </div>
        {content.map((item) => (
          <div key={item} className={styles.header_elem}>
            <Link
              href={`/${item}`}
              style={{ textDecoration: "none", color: "#031E40" }}>
              {item}
            </Link>
          </div>
        ))}
      </div>
      <div className={styles.header_right}>
        {isLoggedIn ? (
          <div className={styles.header_elem} id="header-elem-right">
            <Image src={usericon} alt='usericon' className={styles.usericon} onClick={()=>{revealIcon?setRevealIcon(false):setRevealIcon(true);}} />
          </div>
        ) : (
          <Link
            href="/login"
            style={{ textDecoration: "none", color: "#031E40" }}>
            <p className={styles.header_elem} id="header-elem-right">
              Login
            </p>
          </Link>
        )}
      </div>
    </div>
    {revealIcon?usericonfunc():<></>}
    </>
  );
}

export default Header;
