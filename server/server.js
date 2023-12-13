const express = require("express"); //Set up the express module
const app = express();
const { promisify } = require("util");
const execAsync = promisify(require("child_process").exec);
const port = 8080;
let SandP500Json;
const fs = require("fs");
const path = require("path"); // bring in the path module to help locate files
const sqlite3 = require("sqlite3").verbose(); // pulls the sql module
const bodyParser = require("body-parser"); // this pulls in body-parser
const { all } = require("proxy-addr");
const regex = /^[Aa]\d+@aup\.edu/;
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.json()); // this tells the server to look for JSON requests
const cors = require("cors"); // Import the cors middleware
const { elements } = require("chart.js");

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Replace with the origin of your React or Next.js app

// Calls the existing database
let userdatabase = new sqlite3.Database("users.db", function (error) {
  if (error) {
    console.error(err.message);
    return {};
  }
});
let companiesdatabase = new sqlite3.Database("companies.db", function (error) {
  if (error) {
    console.log(error.message);
    return {};
  }
});


// Route to retrieve key financial information
app.post("/api/keyinfo", async function (req, res) {
  const ticker = req.body.symbol;
  const [bs, is] = await Promise.all([getbs(ticker), getis(ticker)]);

  // Parse JSON and handle 'NaN' values
  bs[0].accounts = JSON.parse(bs[0].accounts);
  bs[0].values = JSON.parse(bs[0].values.replaceAll("NaN", "null"));
  is[0].accounts = JSON.parse(is[0].accounts);
  is[0].values = JSON.parse(is[0].values.replaceAll("NaN", "null"));

  // Array to store key information
  let keyInfo = [];

  // Extract key financial metrics and convert values to thousands
  keyInfo.push({
    name: "Total Assets",
    value: bs[0].values[bs[0].accounts.indexOf("Total Assets")] / 1000,
  });
  keyInfo.push({
    name: "Total Debt",
    value: bs[0].values[bs[0].accounts.indexOf("Total Debt")] / 1000,
  });
  keyInfo.push({
    name: "Excess Cash",
    value:
      bs[0].values[bs[0].accounts.indexOf("Cash And Cash Equivalents")] / 1000,
  });
  keyInfo.push({
    name: "Interest Expense",
    value: is[0].values[is[0].accounts.indexOf("Interest Expense")] / 1000,
  });

  // Check for valid Tax Rate and calculate Income Tax Rate
  let taxrateindex = is[0].accounts.indexOf("Tax Rate For Calcs");
  if (is[0].values[taxrateindex] > 0) {
    keyInfo.push({
      name: "Income Tax Rate",
      value: is[0].values[taxrateindex].toFixed(2),
    });
  } else {
    let ebit = is[0].values[is[0].accounts.indexOf("EBIT")];
    let taxprov = is[0].values[is[0].accounts.indexOf("Tax Provision")];
    let taxrate = Math.abs(taxprov / ebit);

    // Check for valid Tax Rate and push to keyInfo array
    if (taxrate) {
      keyInfo.push({ name: "Income Tax Rate", value: taxrate.toFixed(2) });
    } else {
      keyInfo.push({
        name: "Income Tax Rate",
        value: 0,
      });
    }
  }
  res.send(keyInfo);
});

// Route to retrieve cash flow statement data
app.post("/api/cfs", async function (req, res) {
  const ticker = req.body.symbol;
  const cf = await getallcashflows(ticker);

  // Array to store preprocessed and processed cash flow data
  let preprocessedcf = [];
  let processedcf = [];

  // Parse JSON and handle 'NaN' values
  cf.map((element) => {
    let newobj = { date: "", accounts: [], values: [] };
    newobj.date = element.date;
    newobj.accounts = JSON.parse(element.accounts);
    newobj.values = JSON.parse(element.values.replaceAll("NaN", "null"));
    preprocessedcf.push(newobj);
  });

  // Map preprocessed data to processed data with selected accounts and converted values to thousands
  preprocessedcf.map((elem) => {
    let newobj = {
      date: "",
      accounts: [
        "Operating Cash Flow",
        "Purchase Of PPE",
        "Purchase Of Intangibles",
        "Free Cash Flow",
        "Capital Expenditure",
        "End Cash Position",
      ],
      values: [0, 0, 0, 0, 0, 0],
      index: [],
    };

    // Map selected accounts and values to newobj
    elem.accounts.forEach((val) => {
      if (val == "Operating Cash Flow") {
        newobj.index.push(0);
        newobj.values[0] = elem.values[elem.accounts.indexOf(val)] / 1000;
      }
      if (val == "Purchase Of PPE") {
        newobj.index.push(1);
        newobj.values[1] = elem.values[elem.accounts.indexOf(val)] / 1000;
      }
      if (val == "Purchase Of Intangibles") {
        newobj.index.push(2);
        newobj.values[2] = elem.values[elem.accounts.indexOf(val)] / 1000;
      }
      if (val == "Free Cash Flow") {
        newobj.index.push(3);
        newobj.values[3] = elem.values[elem.accounts.indexOf(val)] / 1000;
      }
      if (val == "Capital Expenditure") {
        newobj.index.push(4);
        newobj.values[4] = elem.values[elem.accounts.indexOf(val)] / 1000;
      }
      if (val == "End Cash Position") {
        newobj.index.push(5);
        newobj.values[5] = elem.values[elem.accounts.indexOf(val)] / 1000;
      }
    });

    // Check if newobj has valid accounts, then add to processedcf array
    if (newobj.accounts.length > 0) {
      newobj.date = "20".concat(elem.date);
      processedcf.push(newobj);
    }
  });

  // Send the sorted processedcf array as the response
  res.send(processedcf);
});

