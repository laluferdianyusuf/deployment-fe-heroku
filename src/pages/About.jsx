import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function About() {
  const userRedux = useSelector(selectUser);
  const [user, setUser] = useState(userRedux.creds);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingContent(false);
    }, 2000);
  }, []);

  return (
    <div>
      <p>
        Halo, {loadingContent ? <Skeleton /> : user.name} Welcome to About page.{" "}
      </p>
      <Button variant="outline-warning">
        <Link to="/" className="text-decoration-none text-black">
          Go to home page
        </Link>
      </Button>
    </div>
  );
}

export default About;
