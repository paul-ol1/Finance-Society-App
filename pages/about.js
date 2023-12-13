import React, { useState, useEffect } from "react";
import AboutImage from "/public/img/aboutUs.png";
import About from "/public/img/AboutImage.png";
import ContactUs from "/public/img/contactUs.png";
import Email from "/public/img/email.png";
import Phone from "/public/img/phone.png";
import Address from "/public/img/address.png";
import Chat from "/public/img/chat.png";
import Header from "./Header";
import Image from "next/image";
import Link from "next/link";
import SignUp from "./Signup";
import { getCookie } from "./checkcookie";
import styles from "styles/about.module.css";

function AboutUs(){

    return(
        <>
        <Header />
        <div className={styles.container}>
        <div className={styles.top}>
        <Image className={styles.illu} src={AboutImage} alt=""></Image>
        <h2>About Us</h2>
        </div>
        <div className={styles.line}>
        <div className={styles.box1}>
        </div>
        <div className={styles.box2}>
        </div>
        </div>
        <div className={styles.content}>
        <Image className={styles.big} src={About} alt=""></Image>    
        <div className={styles.text}>
        <p>
        At the Finance Society we work to increase the value of your AUP degree by helping you develop critical thinking, presentation, and effective team skills in a business environment. We will work with case studies to give community members valuable practice in what they can expect in job interviews as well as real-world application.
        </p>
        <p>
        In addition to career preparation, the Finance Society aims to provide financial literacy for the entire student body, as we believe these tools can equip students with skills applicable in any field!
        </p>
        <p>
        We will also host a series of talks with AUP alumni to form meaningful connections and gain more insight into the industry.
        </p>
        </div>
        </div>

        <div className={styles.contact}>
        <div className={styles.top}>
        <Image className={styles.illu} src={ContactUs} alt=""></Image>
        <h2>Contact Us</h2>
        </div>
        <div className={styles.line}>
        <div className={styles.box1}>
        </div>
        <div className={styles.box2}>
        </div>
        </div>

        <div className={styles.contactBox}>

            <div className={styles.contactInfo}>
                <h2>Chat</h2>
                <div className={styles.circleContainer}>
                <div className={styles.circle1}>
                <Image className={styles.illu2} src={Chat} alt=""></Image>
                </div>
                </div>
                <p>Wednesday</p>
                <p className={styles.negSpace}>8:30pm - 10pm</p>

            </div>

            <div className={styles.contactInfo}>
                <h2>Email</h2>
                <div className={styles.circleContainer}>
                <div className={styles.circle2}>
                <Image className={styles.illu2} src={Email} alt=""></Image>
                </div>
                </div>
                <p>a106388@aup.edu</p>
            </div>

            <div className={styles.contactInfo}>
                <h2>Phone</h2>
                <div className={styles.circleContainer}>
                <div className={styles.circle3}>
                <Image className={styles.illu2} src={Phone} alt=""></Image>
                </div>
                </div>
                <p>(+33) 7 88 14 13 47</p>
            </div>

            <div className={styles.contactInfo}>
                <h2>Address</h2>
                <div className={styles.circleContainer}>
                <div className={styles.circle4}>
                <Image className={styles.illu2} src={Address} alt=""></Image>
                </div>
                </div>
                <p>6 Rue du Colonel Combes, 75007 Paris</p>

            </div>

        </div>
        
        </div>
        </div>
        
        
        </>
    );


    
}

export default AboutUs;