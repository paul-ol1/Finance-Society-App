import React, { useState, useEffect } from "react";
import Header from "./Header";
import Image from "next/image";
import Link from "next/link";
import SignUp from "./Signup";
import { getCookie } from "./checkcookie";
import QuestionImg from "/public/img/question.png";
import FAQImg from "/public/img/faq.jpg";
import styles from "styles/help.module.css";

function Help() {
  const faqs = [
    {
      question: "I can't connect due to my email address?",
      answer: "To login into the finance society software you need to use you aup email address and not your personal one.",
    },
    {
      question: "I don't have much background in finance, is it a problem?",
      answer: "There is a section in the software where you can learn basic definitions in the finance industry. Furthermore when trying to valuate a company, you will have the option to get more infromation from the different elements.",
    },
    {
        question: "How does the data in the software work?",
        answer: "The data is the real time data of the companies that we have access to, the stock price are available for publicly listed companies and updates in real time",
      },
      {
        question: "The company page does not load.",
        answer: "It usually takes some time for the page to load, be patient.",
      },
      {
        question: "What companies do I have acces to?",
        answer: "The companies that you have access to are all of the publicly listed companies on the NYSE",
      },
      {
        question: "Will I be able to study using the finance society software?",
        answer: "The software can help you understand better some concepts and formulas, but it can't replace what you learn in class, study hard.",
      },
      {
        question: "I found a bug, to whom should I report it to?",
        answer: "If you found a bug then please do report it either to the contact information in the about us page, or to this email address: a106446@aup.edu",
      }

  ];

  const [activeIndices, setActiveIndices] = useState([]);

  const toggleFAQ = (index) => {
    if (activeIndices.includes(index)) {
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      setActiveIndices([...activeIndices, index]);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.top}>
          <Image className={styles.illu} src={QuestionImg} alt=""></Image> 
          <h2>Frequently asked questions</h2>
        </div>
        <div className={styles.line}>
        <div className={styles.box1}>
        </div>
        <div className={styles.box2}>
        </div>
        </div>

          <div className={styles.faqContainer}>
          <Image className={styles.big} src={FAQImg} alt=""></Image>
            <div className={styles.faqItem}>
            {faqs.map((faq, index) => (
              <div key={index} >
                <div
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                </div>
                {activeIndices.includes(index) && (
                  <div className={styles.faqAnswer}>{faq.answer}</div>
                )}
              </div>
            ))}
            </div>
          </div>
        
      </div>
    </>
  );
}

export default Help;
