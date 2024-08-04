import React from "react";
import { Link } from "react-router-dom";

function NotFound(){
  return (
    <div className="not-found">
      <h2>404 - Not found</h2>
      <p>Sorry, the page you are looking for does not exist</p>
      <p>
        You can always go back to the <Link to="/">homepage</Link>
      </p>
    </div>
  )
}

export default NotFound;