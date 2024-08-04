import React from "react";
import NavigationBar from "./NavigationBar";

function Home(){
  return (
    <div className="home-page">
      <NavigationBar />
      <h1>Welcome to our Super Cool Shopping App</h1>
      <p>Where prices are fair and inflation hasn't hit us yet! You are welcome</p>
    </div>
  )
}

export default Home;