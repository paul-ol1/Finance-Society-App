import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import Image from "next/image";
import Searchimg from "public/img/searchillustration.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();

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

function companySelection() {
  const router = useRouter();
  const [options, setOptions] = useState([]);
  const [relatedChoices, setRelatedChoices] = useState(null);
  const [popularChoices, setPopularChoices] = useState(null);

  const [currentcompany, setCurrentCompany] = useState(null);
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
  function createCompChoiceOutput(elem) {
    // Default company information

    //some company have these words attributed to it amongst others and i don't like how it looks
    const wordsToRemove = ["Common Stock", "Common Shares", "Ordinary Shares"];
    wordsToRemove.map((x) => {
      console.log(elem.name);elem.name = elem.name.replace(x, "");
    });
    let company = {
      name: elem.name + "",
      Symbol: elem.symbol + "",
    };
    // Use the push method to navigate to Page2 and send data
    router.push({
      pathname: "/dcf",
      query: { data: JSON.stringify(company) },
    });
    cookies.set("Company", company);
  }

  function createchoices(related, text) {
    return (
      <div className="relatedsearches">
        <h3>{text}</h3>
        <div>
          {related.map((x) => {
            return (
              <div
                key={x.symbol}
                className="search-elem"
                onClick={() => createCompChoiceOutput(x)}>
                <div className="symb">{x.symbol}</div>
                <div className="name">{x.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const handleicon = () => {
    let userentry = document.getElementById("compsearch").value;
    document.getElementById("compsearch").value = "";
    handleInput();
  };
  const handleInput = () => {
    let userentry = document.getElementById("compsearch").value;
    let regex = new RegExp(`^${userentry}`, "i");
    let rs = [];
    let ps = [];

    for (let i = 0; i < options.length; i++) {
      if (regex.test(options[i].name)) {
        rs.push(options[i]);
      }
    }
    for (let i = 0; i < options.length; i++) {
      if (options[i].clickcount) {
        ps.push(options[i]);
      }
    }
    ps.sort((a, b) => {
      return b.clickcount - a.clickcount;
    });
    ps = ps.splice(0, 5);
    rs = rs.splice(0, 5);
    setPopularChoices(createchoices(ps, "Popular Searches"));
    if (userentry.length > 0) {
      setRelatedChoices(createchoices(rs, "Related Searches"));
    } else {
      document.getElementsByClassName("searchbar")[0].style.borderBottom = "";
      setRelatedChoices("");
    }
  };

  useEffect(() => {}, [currentcompany]);

  return (
    <>
      <Header />
      <div className="worksheetcontent">
        <Image src={Searchimg} className="Searchimg" alt=""></Image>
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
              onInput={handleInput}></input>
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
        <div></div>
      </div>
    </>
  );
}

export default companySelection;
