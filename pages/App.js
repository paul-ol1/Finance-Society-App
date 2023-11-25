import "./App.css";
import Header from "./Header";
import Home from "./Home.js";
import React,{useState} from "react";
import UserHistory from "./History";
import { SignUp, Login } from "./Signup";



function App () {
  const [showSignUp, setShowSignUp] = useState(false);
  const switchToSignUp = () => {
    setShowSignUp(true);
  };
  return (
    <div id="main">
      {showSignUp ? (
        <SignUp />
      ) : (
        <>
          <Header />
          <Home onGetStartedClick={switchToSignUp} />
        </>
      )}
    </div>
  );
}

export default App;
