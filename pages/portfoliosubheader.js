import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "styles/portfoliosubh.module.css";

function activeelement(index) {
  const allelem = document.getElementsByClassName(styles.elem);
  for (let i = 0; i < allelem.length; i++) {
    if (i === index) {
      allelem[i].style.borderBottom = "3px solid black";
      allelem[i].style.marginBottom = "-15px";
    } else {
      allelem[i].style.borderBottom = "";
      allelem[i].style.marginBottom = "0px";
    }
  }
}

export default function Portfoliosubheader() {
  let [activeIndex, setActive] = useState(0);

  

  const handleClick = (index) => {

  };

  return (
    <div className={styles.portfoliosubheader}>
      <button className={styles.elem} onClick={() => handleClick(0)}>
        <Link href="/Portfolio">
          <p>My Portfolio</p>
        </Link>
      </button>
      <button className={styles.elem} onClick={() => handleClick(1)}>
        <Link href="/addPortfolio">
          <p>Add new</p>
        </Link>
      </button>
      <button className={styles.elem} onClick={() => handleClick(2)}>
        <Link href="/removePortfolio">
          <p>Manage</p>
        </Link>
      </button>
    </div>
  );
}
