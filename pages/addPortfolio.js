import React, { useEffect, useState } from "react";
import { getCookie } from "./checkcookie";
import Header from "./Header";
import sb from "pages/searchBar.js"
import styles from "styles/portfolioadd.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Portfoliosubheader from "./portfoliosubheader.js";

// Function to fetch stock data from the API
async function getstockdata(symbol) {
  const mybody = {
    symbol: symbol,
  };
  try {
    const response = await fetch("http://localhost:8080/api/getsd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mybody),
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {}
}
// Function to fetch stock data from the API
async function getotherstockdata(symbol) {
  const mybody = {
    symbol: symbol,
  };
  try {
    const response = await fetch("http://localhost:8080/api/othersd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mybody),
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {}
}

async function createPortfolio(){
    let today = getTodayDate();
    let usercookie = JSON.parse(getCookie('Userdetails'));
    const mybody = {
      id: usercookie.ID,
      date: today,
    };
    console.log(usercookie)
    try {
    const response = await fetch(
      "http://localhost:8080/api/createportfolio",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mybody),
        credentials: "include",
      }
    );;
    return response.ok;

  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

function getTodayDate() {
  let today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const datestring = `${year}-${month}-${day}`;
  return datestring;
}
 function insertintoportfolio(sqlquery,values){
const mybody={
    sqlquery:sqlquery,
    values:values
}
try {
    fetch("http://localhost:8080/api/insertintoportfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mybody),
        credentials: "include",
        });

    }
    catch (error) {
        console.error('error: ',error)
    }
}

async function addstock(companysymbol, quantity,action,price ){
    if (getCookie('Portfolio')){
        const portfolio=JSON.parse(getCookie('Portfolio'));
        console.log(portfolio.id)
        const todaydate = getTodayDate();
        const sqlquery= 'Insert INTO PortfolioEntry(PortfolioID,AssetType,Symbol,BuyPrice,Quantity,Action,Status,PurchaseDate) Values(?,?,?,?,?,?,?,?)';
        const values= [portfolio.id,'Stock',companysymbol,price,quantity,action,1,todaydate]
        insertintoportfolio(sqlquery,values);

    }
    else{
        const isSuccess = await createPortfolio();
        if (!isSuccess){
            alert("Failed to Create Portfolio")
        }
        else{
            addstock(companysymbol, quantity, action, price);

        }
    }
}
function removeCookie(cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}



export default function addSection(){

    const [company, setCompany]= useState(null);
    const [user, SetUser]= useState(null);
    const [loading,setLoading]= useState(true);
    const [stockdata, setSD]= useState(null);
    const [otherstockdata, setOSD]= useState(null);
    const [stockadded,setStockAdded]= useState(false);
    const sdattributes= ["Price", "Market Cap","Beta"];
    const osdattributes=["Expected Monthly returns", "Risk Coefficient","earnings per share","price/earnings"]
     useEffect(() => {
       if (getCookie("currentcomp")) {
         let comp = JSON.parse(getCookie("currentcomp"));
         console.log(comp)
         setCompany(comp);

         async function fetchData() {
           const sd = await getstockdata(comp.symbol);
           setSD(sd);
           const osd = await getotherstockdata(comp.symbol);
           setOSD(osd);
           setLoading(false);
         }

         fetchData();
       }

       if (getCookie("Userdetails")) {
         let userdata = JSON.parse(getCookie("Userdetails"));
         SetUser(userdata);

       }
     }, []);

     function handleclick(action){
        const quant = document.getElementById(styles.quantity).value;
        if(quant && parseInt(quant)){
        addstock(company.symbol, quant, action, stockdata[0]).then(() => {
          setStockAdded(true);
          setTimeout(() => {
            removeCookie("currentcomp");
            window.location.reload();
          }, 2000);
        });
    }

        else{
            alert('Please enter a valid quantity')
        }
     }


function stockaddeddiv() {
    console.log("x")
  return (
    <div className={styles.stockaddedanimation}>
      <FontAwesomeIcon icon={faCheck} bounce />
      Added!
    </div>
  );
}
    return (
      <>
        <Header></Header>
        <div className="content">
          <div className={styles.subheader}>
            <Portfoliosubheader />
          </div>
          <>
            <div className={styles.searchbarsec}>{sb()}</div>
            {loading ? (
              company ? (
                <div className={"spinner"}></div>
              ) : (
                <></>
              )
            ) : (
              <div className={styles.searchbarres}>
                <h2>{company.name}</h2>
                {stockadded ? (
                  <div className={styles.stockaddedanimation}>
                    <FontAwesomeIcon icon={faCheck} bounce />
                    <p>Added!</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p>Key details</p>
                      <table>
                        <thead>
                          <tr>
                            <th className={styles.th}>Element</th>
                            <th className={styles.th}> Value</th>
                            <th className={styles.th}>Industry Average</th>
                            <th className={styles.th}>Difference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sdattributes.map((elem, index) => (
                            <tr key={index}>
                              <td className={styles.index}>{elem}</td>
                              <td className={styles.values}>
                                {stockdata[index]}
                              </td>
                              <td className={styles.values}>
                                <p>-</p>
                              </td>
                              <td className={styles.values}>
                                <p>-</p>
                              </td>
                            </tr>
                          ))}
                          {osdattributes.map((elem, index) => (
                            <tr key={index}>
                              <td className={styles.index}>{elem}</td>
                              <td className={styles.values}>
                                {otherstockdata[index]}
                              </td>
                              <td className={styles.values}>
                                <p>-</p>
                              </td>
                              <td className={styles.values}>
                                <p>-</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.exec}>
                      <div className={styles.quantitydiv}>
                        <div className={styles.left}>
                          <label htmlFor={styles.quantity}>Quantity</label>
                        </div>
                        <div className={styles.right}>
                          <input
                            type="number"
                            name="quantity"
                            min="0"
                            id={styles.quantity}
                          />
                        </div>
                      </div>
                      <div className={styles.quantitydiv}>
                        <div className={styles.left}>
                          <label>Action</label>
                        </div>
                        <div className={styles.right}>
                          <button
                            id={styles.long}
                            onClick={() => {
                              handleclick(1);
                            }}>
                            Long
                          </button>
                          <button
                            id={styles.short}
                            onClick={() => {
                              handleclick(0);
                            }}>
                            Short
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        </div>
      </>
    );

}
