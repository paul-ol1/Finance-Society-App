import React from "react";
import bvimage from "public/img/signup-image.jpg";
import Image from "next/image";
import Link from "next/link"
import styles from "styles/signup.module.css";
import Header from "./Header";

function createaccount(){
  let email = document.getElementById("email").value;
  let firstname = document.getElementById("fname").value;
  let lastname = document.getElementById("lname").value;
  let password = document.getElementById("password").value;

  if (email == "" || firstname == "" || lastname == "" || password == "") {
    alert("Please fill all fields");
  } else {
    let mybody = {
      em: email,
      fn: firstname,
      ln: lastname,
      ps: password,
    };
    fetch("http://localhost:8080/api/newaccount", {
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
            })
      .catch((error) => {
        alert("Error: " + error.message); // Display an alert with the error message
      });
  }
}
function SignUp(){
    return (
      <>
        <Header />
        <div className="content">
          <div className={styles.lscontent}>
            <div className={styles.signup_container}>
              <div className={styles.leftside}>
                <h1>Sign Up</h1>
                <p className={styles.subheader}>sign up with your aup adress to try out our service</p>
                <div className={styles.signup_side}>
                  <label for="fname">First Name</label>
                  <input type="text" id="fname" name="fname" />
                  <br />
                  <label for="lname">Last Name</label>
                  <input type="text" id="lname" name="lname" />
                  <br />
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" />
                  <br />
                  <label for="password">Password</label>
                  <input type="text" id="password" name="password" />
                  <br />
                  <button onClick={createaccount} className={styles.button}>Sign Up</button>
                  <br />
                </div>
                <Link href="/login">
                  <p className={styles.linktext}> already have an account?Login</p>
                </Link>
              </div>
              <div className={styles.rightside}>
                <Image
                  src={bvimage}
                  alt="image"
                  className={styles.bvimage}></Image>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default SignUp;