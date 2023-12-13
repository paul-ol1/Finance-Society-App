import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import styles from "styles/sb.module.css";
import Cookies from "js-cookie";
// Function to create JSX for related and popular choices
  function createchoices(related, text) {
    return (
      <div className="relatedsearches">
        <h3>{text}</h3>
        <div>
          {related.map((x) => (
            <div
              key={x.symbol} // Unique key for each dynamically created element
              className="search-elem"
              onClick={() =>{Cookies.set("currentcomp", JSON.stringify(x)),
                window.location.reload();}}>
              <div className="symb">{x.symbol}</div>
              <div className="name">{x.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
// Function to fetch companies from the API
async function getCompanies() {
  try {
    const response = await fetch("http://localhost:8080/api/companies");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

export default function searchbar(){
  // State hooks for managing component state
  const [options, setOptions] = useState([]);
  const [relatedChoices, setRelatedChoices] = useState(null);
  const [popularChoices, setPopularChoices] = useState(null);
  useEffect(()=>{
    async function fetchData() {
        let companies = await getCompanies();
        setOptions(companies)
    }
    fetchData();
  },[])
  // Function to handle user's selection of a company
  async function createCompChoiceOutput(elem) {
    document.getElementById(styles.searchbar).value = "" + elem.name;
    setPopularChoices(null);
    setRelatedChoices(null);
  }

  // Function to handle the click event of the magnifying glass icon
  const handleicon = () => {
    let userentry = document.getElementById(styles.searchbar).value;
    document.getElementById(styles.searchbar).value = "";
    handleInput();
  };

  // Function to handle user input in the search bar
  const handleInput = () => {
    let userentry = document.getElementById(styles.searchbar).value;
    let regex = new RegExp(`^${userentry}`, "i");
    let rs = [];
    let ps = [];


    // Filter options based on user input
    for (let i = 0; i < options.length; i++) {
      if (regex.test(options[i].name)) {
        rs.push(options[i]);
      }
    }

    // Filter popular choices based on click count
    for (let i = 0; i < options.length; i++) {
      if (options[i].clickcount) {
        ps.push(options[i]);
      }
    }

    // Sort popular choices based on click count and take the top 5
    ps.sort((a, b) => {
      return b.clickcount - a.clickcount;
    });
    ps = ps.splice(0, 5);
    rs = rs.splice(0, 5);

    // Update state with the JSX for related and popular choices
    setPopularChoices(createchoices(ps, "Popular Searches"));
    if (userentry.length > 0) {
      setRelatedChoices(createchoices(rs, "Related Searches"));
    } else {
      document.getElementById(styles.searchbar).style.borderBottom = "";
      setRelatedChoices("");
    }
  };


  return (
    <>
      <div className={styles.ioarea}>
        <div className={styles.sbarea}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon}id="mgicon"/>
          <input type="text" name="searchbar" id={styles.searchbar} onChange={handleInput}></input>
          <div onClick={handleicon} className="xicon">
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>
        </div>
        {relatedChoices ? (
          <div className="related-results">{relatedChoices}</div>
        ) : null}
        {relatedChoices ? (
          <div className="popular-results">{popularChoices}</div>
        ) : null}
      </div>
    </>
  );
}

