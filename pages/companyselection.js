import React, { useEffect, useState } from "react";
import Header from "./Header";
import Image from "next/image";
import Searchimg from "public/img/searchillustration.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleXmark,faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

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

  const [options, setOptions] = useState([]);
  const [relatedChoices, setRelatedChoices] = useState(null);
  const [popularChoices,setPopularChoices]=useState(null);
  const [stockprice, setStockPrice] = useState(null);
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
  function createchoices(related,text){
    return(
      <div className="relatedsearches">
          <h3>{text}</h3>
          <div>
            {related.map((x)=>{
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
    )
  }

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

   async function createCompChoiceOutput(elem) {
    document.getElementById("compsearch").value = ""+elem.name;
    setPopularChoices(null);
    setRelatedChoices(null);
   }
  const handleicon=()=>{
    let userentry = document.getElementById("compsearch").value;
    document.getElementById("compsearch").value="";
    handleInput()
  }
  const handleInput = () => {

    let userentry = document.getElementById("compsearch").value;
    let regex = new RegExp(`^${userentry}`, "i");
    let rs = [];
    let ps=[];

    for (let i = 0; i < options.length; i++) {
      if (regex.test(options[i].name)) {
        rs.push(options[i]);
      }
    }
    console.log(rs);
    for (let i = 0; i < options.length; i++) {
      if (options[i].clickcount) {
        ps.push(options[i])
      }
    }
    ps.sort((a,b)=>{
      return b.clickcount - a.clickcount
    })
    ps= ps.splice(0,5);
    rs =rs.splice(0,5);
    setPopularChoices(createchoices(ps,"Popular Searches"));
    if(userentry.length>0){
    setRelatedChoices(createchoices(rs, "Related Searches"));}
    else{
      document.getElementsByClassName("searchbar")[0].style.borderBottom =
        "";
      setRelatedChoices('');
    }
  };

  useEffect(() => {
    console.log(currentcompany);
  }, [currentcompany]);

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
        <div>
        </div>
      </div>
    </>
  );
}

export default dcf;
