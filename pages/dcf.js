import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import styles from "styles/dcf.module.css";
import ReactDOM from "react-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getCookie } from "./checkcookie";
import { BarElement } from "chart.js";
import { Bar, Line, Scatter, Bubble } from "react-chartjs-2";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// Registering chart elements with ChartJS
ChartJS.register(BarElement);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
// Function to calculate Compound Annual Growth Rate (CAGR)
function calculateCAGR(values) {
  let beginningValue = parseFloat(values[0]);
  if (isNaN(beginningValue) || beginningValue <= 0) {
    beginningValue = 0;
  }

  let endingValue = parseFloat(values[values.length - 1]);
  if (isNaN(endingValue) || endingValue <= 0) {
    endingValue = 0;
  }

  let numberOfYears = values.length;
  if (numberOfYears <= 0) {
    numberOfYears = 0;
  }

  const cagr = (
    Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1
  ).toFixed(2);

  return cagr;
}

// Function to project cash flows based on growth rate
//returns array of future cash flows based on the last cashflow, growth rate and the ammount of projected periods
function projectionarr(value, gr, period) {
  let growth = parseFloat(gr);
  let proj = [];
  for (let i = 0; i < period; i++) {
    const currentPeriod = i + 1;
    let projectedValue;
    if (i === 0) {
      projectedValue = parseFloat((value * (1 + growth)).toFixed(3));
    } else {
      projectedValue = parseFloat((proj[i - 1] * (1 + growth)).toFixed(3));
    }
    proj.push(projectedValue);
  }

  return proj;
}

