// Importing necessary modules and components
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Image from "next/image";
import Searchimg from "public/img/searchillustration.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

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

// Main component for company selection
function companySelection() {
  // State hooks for managing component state
  const [options, setOptions] = useState([]);
  const [relatedChoices, setRelatedChoices] = useState(null);
  const [popularChoices, setPopularChoices] = useState(null);
  const [stockprice, setStockPrice] = useState(null);
  const [currentcompany, setCurrentCompany] = useState(null);

  // Fetch companies when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const generatedOptions = await getCompanies();
        setOptions(generatedOptions);
      } catch (error) {
        console.error("Error setting options:", error);
      }
    };
    fetchData();
  }, []);

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
              onClick={() => createCompChoiceOutput(x)}>
              <div className="symb">{x.symbol}</div>
              <div className="name">{x.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Function to fetch stock data for a given symbol
  async function getsp(symbol) {
    try {
      let mybody = { symbol: symbol };
      const response = await fetch("http://localhost:8080/api/getsd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mybody),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch stock data");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }

  // Function to handle user's selection of a company
  async function createCompChoiceOutput(elem) {
    document.getElementById("compsearch").value = "" + elem.name;
    setPopularChoices(null);
    setRelatedChoices(null);
  }

  // Function to handle the click event of the magnifying glass icon
  const handleicon = () => {
    let userentry = document.getElementById("compsearch").value;
    document.getElementById("compsearch").value = "";
    handleInput();
  };

  // Function to handle user input in the search bar
  const handleInput = () => {
    let userentry = document.getElementById("compsearch").value;
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
      document.getElementsByClassName("searchbar")[0].style.borderBottom = "";
      setRelatedChoices("");
    }
  };

  // Effect hook to log the current company when it changes
  useEffect(() => {
    console.log(currentcompany);
  }, [currentcompany]);

  // Rendering the component
  return (
    <>
      <Header />
      <div className="dcfcontent">
        <Image src={Searchimg} className="Searchimg"></Image>
        <div className="ioarea">
          <div className="searchbar">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="icon" 
              id="mgicon"
            />
            <input
              type="text"
              name="compsearch"
              id="compsearch"
              placeholder="company name"
              onChange={handleInput} // Using onChange instead of onInput
            ></input>
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
        <div>{/* Additional content goes here */}</div>
      </div>
    </>
  );
}

// Exporting the component as "dcf"
export default companySelection;
