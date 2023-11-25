import React, { useEffect, useState } from "react";

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

async function createOptions() {
  try {
    let companies = await getCompanies();
    return companies.map((company) => (
      <option key={company.Symbol} value={company.Name}></option>
    ));
  } catch (error) {
    console.error("Error creating divs:", error);
    throw error;
  }
}

function DDM() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const generatedOptions = await createOptions();
        setOptions(generatedOptions);
      } catch (error) {
        console.error("Error setting optiond:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>DDM</h1>
      <input list="complist" id="complist-choice" name="complist-choice" />
      <datalist id="complist">{options}</datalist>
    </div>
  );
}

export default DDM;