// Function to fetch key information from the API
async function getkeyinformation(symbol) {
  const mybody = {
    symbol: symbol,
  };
  try {
    const response = await fetch("http://localhost:8080/api/keyinfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mybody),
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching information:", error);
  }
}

// Function to fetch treasury data from the API
async function gettreasury() {
  try {
    const response = await fetch("http://localhost:8080/api/gettr");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching information:", error);
  }
}

// Function to fetch market data from the API
async function getmarket() {
  try {
    const response = await fetch("http://localhost:8080/api/getmr");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching information:", error);
  }
}

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

// Function to fetch cash flow data from the API
async function getCashflow(symbol) {
  const mybody = {
    symbol: symbol,
  };
  try {
    const response = await fetch("http://localhost:8080/api/cfs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mybody),
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching information:", error);
  }
}
function keyinfo_help(func){
  // key info help div in the calculation of Dcf
  return (
    <div className={styles.help}>
      <h2>Key Information</h2>
      <div>
        <h3>Total Assets</h3>
        <p>
          Total assets are used to find the weights of debts and liabilities in
          the calculation of the discount rate. In DCF analysis, the discount
          rate often includes a cost of debt component. The weights of debt and
          equity in the capital structure are crucial for determining the
          appropriate discount rate.
        </p>
      </div>
      <div>
        <h3>Total Debt</h3>
        <p>
          The amount of debt the company has. In the context of DCF, it's a key
          factor in determining the weighted average cost of capital (WACC),
          which is used as the discount rate in the DCF formula. WACC is the
          average rate of return a business is expected to provide to all its
          investors, including debt holders
        </p>
      </div>
      <div>
        <h3>Excess Cash</h3>
        <p>
          Excess cash refers to the amount of cash and cash equivalents held by
          the company beyond what is needed for its regular operations. In DCF,
          it is used in the calculation of the intrinsic value as it tells how
          liquid the company is if it had to repay all it's debts now, so its a
          good estimate of current position.
        </p>
      </div>
      <div>
        <h3>Interest Expense</h3>
        <p>
          Interest expense is the cost of borrowing for the company. It is
          deducted from the operating income to calculate the earnings before
          interest and taxes (EBIT). Understanding the interest expense is
          crucial for calculating the cost of debt in the WACC
        </p>
      </div>
      <div>
        <h3>Income Tax Rate</h3>
        <p>
          The income tax rate is essential for calculating the after-tax cost of
          debt. It is used in determining the tax shield on interest payments.
          The tax shield helps reduce the overall cost of debt for the company.
        </p>
      </div>
      <div>
        <h3>Stock Price</h3>
        <p>
          The stock price is the current market price of the company's shares.
          Crucial to the model it is used to derive the share's intrinsic value
          and check how it compares to market price
        </p>
      </div>
      <div>
        <h3>Shares Outstanding</h3>
        <p>Used to calculate Market Cap</p>
      </div>
      <div>
        <h3>Beta</h3>
        <p>
          Beta is a measure of a stock's volatility in relation to the overall
          market. It is used in the Capital Asset Pricing Model (CAPM) to
          estimate the cost of equity. The cost of equity is a component of the
          WACC.
        </p>
      </div>
      <div>
        <h3>Discount Rate</h3>
        <p>
          The discount rate, often represented as a percentage, is used to
          discount future cash flows back to their present value. In DCF, it's
          typically the weighted average cost of capital (WACC), which combines
          the cost of equity and cost of debt.
        </p>
      </div>
      <div>
        <h3>Short Term Growth Rate</h3>
        <p>
          This represents the expected growth rate of the company's free cash
          flows in the short term. It's used in the forecast period of the DCF
          analysis.
        </p>
      </div>
      <div>
        <h3>Long Term Growth Rate</h3>
        <p>
          This represents the expected growth rate of the company's free cash
          flows in the long term, typically after the forecast period. It's used
          in perpetuity to estimate the terminal value in the DCF formula.
        </p>
      </div>
      <div className={styles.helpbuttdiv}>
        <button onClick={()=>{func(false)}} > Close </button>
      </div>

    </div>
  );
}
// Main component for DCF calculations
export default function Dcf() {
  const router = useRouter();

  const { data } = router.query;
  const cookies = new Cookies();

  // Parse the JSON data if available, otherwise set company to null
  let company = data ? JSON.parse(data) : null;

  // Remaining key information to be displayed
  const remainingkeyinfo = ["Stock Price", " Shares Outstanding", "Beta"];

  // State variables to store fetched data
  const [keyinformation, setKeyInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cashFlows, setCFS] = useState(null);
  const [stockdata, setStockData] = useState(null);
  const [treasuryrate, setrate] = useState(null);
  const [fcf, setFcf] = useState(null);
  const [gr, setgr] = useState(null);
  const [discountrate, setDiscountRate] = useState(null);
  const [marketreturns, setMarketreturns] = useState(null);
  const [Capm, setCapm] = useState(null);
  const [costofdebt, setCOD] = useState(null);
  const [pfcf, setPFCF] = useState(null);
  const [marketcap, setMarketcap] = useState(null);
  const [ltg, setLtg] = useState(null);
  const [intrinsicvalue, setintrinsicvalue] = useState(null);
  const [marketvalue, setmarketValue] = useState(null);
  const [keyinfohelpstate,setKeyInfoHelpstate] = useState(false);
  const intrinsicValUpdated = useRef(false);
  const marketvalUpdated = useRef(false);
  function changeallkeyinfo(index){
    let elem= Array.from(document.getElementsByClassName(styles.keyinfoinput))[index];
    elem = elem.value;
    let ki = [...keyinformation]
    ki[index].value = elem;
    setKeyInformation(ki);
    marketvalUpdated.current= false;
    intrinsicValUpdated.current= false;
    calcwacc(
      stockdata[2],
      keyinformation[0].value,
      keyinformation[1].value,
      marketreturns,
      treasuryrate,
      keyinformation[3].value,
      keyinformation[keyinformation.length - 1].value
    );

  }
  // Function to calculate WACC and update state
  async function calcwacc(
    beta,
    assets,
    debt,
    mreturns,
    rfr,
    interestexp,
    taxrate
  ) {
    const pofdebt = debt / assets;
    const pofequity = 1 - pofdebt;
    let debtsection = (interestexp / debt) * (1 - taxrate);
    let equitysection = rfr + beta * (mreturns - rfr);
    const wacc = (pofdebt * debtsection + pofequity * equitysection) / 100;

    setCapm(equitysection.toFixed(3)); // set capm
    setCOD(debtsection.toFixed(3)); // set cost of debt
    setDiscountRate(wacc.toFixed(3)); //set discount rate
    setLtg((wacc * (1 - 0.3)).toFixed(2)); // set long term growth rate as 70% of the discount rate
  }

  // Function to update free cash flow based on user input
  async function changefcf(elem, index) {
    // for each change you go back to the beginning of the row
    let i = (index % 4) - 4; // get the initial position in the columns of arrays
    let sum = 0;
    for (let x = 0; x < 4; x++) {
      i = i + 4;
      let curr = parseInt(document.querySelectorAll("input")[i].value); // get current element in int

      if (!isNaN(curr)) {
        sum += curr;
      }
    }
    Array.from(document.getElementsByClassName(styles.fcf))[index].value = sum; // edit the fcf  at the current index to the new sum

    // Create a copy of the fcf array
    let newFcf = [...fcf];
    newFcf[index] = sum; // change the fcf at the modified position
    setFcf(newFcf); // set newfcf
    setgr(calculateCAGR(newFcf)); // calculate and set new growth rate
  }

  // useEffect to call the API and update state with result
  useEffect(() => {
    if (!getCookie("Userdetails")) {
      // If User Not Logged in Send Back Home
      router.push("/"); // Landing Page
    } else {
      // if user Logged in
      if (!getCookie("Company")) {
        // If user doesnt have a company chosen but somehow ends up here send back to worksheet start page
        router.push("/Worksheet");
      } else {
        // in case of reload over a chosen company, it for some reason takes time on react to get initial data
        // so parse already existing cookie on the company details, it reduces time on it too
        if (!company) {
          company = JSON.parse(getCookie("Company"));
        }
        //some company have these words attributed to it amongst others and i don't like how it looks
      }
    }
    // if companies not null in both cases of cookies and initial
    if (company) {
      intrinsicValUpdated.current = false; // i'm using a ref (i'll come back to this)
      marketvalUpdated.current = false;
      async function fetchData() {
        try {
          // Fetching key information
          const keyinfo = await getkeyinformation(company.Symbol);
          setKeyInformation(keyinfo);

          // Fetching treasury data
          const tr = await gettreasury();
          setrate(tr);

          // Fetching market data
          const mr = await getmarket();
          setMarketreturns(mr);

          // Fetching stock data
          const sd = await getstockdata(company.Symbol);
          setStockData(sd);

          // Fetching cash flow data
          const cfs = await getCashflow(company.Symbol);
          setCFS(cfs);
          // get all cashflows to calculate a cagr
          await getCashflow(company.Symbol).then((x) => {
            let arr = [];
            x.map((elem) => {
              arr.push(parseInt(elem.values[3])); // push the fcf
            });
            const growthr = calculateCAGR(arr);
            // set growth rate from the calc cagr
            setgr(growthr);
            setFcf(arr);
          });
          calcwacc(
            sd[2],
            keyinfo[0].value,
            keyinfo[1].value,
            mr,
            tr,
            keyinfo[3].value,
            keyinfo[keyinfo.length - 1].value
          ); // calc wacc, inserting beta, TA,TD, market returns, 5 year treasury, current tax rate
          setMarketcap(
            ((parseFloat(sd[0]) * parseFloat(sd[1])) / 1000).toFixed(3)
          );
          setLoading(false);
        } catch (error) {}
      }
      fetchData();
    }
  }, [intrinsicValUpdated,marketvalUpdated]);

  // Function to generate a table for Statement of Cashflow - Free Cash Flow (FCF)
  function getcftable(arr) {
    return (
      <>
        {/* Subtitle for the table */}
        <div className={styles.tablesubtitle}>
          <p>Statement of Cashflow -&gt; Free Cash Flow (FCF)</p>
          <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
        </div>

        {/* Table structure */}
        <table style={{ borderCollapse: "collapse" }}>
          {/* Table header */}
          <thead className={styles.tablehead}>
            <tr className={styles.tableheadr}>
              {/* Empty header cell */}
              <th scope="col" className={styles.tableheadelem}>
                {"  "}
              </th>

              {/* Generate header cells based on the dates in the provided array */}
              {arr.map((elem) => {
                return (
                  <th
                    scope="col"
                    key={elem.date}
                    className={styles.tableheadelem}>
                    <p> {elem.date.substring(0, 4)}</p>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {/* Row for the first account */}
            <tr className={styles.tablerow}>
              {/* Index cell for the first account */}
              <th scope="row" className={styles.tableindex}>
                {arr[0].accounts[0]}
              </th>

              {/* Generate cells for input fields for the first account values */}
              {arr.map((elem, index) => (
                <td className={styles.tablevalues} key={index}>
                  <input
                    onChange={(event) => changefcf(event, index)}
                    className={styles.tableinput}
                    defaultValue={elem.values[0]}></input>
                </td>
              ))}
            </tr>

            {/* Row for the second account */}
            <tr className={styles.tablerow}>
              {/* Index cell for the second account */}
              <th scope="row" className={styles.tableindex}>
                {arr[0].accounts[4]}
              </th>
            </tr>

            {/* Rows for sub-accounts */}
            {/* Row for the second account sub-accounts */}
            <tr className={styles.tablerow}>
              {/* Index cell for the first sub-account */}
              <th scope="row" className={styles.tableindex_sub}>
                {arr[0].accounts[1]}
              </th>

              {/* Generate cells for input fields for the first sub-account values */}
              {arr.map((elem, index) => (
                <td className={styles.tablevalues} key={index}>
                  <input
                    onChange={(event) => changefcf(event, index)}
                    className={styles.tableinput}
                    defaultValue={elem.values[1]}></input>
                </td>
              ))}
            </tr>

            {/* Row for the third account sub-accounts */}
            <tr className={styles.tablerow}>
              {/* Index cell for the second sub-account */}
              <th scope="row" className={styles.tableindex_sub}>
                {arr[0].accounts[2]}
              </th>

              {/* Generate cells for input fields for the second sub-account values */}
              {arr.map((elem, index) => (
                <td className={styles.tablevalues} key={index}>
                  <input
                    onChange={(event) => changefcf(event, index)}
                    className={styles.tableinput}
                    defaultValue={elem.values[2]}></input>
                </td>
              ))}
            </tr>

            {/* Row for "Other Capital Expenditures" */}
            <tr className={styles.tablerow}>
              {/* Index cell for "Other Capital Expenditures" */}
              <th scope="row" className={styles.tableindex_sub}>
                Other Capital Expenditures
              </th>

              {/* Generate cells for input fields for "Other Capital Expenditures" values */}
              {arr.map((elem, index) => (
                <td className={styles.tablevalues} key={index}>
                  <input
                    onChange={(event) => changefcf(event, index)}
                    className={styles.tableinput}
                    defaultValue={
                      elem.values[4] - elem.values[1] - elem.values[2]
                    }></input>
                </td>
              ))}
            </tr>

            {/* Row for "Free Cash Flow" */}
            <tr className={styles.tablerow} id={styles.fcf}>
              {/* Index cell for "Free Cash Flow" */}
              <th scope="row" className={styles.tableindex}>
                {arr[0].accounts[3]}
              </th>

              {/* Generate cells for input fields for "Free Cash Flow" values */}
              {arr.map((elem, index) => (
                <td className={styles.tablevalues} key={index}>
                  <input
                    className={`${styles.tableinput} ${styles.fcf}`}
                    defaultValue={elem.values[3]}
                    readOnly={true}></input>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  // get the divs with future projections(calc it first)
  function getprojections() {
    let currentyear = parseInt(
      cashFlows[cashFlows.length - 1].date.substring(0, 4)
    ); // get most recent year in the statement of cashflow so it can be incremented over
    let projectedyears = [];
    for (let x = 0; x < 5; x++) {
      projectedyears.push("" + ++currentyear); // increment over years to be projected
    }
    const projvalue = projectionarr(parseInt(fcf[fcf.length - 1]), gr, 5); // get an array of future projections of the nexxt preset years
    return (
      <>
        <div className={styles.tablesubtitle}>
          <p>Free Cash Flow Projections(in thousands)</p>
          <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
        </div>
        <table style={{ borderCollapse: "collapse" }}>
          <thead className={styles.tablehead}>
            <tr className={styles.tableheadr}>
              <th scope="col" className={styles.tableheadelem}>
                {"  "}
              </th>
              {projectedyears.map((elem) => {
                return (
                  <th scope="col" key={elem} className={styles.tableheadelem}>
                    <p> {elem}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tablerow}>
              <th scope="row" className={styles.tableindex}>
                FCF
              </th>
              {projvalue.map((elem, index) => (
                <td className={styles.tablevalues} key={index}>
                  <input
                    className={styles.tableinput}
                    defaultValue={"" + elem}
                    style={{
                      backgroundColor: "white",
                      cursor: "auto",
                    }}
                    readOnly={true}></input>
                </td>
              ))}
            </tr>
            <tr className={styles.tablerow}>
              <th scope="row" className={styles.tableindex}>
                Discounted FCF
              </th>
              {projvalue.map((elem, index) => (
                <td className={styles.tablevalues} key={index}>
                  <input
                    className={styles.tableinput}
                    style={{
                      backgroundColor: "white",
                      cursor: "auto",
                    }}
                    defaultValue={(
                      elem / Math.pow(1 + parseFloat(discountrate), index + 1)
                    ).toFixed(2)}
                    readOnly={true}></input>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  // get div with key informations
  function getkeyinfodiv() {
    return (
      <>
        <div className={styles.subtitle}>
          <p>Key Information (in thousands)</p>
            <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} onClick={()=>{setKeyInfoHelpstate(!keyinfohelpstate)}}/>
        </div>
        {keyinformation.map((elem, index) => {
          return (
            <div className={styles.boxrow} key={index}>
              <div>
                <p>{elem.name}</p>
              </div>
              <div className={styles.boxrowval}>
                <input defaultValue={elem.value} className= {styles.keyinfoinput}onChange={()=>{changeallkeyinfo(index)}}></input>
              </div>
            </div>
          );
        })}

        {stockdata.map((elem, index) => {
          return (
            <div className={styles.boxrow} key={index}>
              <div>
                <p>{remainingkeyinfo[index]}</p>
              </div>
              <div className={styles.boxrowval}>
                <p>{elem}</p>
              </div>
            </div>
          );
        })}
        <div className={styles.boxrow}>
          <div>
            <p>Discount Rate</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{discountrate}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Short Term Growth Rate</p>

          </div>
          <div className={styles.boxrowval}>
            <p>{(gr * 100).toFixed(2)}%</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Long Term Growth Rate</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{(ltg * 100).toFixed(2)}%</p>
          </div>
        </div>
      </>
    );
  }
  // generate random colors for the bar chart,
  function generateRandomColor() {
    const randomColor = () => Math.floor(Math.random() * 256);
    return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.7)`;
  }
  // Bar Chart
  function BarChart() {
    // Clone the 'fcf' array to avoid modifying the original array
    let arr = [...fcf];

    // Create an array of data labels by extracting the first 4 characters of each 'date' property
    const dataLabels = cashFlows.map((elem) => elem.date.substring(0, 4));

    // Configuration options for the Bar chart
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          type: "category",
          labels: dataLabels, // Use the dataLabels array as x-axis labels
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Free Cash Flow Spread",
          font: {
            size: 30,
          },
          align: "center",
        },
        legend: {
          display: false,
          position: "top",
        },
      },
    };

    // Data for the Bar chart
    const data = {
      labels: dataLabels, // Use the dataLabels array as labels
      datasets: [
        {
          label: "Free Cash Flow",
          data: arr, // Use the cloned 'arr' array as the data for the chart
          backgroundColor: arr
            .map((value) =>
              typeof value === "number"
                ? generateRandomColor()
                : "rgba(0, 0, 0, 0)"
            )
            .filter((color) => color !== "rgba(0, 0, 0, 0)"), // Generate random colors for numbers, filter out transparent colors
          hoverOffset: 4,
          barThickness: 20,
        },
      ],
    };

    // Render the Bar chart component with the specified options and data
    return <Bar options={options} data={data} />;
  }

  // Function to generate a line chart for projected cashflows
  function linechart() {
    // Define the number of projected years
    const years = 5;

    // Calculate the current year based on the last entry in cashFlows
    let currentyear = parseInt(
      cashFlows[cashFlows.length - 1].date.substring(0, 4)
    );

    // Generate an array of projected years
    let projectedyears = [];
    for (let x = 0; x < years; x++) {
      projectedyears.push("" + ++currentyear);
    }

    // Calculate the projected cashflow values using the projectionarr function
    const projvalue = projectionarr(parseInt(fcf[fcf.length - 1]), gr, years);

    // Discount the projected values based on the discount rate
    let discountedprojvalue = projvalue.map((elem, index) =>
      parseFloat(
        (elem / Math.pow(1 + parseFloat(discountrate), index + 1)).toFixed(3)
      )
    );

    // Define chart options
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Projected Cashflows",
          font: {
            size: 25,
            weight: "bold",
          },
          textAlign: "center",
        },
        legend: {
          display: false,
        },
      },
    };

    // Define chart data
    const data = {
      labels: projectedyears,
      datasets: [
        {
          label: "Projected Cashflows",
          data: discountedprojvalue,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    // Return the Line chart component with data and options
    return <Line data={data} options={options} />;
  }

  // Function to generate a vertical bar chart for market value vs intrinsic value
  function verticalbar() {
    // Parse and format market value and intrinsic value
    const mv = parseFloat(marketvalue).toFixed(2);
    const iv = parseFloat(intrinsicvalue).toFixed(2);

    // Define chart options
    const options = {
      indexAxis: "y",
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Market Value v Intrinsic Value",
          font: {
            size: 25,
            weight: "bold",
            textAlign: "left",
          },
          textAlign: "left",
        },
      },
    };

    // Define chart data
    const data = {
      labels: [""],
      datasets: [
        {
          label: "Intrinsic Value",
          data: [iv],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Difference",
          data: [iv - mv],
          borderColor: "rgb(255, 205, 86)",
          backgroundColor: "rgba(255, 205, 86, 0.5)",
        },
        {
          label: "Market Value",
          data: [mv],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    };

    // Return the Bar chart component with data and options
    return <Bar options={options} data={data}></Bar>;
  }

  function getcapmdiv() {
    return (
      <>
        <div className={styles.subtitle}>
          <p>Cost Of Equity (Capm)</p>
          <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Risk Free Rate</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{treasuryrate}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Company Beta</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{stockdata[2]}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Market Premium</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div className={styles.boxrowsub}>
            <p>Expected Return(market)</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{marketreturns}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div className={styles.boxrowsub}>
            <p>Risk Free Rate</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{treasuryrate}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Capm</p>
          </div>

          <div className={styles.boxrowval}>
            <div id={styles.capm}>
              <p>{Capm}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  function discountratediv() {
    return (
      <>
        <div className={styles.subtitle}>
          <p>Discount Rate (WACC)</p>
          <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Weight of equity</p>
          </div>
          <div className={styles.boxrowval}>
            <p>
              {(1 - keyinformation[1].value / keyinformation[0].value).toFixed(
                3
              )}
            </p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Weight of Debt</p>
          </div>
          <div className={styles.boxrowval}>
            <p>
              {(keyinformation[1].value / keyinformation[0].value).toFixed(3)}
            </p>
          </div>
        </div>

        <div className={styles.boxrow}>
          <div>
            <p>Cost of Debt</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{costofdebt}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Cost of Equity</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{Capm}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>WACC</p>
          </div>
          <div className={styles.boxrowval}>
            <div id={styles.wacc}>
              <p>{discountrate}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Function to calculate intrinsic value based on financial projections
  function getintrinsicvalue() {
    // Project values for a specified number of years
    const projvalue = projectionarr(parseInt(fcf[fcf.length - 1]), gr, 5);

    // Discount the projected values to get the present value
    let discountedprojvalue = projvalue.map((elem, index) =>
      parseFloat(
        (elem / Math.pow(1 + parseFloat(discountrate), index + 1)).toFixed(2)
      )
    );

    // Calculate short term present value by summing discounted projected values
    let shorttermpv = 0;
    discountedprojvalue.map((elem) => {
      shorttermpv += elem;
    });
    shorttermpv = shorttermpv.toFixed(2);

    // Calculate long term present value using the Gordon Growth Model
    const longterm = (
      (discountedprojvalue[discountedprojvalue.length - 1] * (1 + ltg / 100)) /
      (discountrate - ltg / 100)
    ).toFixed(2);

    // Calculate terminal value by summing short term and long term present values
    const terminalval = (
      parseFloat(longterm) + parseFloat(shorttermpv)
    ).toFixed(2);

    // Calculate Enterprise Value by subtracting debts and excess cash from terminal value
    const Enterpriseval =
      terminalval - keyinformation[1].value + keyinformation[2].value;

    // Update intrinsic value in the state if it has not been updated before
    if (!intrinsicValUpdated.current) {
      setintrinsicvalue(
        ((Enterpriseval * 1000) / parseInt(stockdata[1])).toFixed(2)
      );
      intrinsicValUpdated.current = true;
    }

    // Render the intrinsic value components
    return (
      <>
        <div className={styles.subtitle}>
          <p>Intrinsic Value</p>
          <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Short Term Forecast </p>
          </div>
          <div className={styles.boxrowval}>
            <p>{shorttermpv}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Long Term Forecast </p>
          </div>
          <div className={styles.boxrowval}>
            <p>{longterm}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Terminal Value </p>
          </div>
          <div className={styles.boxrowval}>
            <div id={styles.wacc}>
              <p>{terminalval}</p>
            </div>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Excess Cash</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{keyinformation[2].value}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Debts</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{keyinformation[1].value}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Enterprise Value</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{Enterpriseval}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p> Value per Share</p>
          </div>
          <div className={styles.boxrowval}>
            <p>
              {((Enterpriseval * 1000) / parseInt(stockdata[1])).toFixed(2)}
            </p>
          </div>
        </div>
      </>
    );
  }

  // Function to calculate market value based on market capitalization and financial information
  function getmarketvalue() {
    // Calculate market value by subtracting debts from market cap and adding excess cash
    let mv = (
      parseFloat(marketcap) +
      parseFloat(keyinformation[2].value) -
      parseFloat(keyinformation[1].value)
    ).toFixed(3);

    // Update market value in the state if it has not been updated before
    if (!marketvalUpdated.current) {
      setmarketValue((mv / parseInt(stockdata[1])).toFixed(2) * 1000);
      marketvalUpdated.current = true;

    }


    // Render the market value components
    return (
      <>
        <div className={styles.subtitle}>
          <p>Market Value</p>
          <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Market Cap</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{marketcap}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Excess Cash</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{keyinformation[2].value}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p>Debts</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{keyinformation[1].value}</p>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p> Market Value</p>
          </div>
          <div className={styles.boxrowval}>
            <div id={styles.wacc}>
              <p>{mv}</p>
            </div>
          </div>
        </div>
        <div className={styles.boxrow}>
          <div>
            <p> Market Value per share</p>
          </div>
          <div className={styles.boxrowval}>
            <p>{(mv / parseInt(stockdata[1])).toFixed(3) * 1000}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header></Header>
      <div className="content">
        <div className={styles.container}>
          {loading ? (
            <div className={"spinner"}> </div>
          ) : (
            <>
              {keyinfohelpstate ? keyinfo_help(setKeyInfoHelpstate) : <></>}
              <h1 className={styles.title}>{company.name}</h1>

              <div className={styles.dcfmain}>
                <div className={styles.left}>
                  <div id={styles.keyinfo} className={styles.section}>
                    {getkeyinfodiv(keyinformation, stockdata)}
                  </div>
                  <div className={styles.section} id={styles.barchart}>
                    {BarChart()}
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.section}>{getcftable(cashFlows)}</div>
                  <div className={styles.section}>{getprojections()}</div>
                  <div className={styles.sharedsection}>
                    <div className={styles.subsection}>{discountratediv()}</div>
                    <div className={styles.subsection}>{getcapmdiv()}</div>
                  </div>
                </div>
              </div>
              <div
                className={styles.section}
                >

                {linechart(gr, fcf)}
              </div>
              <div className={styles.finalvalues}>
                <div className={styles.fvvalues} id={styles.mv}>
                  {getmarketvalue()}
                </div>
                <div className={styles.fvvalues} id={styles.vb}>
                  {verticalbar()}
                </div>
                <div className={styles.fvvalues} id={styles.iv}>
                  {getintrinsicvalue()}
                </div>
              </div>
            </>
          )}
        </div>{" "}
      </div>
    </>
  );
}