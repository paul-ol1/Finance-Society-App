import React, { useEffect, useState } from "react";
import { getCookie } from "./checkcookie";
import Header from "./Header";
import Image from "next/image";
import createimg from "public/img/create.png";
import manageimg from "public/img/manage.png";
import analyticsimg from "public/img/analytics.png";
import decisions from "public/img/decisions.png";
import styles from "styles/portfolio.module.css";
import Link from "next/link";
import Portfoliosubheader from "./portfoliosubheader.js";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut,Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
const testcase= [['Stock','Bonds','Commodity'],[10000,2000,4000]];
function generateRandomColor(arr) {
  let setofColor=[];
  console.log(arr.length);
  const randomColor = () => Math.floor(Math.random() * 256);
  for (let i = 0; i < arr.length; i++) {
    setofColor.push(`rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.7)`)
}
  return setofColor;
}

function assettypesplit(userdata){
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Asset Breakdown",
        font: {
          size: 30,
        },
        align: "center",
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 24,
          boxHeight: 20,
          padding: 10,
        },
      },
    },
  };
  const data = {
    labels: userdata[0],
    datasets: [
      {
        data: userdata[1],
        backgroundColor: generateRandomColor(userdata[1]),


      },
    ],
  };
  return <Doughnut options={options} data={data} />;
}
const testData = [
  {
    name: "Stock A",
    quantity: 5,
    buyprice: 50,
    currentprice: 60,
  },
  {
    name: "Stock B",
    quantity: 10,
    buyprice: 30,
    currentprice: 25,
  },
  {
    name: "Stock C",
    quantity: 8,
    buyprice: 40,
    currentprice: 45,
  },
];

function NewPortfolio() {

  return (
    <div className={styles.welcome}>
      <div className={styles.upper}>
        <h2>Welcome to Your Portfolio!</h2>
      </div>
      <div className={styles.lower}>
        <div>
          <Image src={createimg} alt="Create Icon" />
          <p>
            Create a personalized financial portfolio and begin tracking your
            investments today.
          </p>
        </div>
        <div>
          <Image src={manageimg} alt="Manage Icon" />
          <p>
            Effortlessly manage and update your financial portfolio to reflect
            your current holdings.
          </p>
        </div>
        <div>
          <Image src={analyticsimg} alt="Analytics Icon" />
          <p>
            Gain valuable insights into the performance of your portfolio
            through detailed analytics.
          </p>
        </div>
        <div>
          <Image src={decisions} alt="Decisions Icon" />
          <p>
            Make well-informed financial decisions based on the comprehensive
            data at your fingertips.
          </p>
        </div>
      </div>
      <link></link>
      <Link href={`/addPortfolio`} style={{ textDecoration: "none" }}>
        <button className={styles.start}>Get Started</button>
      </Link>
    </div>
  );
}

function portfoliosummary(amountinvested,currentVolatility,eryearly){
return (
  <div id={styles.portfolioSummary} className={styles.cbox}>
    <div className={styles.boxheader}>
      <FontAwesomeIcon icon={faHandHoldingDollar} className={styles.icon} />
      <div>
        <h3>Amount Invested</h3>
        <h1 style={{marginTop:'-10px'}}>$ {amountinvested}</h1>
      </div>
    </div>
    <div className={styles.boxbody}>
      <div>
        <p>Current Volatility</p>
        <p>{currentVolatility}</p>
      </div>
      <div>
        <p>Expected Return(Yearly)</p>
        <p>{eryearly}</p>
      </div>
    </div>
  </div>
);
}

