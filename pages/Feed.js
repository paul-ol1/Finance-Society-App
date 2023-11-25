import React, { useState, useEffect } from "react";
import activities from "/public/img/activities.png";
import conference from "/public/img/Conference.png";
import meeting from "/public/img/Meeting.jpeg";
import Image from "next/image";
import Header from "./Header";
import styles from "../styles/feed.module.css";

function GenImage(type){
    if(type == "meeting"){
        return <Image src={meeting} alt="meeting" />;
    }
    else if (type =="seminar"){
        return <Image src={conference} alt="conference" />;
    }
    else if (type=="activity"){
        return (
          <Image src={activities} alt="activity"  />
        );
    }
}
function Eventsbox() {
  const events = [
    {
      name: "Finance Society Meeting",
      date: ["Nov","1"],
      location: "Online (Zoom)",
      type: "meeting",
      time:"1pm-3pm",
      description:
        "Join us for our monthly Finance Society Meeting where we'll discuss the latest financial trends and investment strategies.",
    },
    {
      name: "Webinar: Investment Strategies",
      date: ["Nov","15"],
      location: "Virtual Event",
      time: "7pm - 8pm",
      type: "seminar",
      description:
        "Don't miss our exclusive webinar on Investment Strategies, featuring expert speakers and practical insights.",
    },
    {
      name: "Stock Market Workshop",
      date: ["Nov","30"],
      location: "Finance Society Office",
      type: "activity",
      time: "7pm - 8pm",
      description:
        "Learn the fundamentals of stock market trading and analysis at our Stock Market Workshop.",
    },
  ];
  return events.map((items) => {
    return (
      <div className={styles.events_container} key={items.name}>
        <div className="date">
          <h3>{items.date[0]}</h3>
          <h1>{items.date[1]}</h1>
        </div>
        <div className="image">{GenImage(items.type)}</div>
        <div className={styles.events_details}>
          <h2>{items.name}</h2>
          <p>{items.location}</p>
          <p>{items.time}</p>
          <br />
          <p>{items.description}</p>
        </div>
      </div>
    );
  });
}

function Feed(){
    return (
      <>
        <Header />
        <div>
          <div className="eventsboxes">
            <h2> Upcoming Events</h2>
            <Eventsbox />
          </div>
        </div>
      </>
    );
}

export default Feed;
