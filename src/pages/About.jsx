import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import React, { useState } from "react";
import { Button } from "react-bootstrap";

function About() {
  const userRedux = useSelector(selectUser);
  const [user, setUser] = useState(userRedux.creds);

  return (
    <div>
      <p>Halo, {user.name}. Welcome to About page.</p>
      <Button variant="outline-warning">
        <Link to="/" className="text-decoration-none text-black">
          Go to home page
        </Link>
      </Button>
    </div>
  );
}

export default About;
