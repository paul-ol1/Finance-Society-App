import React, { useState, useEffect } from "react";
import Header from "./Header";
import Image from "next/image";
import homepageimage from "/public/img/homeimage.jpg";
import Home from "./Home";
import Landing from "./Landing";
import Feed from "./Feed";

function Index() {

  return(
    <div id="main">
          <Landing/>
    </div>
  );
}

export default Index;
