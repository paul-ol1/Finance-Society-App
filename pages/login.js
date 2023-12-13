import React from "react";
import bvimage from "public/img/signin-image.jpg";
import Image from "next/image";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import Header from "./Header";
import styles from "styles/lg.module.css";
function Login() {
  const router = useRouter();

  const handleLogin = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let mybody = {
      em: email,
      ps: password,
    };

    if (email === "" || password === "") {
      alert("Please fill all fields");
    } else {
      fetch("http://localhost:8080/api/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mybody),
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => {
              throw new Error(data.error);
            });
          }
        })
        .then((data) => {
          router.push("/Feed");
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    }
  };

  return (
    <>
      <Header />
      <div className="content">
        <div className={styles.lscontent}>
          <div className={styles.login_container}>
            <div className={styles.leftside}>
              <Image src={bvimage} alt="image" className={styles.bvimage} />
            </div>
            <div className={styles.rightside}>
              <h1>Login</h1>
              <p>Welcome back</p>
              <div className={styles.Login_side}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
                <br />
                <button onClick={handleLogin} type="submit" className={styles.button}>Login</button>
                <br />
              </div>
              <Link href="/Signup">
                <p className={styles.linktext}> New around here? Sign Up</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
