import Calc from "./calculator.png";
import Cal from "./calender.png";
import Fx from "./fx.png";
import React, { Component } from "react";

function CreateBox({data}){
    return (
      <div className="box">
        <h3>{data.companyName}</h3>
        <div className="box-row">
          <img src={Fx} alt="" />
          <p>{data.Fx}</p>
        </div>
        <div className="box-row">
          <img src={Calc} alt="" />
          <p>{data.Answer}</p>
        </div>
        <div className="box-row">
          <img src={Cal} alt="" />
          <p>{data.Date}</p>
        </div>
      </div>
    );
}
class UserHistory extends Component{
    constructor(){
        super();
        this.state = {
          history: [
            {
              companyName: "Tesla",
              Fx: "Wacc",
              Answer: "7%",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "Capm",
              Answer: "5%",
              Date: "2023-10-30",
            },
            {
              companyName: "Apple",
              Fx: "Wacc",
              Answer: "7%",
              Date: "2023-10-30",
            },
            {
              companyName: "Activision Blizzard",
              Fx: "ggm",
              Answer: "$75",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
            {
              companyName: "Tesla",
              Fx: "proforma",
              Answer: "$700000000",
              Date: "2023-10-30",
            },
          ],
        };
    }

    render(){
        return (
          
          <div className="UHcontent">
            {this.state.history.map((item, key) => {

              return <CreateBox data={item} key={key} />;
            })}
          </div>
        );
    }
}

export default UserHistory;