// Get company dividends
app.post("/api/dividends", async function(req,res){
  let symbol = req.body.symbol;
  let data = await getDividendsData(symbol);
  res.send(data);
})

app.post("/api/getsd", function (req, res) {
  let symbol = req.body.symbol;

  execAsync(`python3 getprice.py ${symbol}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`node error: ${error}`);
      console.error(`python error: ${stderr}`);
      res.status(500).send("Internal Server Error");
    } else {
      let data = stdout.trim().split(" ");
      res.send(data);
    }
  });
});
app.post("/api/othersd", function (req, res) {
  let symbol = req.body.symbol;

  execAsync(`python3 riskreturn.py ${symbol}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`node error: ${error}`);
      console.error(`python error: ${stderr}`);
      res.status(500).send("Internal Server Error");
    } else {
      let data = stdout.trim().split(" ");
      console.log(data)
      res.send(data);
    }
  });
});

app.get("/api/getmr", async function (req, res) {
  await getmarket(res);
});
app.get("/api/gettr", async function (req, res) {
  await gettreasury(res);
});
app.get("/api/companies", async function (req, res) {
  async function onetime() {
    let x = await getallcomps();
    x.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    const wordToRemove = "Common Stock";

    // Map over the array and remove the specified word from the 'name' property
    x.map((obj) => {
      if (obj.name.includes(wordToRemove)) {
        obj.Name = obj.name.replace(wordToRemove, "").trim();
      }
      return obj;
    });
    res.send(x);
  }
  onetime();
});