function portfoliovalue(currval, dailyreturn, absreturn) {
  return (
    <div id={styles.portfolioValue} className={styles.cbox}>
      <div className={styles.boxheader}>
        <FontAwesomeIcon icon={faHandHoldingDollar} className={styles.icon} />
        <div>
          <h3>Current Value</h3>
          <h1 style={{ marginTop: "-10px" }}>$ {currval}</h1>
        </div>
      </div>
      <div className={styles.boxbody}>
        <div>
          <p>Daily Return</p>
          <p>{dailyreturn}</p>
        </div>
        <div>
          <p>Absolute Return</p>
          <p>{absreturn}</p>
        </div>
      </div>
    </div>
  );
}
function currentportfolio(data){
  return (
    <div id={styles.currentportfolio}>
      <h2>Current Portfolio</h2>
      <div>
        <table>
          <thead>
            <tr className={styles.theader}>
              <th className={styles.tableheadelem}>Name</th>
              <th className={styles.tableheadelem}>Quantity</th>
              <th className={styles.tableheadelem}>Buy Price</th>
              <th className={styles.tableheadelem}>Current Price</th>
              <th className={styles.tableheadelem}>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {data.map((elem, index) => {
              if (elem.quantity > 0) {
                let gainloss = elem.currentprice - elem.buyprice;
                return (
                  <tr key={index}>
                    <td className={styles.tablerowelem}>{elem.name}</td>
                    <td className={styles.tablerowelem}>{elem.quantity}</td>
                    <td className={styles.tablerowelem}>${elem.buyprice}</td>
                    <td className={styles.tablerowelem}>${elem.currentprice}</td>
                    <td className={styles.tablerowelem}>{gainloss < 0 ? `-$${Math.abs(gainloss)}` : `$${gainloss}`}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
async function getportfoliodata(id) {
  const mybody = {
    id: id,
  };
  try {
    const response = await fetch("http://localhost:8080/api/getportfoliodata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mybody),
      credentials: "include",
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error("error: ", error);
  }
}
function totalsuminvested(data) {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const val = data[i].BuyPrice * data[i].Quantity;
    total += val;
  }
  console.log(total);
  return total;
}
export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [userID, setUserId] = useState(null);
  const [currentVolatility, setCurrentVolatility] = useState(0);
  const [suminvested, setSumInv] = useState(0);
  const [assetSplit, setAssetSplit] = useState([]);
  const [loading,setLoading]= useState(true);

  function totalsuminvested(data) {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      const val = data[i].BuyPrice * data[i].Quantity;
      total += val;
    }
    setSumInv(total.toFixed(2))
    return total;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming "portfolioCookie" is the name of the cookie you want to retrieve
        const cookieValue = await getCookie("Portfolio");
        setPortfolio(cookieValue);
        const usercookie = await getCookie("Userdetails");
        const userid = JSON.parse(usercookie).ID;
        setUserId(JSON.parse(usercookie).ID);
        const portfoliodata = await getportfoliodata(userid);
        console.log(portfoliodata);
        totalsuminvested(portfoliodata);
        let assetsplit=[[],[]]
        portfoliodata.map((x)=>{
          if(!assetsplit[0].includes(x.AssetType)){
            assetsplit[0].push(x.AssetType)
          }
          const index=assetsplit[0].indexOf(x.AssetType);
          let currelem= parseFloat(assetsplit[1][index])?parseFloat(assetsplit[1][index]):0;
          currelem += (x.Quantity *x.BuyPrice);
          assetsplit[1][index]= parseFloat(currelem.toFixed(2));
        })
        setAssetSplit(assetsplit)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Portfolio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="content">
        {portfolio ? (
          <>
          {loading?<></>:(
            <>
            <div className={styles.subheader}>
              <Portfoliosubheader />
            </div>
            <div className={styles.portfoliosubcont}>
              <div className={styles.firstlayer}>
                <div className={styles.overview}>
                  <div className={styles.overviewtop}>
                    {portfoliosummary(suminvested, 1.2, 1.5)}
                    {portfoliovalue(20000, 1.23, 3)}
                  </div>
                  <div className={styles.overviewbottom}>
                    {currentportfolio(testData)}
                  </div>
                </div>
                <div className={styles.repartition}>
                  {assettypesplit(testcase)}
                </div>
              </div>
            </div>
            </>
          )
          }

          </>
        ) : (

            <NewPortfolio />
        )}
      </div>
    </>
  );};