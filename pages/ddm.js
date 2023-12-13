import React, { useEffect, useState } from "react";
import Header from "./Header";
import styles from "styles/ddm.module.css";

const company = {
  name: "TESLA",
  symbol: "A",
};

async function getdividends() {
  const mybody = {
    symbol: company.symbol,
  };

  const response = await fetch("http://localhost:8080/api/dividends", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mybody),
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

function DDM() {
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elem, setElem] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getdividends();
        
        if (data.length > 0) {
           console.log(data);
          setDividends(data);
        } else {
          setElem(false);
        }
      } catch (error) {
        console.error("Error fetching dividends:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="content">
        {loading ? (
          <div className={styles.spinner}></div>
        ) : elem ? (
          <div>
            {/* Render your dividend data here */}
            {dividends.map((dividend, index) => (
              <p key={index}>{/* Render your dividend data here */}</p>
            ))}
          </div>
        ) : (
          <div>
            <p>No dividends available.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default DDM;
