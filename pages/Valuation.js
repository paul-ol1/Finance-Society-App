import React,{useEffect,useState,useRef} from "react";
import Header from "./Header";
import indicator from "/public/img/indicator.png";
import Image from "next/image";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { getCookie } from "./checkcookie";
import { useRouter } from "next/router";
import styles from "styles/valuation.module.css";

function Valuation() {
const router = useRouter();
const [guide,setGuide]= useState(false);
const ddmref = useRef(null);
const dcfref = useRef(null);
  useEffect(() => {
    // Check the cookie and conditionally navigate to another page
    if (!getCookie("Userdetails")) {
      // The cookie is true, so navigate to the "home" page
      router.push("/"); // Update the path to your home page
    } else {
      // Use KaTeX to render the formula
      const ggmformula = "P_0 = \\frac{D_1}{r - g}";
      const ggmhtml = katex.renderToString(ggmformula, { displayMode: true });
      let formulaDiv = document.getElementById("ggmformula");
      formulaDiv.innerHTML = ggmhtml;

      const fcfformula = "FCF = \\ Operating  CashFlow - Capital  Expenditure"
      const fcfformulahtml = katex.renderToString(fcfformula, {
        displayMode: true,
      });
      let fcfDiv = document.getElementById("fcfformula");
      fcfDiv.innerHTML = fcfformulahtml;
      const costofdebtformula= "C_d = \\frac{i}{D} "
      const costofdebthtml = katex.renderToString(costofdebtformula,{displayMode:true});
      let costofdebtDiv = document.getElementById("cdformula");
      costofdebtDiv.innerHTML = costofdebthtml;
      const costofequityformula = "C_e = \\ R_f + β (R_m - R_f)";
      const costofequityhtml = katex.renderToString(costofequityformula,{displayMode:true});
      let costofequityDiv = document.getElementById("ceformula");
      costofequityDiv.innerHTML = costofequityhtml;

      const tsggmformula =
        "P_0 = \\frac{D_0 \\times (1 + g_1)}{r - g_1} + \\frac{D_n \\times (1 + g_2)}{(r - g_2) \\times (1 + r)^n}";
      const tsggmhtml = katex.renderToString(tsggmformula, {
        displayMode: true,
      });

      formulaDiv = document.getElementById("tsggmformula");
      formulaDiv.innerHTML = tsggmhtml;
    }
    const waccformulaDiv = document.getElementById("waccformula");
    const waccFormula = `WACC = \\frac{E}{V} \\times C_e + \\frac{D}{V} \\times C_d \\times (1 - T_r)`;
    const waccHtml = katex.renderToString(waccFormula, {
      displayMode: true,
    });
    waccformulaDiv.innerHTML = waccHtml;
  }, [router]);

  return (
    <>
      <Header />
      <div className="content">
        <div className={styles.guide}>
          <Image src={indicator} onClick={() => { setGuide(!guide)}}></Image>
          {guide?(
            <>
            <p onClick={()=>{dcfref.current.scrollIntoView({ behavior: "smooth"})}}>DCF</p>
          <p onClick={()=>{ddmref.current.scrollIntoView({ behavior: "smooth" });}}>DDM</p></>
          ):<></>}
        </div>
        <div className="Valuation">
          <h1>Valuation</h1>
          <div>
            <p>
              Valuation is a financial process that involves determining the
              intrinsic or market value of an asset, investment, company, or
              financial security. It is a crucial practice used in various
              fields, including finance, accounting, and investment, to assess
              the worth of an entity or an investment opportunity. The
              importance of valuation cannot be overstated, as it serves several
              vital purposes. Firstly, valuation helps individuals and
              organizations make informed financial decisions, such as buying or
              selling assets and making investment choices. Secondly, it plays a
              pivotal role in financial reporting and accounting by providing
              accurate figures for balance sheets and income statements.
              Additionally, valuation aids in assessing the financial health of
              a business, making it an indispensable tool for investors,
              creditors, and other stakeholders. Ultimately, valuation is the
              cornerstone of prudent financial management and prudent investment
              strategies, serving as a reliable means to assign a numerical
              value to assets and entities in a dynamic economic
              landscape.Fundamental valuation methods are techniques used in
              investment analysis to estimate the intrinsic value of a security
              or investment. These methods focus on evaluating the underlying
              fundamentals of an asset, such as financial statements, economic
              indicators, and market conditions. Here are some commonly used
              fundamental valuation methods:
            </p>
            <div className={styles.topic} ref={dcfref}>
              <h2>Discounted Cash Flow (DCF)</h2>
              <p>
                Discounted Cash Flow (DCF) analysis is a valuation method used
                to estimate the value of an investment based on its expected
                future cash flows. The fundamental principle behind DCF is that
                the present value of future cash flows is determined by
                discounting them back to their current value, considering the
                time value of money. DCF is widely used in finance and
                investment analysis, particularly for valuing stocks, bonds,
                real estate, and other income-generating assets.
              </p>
              <div className="subtopic">
                <h3>Key Components of DCF Analysis</h3>
                <div className="subsubtopic">
                  <h4>Free Cash Flow (FCF)</h4>
                  <p>
                    Free Cash Flow is the cash generated by a business that is
                    available for distribution to investors (both debt and
                    equity holders) after accounting for operating expenses and
                    capital expenditures.
                  </p>
                  <div id="fcfformula"></div>
                </div>
                <div className="subsubtopic">
                  <h4>Discount Rate</h4>
                  <p>
                    The discount rate represents the rate of return required by
                    an investor to justify an investment. It accounts for the
                    time value of money and the risk associated with the
                    investment.Commonly Used Discount Rates:
                  </p>
                  <ul>
                    <li>
                      Weighted Average Cost of Capital (WACC) for the entire
                      company
                    </li>
                    <li>Cost of Equity for equity-specific valuation.</li>
                    <li>Cost of Debt for debt-specific valuation.</li>
                  </ul>
                  <div id="cdformula"></div>
                  <br></br>
                  <div id="ceformula"></div>
                  <br></br>
                  <div id="waccformula"></div>
                  <br></br>
                  <p>Where:</p>
                  <ul>
                    <li>i is the annual interest expense</li>
                    <li>D is the Total Debt.</li>
                    <li>E is the total amount of Equity</li>
                    <li>A is the total amount of Assets</li>
                    <li>Rf is the riskfree rate ( Treasury Rate)</li>
                    <li>β is the Beta</li>
                    <li>Rm is the return rate on the market</li>
                    <li>T is the taxrrate</li>
                  </ul>
                </div>
                <div className="subsubtopic">
                  <h4>Terminal Value</h4>
                  <p>
                    The Terminal Value accounts for the present value of all
                    future cash flows beyond the explicit forecast period. It is
                    often calculated using the perpetuity growth model (Gordon
                    Growth Model) or an exit multiple method. Which is the
                    present Value of all Shortterm forecats + the Forecast at
                    n's value using the gordon growth model and a user defined
                    long term growth rate
                  </p>
                </div>
                <div className="subsubtopic">
                  <h4>Explicit Forecast Period</h4>
                  <p>
                    The period during which detailed cash flow projections are
                    made. Typically, this covers a few years into the future,
                    and beyond this, the Terminal Value is applied.
                  </p>
                </div>
              </div>
              <div className="subtopic">
                <h3>Steps in Conducting DCF Analysis</h3>
                <div className="subsubtopic">
                  <ol>
                    <li>
                      <p>
                        <strong>Gather Data:</strong> Collect relevant financial
                        and business data, including historical financial
                        statements, cash flow information, and any other data
                        necessary for forecasting future cash flows.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Forecast Future Cash Flows:</strong> Project
                        future cash flows based on historical data, market
                        trends, and other relevant factors. This may include
                        estimating revenues, expenses, and capital expenditures.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Determine the Discount Rate:</strong> Identify
                        an appropriate discount rate, often the Weighted Average
                        Cost of Capital (WACC), to discount future cash flows
                        back to their present value.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Calculate Present Value:</strong> Apply the
                        discount rate to each projected cash flow to calculate
                        its present value. Sum these present values to obtain
                        the total present value of future cash flows.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Estimate Terminal Value:</strong> Determine the
                        terminal value, which represents the value of the
                        business beyond the forecast period. This is often
                        calculated using the Gordon Growth Model or other
                        relevant methods.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Calculate Enterprise Value:</strong> Combine the
                        present value of forecasted cash flows and the terminal
                        value to calculate the enterprise value.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Consider Net Debt and Excess Cash:</strong>{" "}
                        Adjust the enterprise value by accounting for net debt
                        and excess cash to arrive at the equity value.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Determine Intrinsic Stock Value:</strong> Divide
                        the equity value by the number of shares outstanding to
                        calculate the intrinsic value per share.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="subtopic">
                <h3>Considerations and Challenges of DCF Analysis</h3>
                <div className="subsubtopic">
                  <ul>
                    <li>
                      <p>
                        <strong>Data Accuracy:</strong> Ensure the accuracy and
                        reliability of the data used in the analysis. Inaccurate
                        or incomplete data can lead to flawed projections.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Assumption Sensitivity:</strong> DCF analysis
                        heavily relies on assumptions. Be aware of the
                        sensitivity of results to changes in key assumptions,
                        such as growth rates and discount rates.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Market Volatility:</strong> Consider the impact
                        of market volatility on the discount rate and cash flow
                        projections. Economic and industry fluctuations can
                        influence results.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Forecasting Challenges:</strong> Forecasting
                        future cash flows accurately can be challenging.
                        External factors, unforeseen events, and changes in
                        market conditions may affect projections.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Terminal Value Assumptions:</strong> The
                        determination of terminal value involves assumptions
                        about perpetual growth rates and discount rates.
                        Scrutinize these assumptions carefully.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Debt and Equity Structure:</strong> The accurate
                        representation of a company's capital structure is
                        crucial. Ensure that debt and equity components are
                        appropriately reflected.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Comparative Analysis:</strong> Consider using
                        DCF in conjunction with other valuation methods for a
                        more comprehensive assessment. Each method has its
                        strengths and weaknesses.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="subtopic">
                <h3>Advantages of DCF Analysis</h3>
                <div className="subsubtopic">
                  <ul>
                    <li>
                      <p>
                        <strong>Future Cash Flow Focus:</strong> DCF analysis
                        focuses on estimating the future cash flows of a
                        business, providing a forward-looking perspective on its
                        valuation.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Time Value of Money:</strong> DCF recognizes the
                        time value of money by discounting future cash flows to
                        their present value, reflecting the concept that a
                        dollar today is worth more than a dollar in the future.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Comprehensive Valuation:</strong> DCF takes into
                        account the entire future cash flow stream and considers
                        the present value of both short-term and long-term cash
                        flows, providing a holistic valuation perspective.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Customizable Assumptions:</strong> DCF allows
                        for the customization of key assumptions, such as growth
                        rates and discount rates, making it adaptable to the
                        specific characteristics of the business being analyzed.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Investor-Centric:</strong> DCF is
                        investor-centric, as it helps investors evaluate the
                        intrinsic value of an investment, assisting in informed
                        decision-making regarding buying, selling, or holding
                        assets.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Risk Assessment:</strong> DCF analysis
                        inherently incorporates risk considerations by
                        discounting future cash flows at an appropriate discount
                        rate, reflecting the risk profile of the investment.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="subtopic">
                <h3>Limitations of DCF Analysis</h3>
                <div className="subsubtopic">
                  <ul>
                    <li>
                      <p>
                        <strong>Dependency on Assumptions:</strong> DCF heavily
                        relies on various assumptions, including growth rates,
                        discount rates, and terminal values, making results
                        sensitive to the accuracy of these assumptions.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Forecasting Challenges:</strong> Forecasting
                        future cash flows can be challenging, especially for
                        businesses with unpredictable cash flow patterns or
                        those operating in dynamic industries.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>
                          Difficulty in Determining Discount Rates:
                        </strong>{" "}
                        Choosing an appropriate discount rate, such as the
                        Weighted Average Cost of Capital (WACC), can be
                        subjective and may vary based on different
                        interpretations.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Ignoring Market Fluctuations:</strong> DCF
                        assumes a stable and predictable future, often
                        overlooking potential market fluctuations, economic
                        uncertainties, or external shocks that can impact cash
                        flows.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Long-Term Projections:</strong> Long-term
                        projections in DCF analysis are inherently uncertain,
                        and the accuracy of projections diminishes as the
                        forecasting period extends further into the future.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>Discount Rate Challenges:</strong> Determining
                        an appropriate discount rate for different cash flow
                        components, such as debt and equity, can be complex and
                        may lead to misrepresentations.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.topic} ref={ddmref}>
              <h2>Dividends Discount Model</h2>
              <p>
                The Dividend Discount Model (DDM) represents a specialized
                subset of valuation methodologies, primarily used for mature
                companies that have a consistent history of paying dividends to
                their shareholders. DDM is anchored in the concept that the
                intrinsic value of a company is determined by its expected
                dividend payments. The Gordon Growth Model, a prominent form of
                DDM, postulates a constant growth rate for dividends and
                formulates intrinsic value as a ratio of the most recent
                dividend payment, the required rate of return for equity
                investors (often representing the cost of capital), and the
                assumed constant growth rate of dividends. This simplicity makes
                DDM an appealing choice for companies with stable and
                predictable dividend policies, providing a direct means of
                evaluating their value. However, it is essential to recognize
                that not all companies pay dividends, especially younger and
                fast-growing firms. In such cases, the DCF model, which
                encompasses pro forma cash flow analysis and discounting, offers
                a more versatile approach to estimate intrinsic value and is
                better suited for a broader range of businesses, ensuring that
                valuation analyses can adapt to the diversity of corporate
                finance structures and practices.
              </p>
              <div className="subtopic">
                <h3>Attributes</h3>
                <ul>
                  <li>Dividends centric</li>
                  <li>Simplicity and easy to assess</li>
                  <li> Gives longterm investment perspective</li>
                  <li> Historical data reliance</li>
                </ul>
              </div>
              <div className="subtopic">
                <h3>Variations of the DDM</h3>
                <div>
                  <h4>Gordon Growth Model</h4>
                  <p>
                    DDM encompasses several variations, but the Gordon Growth
                    Model is perhaps the most well-known. It assumes a constant
                    growth rate for dividends, resulting in a concise formula
                    for intrinsic value.
                  </p>
                  <p>The Gordon Growth Model (GGM) formula is given by:</p>
                  <div id="ggmformula"></div>
                  <p>Where:</p>
                  <ul>
                    <li>
                      P0 is the current price or intrinsic value of the stock.
                    </li>
                    <li>D1 is the expected dividend in the next period.</li>
                    <li> r is the required rate of return (discount rate).</li>
                    <li> g is the constant growth rate of dividends.</li>
                  </ul>
                </div>
                <div>
                  <h4>Two-Stage Gordon Growth Model (Two-Stage GGM)</h4>
                  <p>
                    The Two-Stage GGM recognizes that a company's dividend
                    growth rate may not remain constant indefinitely. This model
                    is suitable for companies experiencing a period of high
                    growth followed by a more stable phase. It incorporates two
                    different growth rates: a high-growth phase (usually for a
                    limited number of years) and a stable-growth phase. The
                    formula for the Two-Stage GGM is as follows:
                  </p>
                  <div id="tsggmformula"></div>
                  <p>Where:</p>
                  <ul>
                    <li>
                      P0 is the current price or intrinsic value of the stock.
                    </li>
                    <li>D0 is the most recent dividend payment.</li>
                    <li>g1 is the high growth rate for the initial period.</li>
                    <li>
                      Dn is the dividend at the end of the high-growth phase.
                    </li>
                    <li>r is the required rate of return (discount rate).</li>
                    <li>g2 is the stable growth rate for the second period.</li>
                    <li>n is the duration of the high-growth phase.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Valuation;