app.post("/api/log-in", async function (req, res) {
  let password = req.body.ps;
  let email = req.body.em;

  const sql = "SELECT * FROM users WHERE Email = ? AND Password = ?";

  if (regex.test(email)) {
    try {
      const user = await confirmaccount(sql, [email, password]);
      if (user) {
        // User found, send a success response and set the cookie
        await createcookie(email, res).then(async (id) => {
          await createportfoliocookie(id,res);
          res.status(200).json({ message: "Logged in successfully" });
        }); // Set the cookie first
        //
      } else {
        // User not found, send an error response
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (err) {
      console.log(err);
      // Handle database errors
      res.status(500).json({ error: "Server error" });
    }
  } else {
    // Invalid email format, send a response
    res.status(406).json({ error: "Invalid Email Format!" });
  }
});

app.post("/api/newaccount", async function (req, res) {
  let firstname = req.body.fn;
  let lastname = req.body.ln;
  let password = req.body.ps;
  let email = req.body.em;
  if (regex.test(email)) {
    try {
      await createacctAsyncfunc(
        "INSERT INTO Users (Email,Fname,Lname,Password) VALUES (?,?,?,?)",
        [email, firstname, lastname, password]
      );
      // Set the cookie first and then send the response
      await createcookie(email, res).then(() => {
        res
          .status(200)
          .json({ message: "Account created and logged in successfully" });
      }); // Set the cookie first
      //res.status(201).json({ message: "Data inserted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Account already exists" });
    }
  } else {
    res.status(406).json({ error: "Wrong Email format" });
  }
});

//create new portfolio and send cookie for it

app.post("/api/createportfolio", async function (req, res) {
  const id = req.body.id;
  const date = req.body.date;
  try {
    createacctAsyncfunc(
      "INSERT INTO Portfolio(UserID,creation_date) VALUES(?,?)",
      [id, date]
    );
    await createportfoliocookie(id,res).then(()=>{
      res.status(200).json('portflio created')
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "portfolio already exists" });
  }
});

app.post("/api/insertintoportfolio", async function (req, res) {
  const query = req.body.sqlquery;
  const values = req.body.values;
  console.log(query)
  try {
    createacctAsyncfunc(query,values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "elem not added" });
  }
});

 app.post("/api/getportfoliodata", async function (req, res) {
   const id = req.body.id;
   const data = await getallportfoliodata(id);
   res.json(data);

 });


// This code return jpg images, html, css, and js files
// The first parameter is an array of file extensions to match
app.get(
  ["/*.jpg", "/*.css", "/*.html", "/*.js", "/*.png"],
  function (req, res) {
    res.sendFile(path.join(__dirname, req.path)); // req.path is the path of the requested file
  }
);

// Start listening for requests on the designated port
// This can be at the beginning, or the end, or in-between.
// Conventionally it is put at the end
let server = app.listen(port, function () {
  console.log("App server is running on port", port);
  console.log("to end press Ctrl + C");
});

function createacctAsyncfunc(sql, params) {
  return new Promise((resolve, reject) => {
    userdatabase.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function confirmaccount(sql, params) {
  return new Promise((resolve, reject) => {
    userdatabase.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getuserdata(email) {
  const sql = "SELECT * FROM users WHERE Email = ?";
  return new Promise((resolve, reject) => {
    userdatabase.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function getallcomps() {
  return new Promise((resolve, reject) => {
    companiesdatabase.all("SELECT * from Companies", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function getallcashflows(symbol) {
  return new Promise((resolve, reject) => {
    companiesdatabase.all(
      'SELECT FinancialStatement.date, FinancialStatement.accounts, FinancialStatement."values" FROM Companies INNER JOIN FinancialStatement ON Companies.company_id = FinancialStatement.company_id WHERE symbol = ? and type= ? ORDER BY FinancialStatement.date ASC',
      [symbol, "Cashflow"],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

async function getbs(symbol) {
  return new Promise((resolve, reject) => {
    companiesdatabase.all(
      'SELECT FinancialStatement.date,FinancialStatement.accounts, FinancialStatement."values" FROM Companies INNER JOIN FinancialStatement ON Companies.company_id = FinancialStatement.company_id WHERE symbol = ? AND type=? ORDER BY FinancialStatement.date DESC LIMIT ?',
      [symbol, "Balance Sheet", 1],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}
async function getis(symbol) {
  return new Promise((resolve, reject) => {
    companiesdatabase.all(
      'SELECT FinancialStatement.date,FinancialStatement.accounts, FinancialStatement."values" FROM Companies INNER JOIN FinancialStatement ON Companies.company_id = FinancialStatement.company_id WHERE symbol = ? AND type=? ORDER BY FinancialStatement.date DESC LIMIT ?',
      [symbol, "Income Statement", 1],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}
async function getDividendsData(symbol){
  return new Promise((resolve,reject)=>{
    companiesdatabase.all(
      "SELECT Dividends.date,Dividends.amount FROM Companies INNER JOIN Dividends on Companies.company_id = Dividends.company_id WHERE symbol = ? ORDER BY DATE(Dividends.date) ASC",
      [symbol],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );

  })

}

async function gettreasury(res) {
  try {
    const { stdout, stderr } = await execAsync("python3 gettreasury.py");
    res.send(stdout);
  } catch (error) {
    console.error(`node error: ${error}`);
    console.error(`python error: ${error.stderr}`);
    res.status(500).send("Internal Server Error");
  }
}

async function getmarket(res) {
  try {
    const { stdout, stderr } = await execAsync("python3 marketreturn.py");
    res.send(stdout);
  } catch (error) {
    console.error(`node error: ${error}`);
    console.error(`python error: ${error.stderr}`);
    res.status(500).send("Internal Server Error");
  }
}

async function createcookie(email, res) {
  try {
    const user = await getuserdata(email);
    if (user) {
      const userCookie = {
        firstname: user.Fname,
        lastname: user.Lname,
        ID: user.UserID,
      };

      res.cookie("Userdetails", JSON.stringify(userCookie))
      return user.UserID;
    }
  } catch (err) {
    console.error(err);
    // Handle any error that occurs when retrieving user data
  }

}

function getportfoliodata(id) {
  const sql = "SELECT PortfolioID FROM Portfolio WHERE UserID = ?";
  return new Promise((resolve, reject) => {
    userdatabase.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
function getallportfoliodata(id){
  const sql =
    "SELECT PortfolioEntry.AssetType, PortfolioEntry.Symbol, PortfolioEntry.BuyPrice, PortfolioEntry.Quantity,PortfolioEntry.Action, PortfolioEntry.PurchaseDate, PortfolioEntry.Status FROM Portfolio INNER JOIN PortfolioEntry ON Portfolio.PortfolioID = PortfolioEntry.PortfolioID WHERE UserID = ?";
    return new Promise((resolve, reject) => {
      userdatabase.all(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
}

async function createportfoliocookie(id,res){
  let portfolioid = await getportfoliodata(id);
  if(portfolioid){
    const cookieData = {
      id : portfolioid.PortfolioID,
    }
    res.cookie('Portfolio',JSON.stringify(cookieData));
  }
}