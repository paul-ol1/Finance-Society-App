import React, { useEffect, useState } from "react";

async function Companieslist() {
    const [data, setData] = useState();
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/companies");
          const result = await response.json().then(

            );
            setData(result);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();

    }, []); // Empty dependency array ensures that this effect runs once on component mount
     return data;
}

export default Companieslist;
