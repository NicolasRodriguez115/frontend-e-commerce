import React from "react";
import NavigationBar from "./NavigationBar";

function Home() {
  return (
    <div className="home-page">
      <NavigationBar />
      <div className="welcome-message">
      <h1>Welcome to Geek Nexus</h1>
      <p>
        Your hub for games, manga and comics
      </p>

      </div>
    </div>
  );
}

export default Home;
