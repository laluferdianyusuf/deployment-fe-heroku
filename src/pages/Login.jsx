import React, { useRef, useState } from "react";
import {
  Form,
  Container,
  Button,
  Alert,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./All.css";

export default function Login() {
  const navigate = useNavigate();
  const emailField = useRef("");
  const passwordField = useRef("");

  const buttonPrimary = {
    backgroundColor: "rgb(10, 2, 77)",
    borderRadius: "0px",
  };

  const buttonBorder = {
    border: "1px solid darkblue",
    borderRadius: "0px",
  };

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      const userToLoginPayload = {
        email: emailField.current.value,
        password: passwordField.current.value,
      };

      const loginRequest = await axios.post(
        "https://api-instagram-be.herokuapp.com/auth/login",
        userToLoginPayload
      );

      const loginResponse = loginRequest.data;

      if (loginResponse.status) {
        localStorage.setItem("token", loginResponse.data.token);

        navigate("/");
      }
    } catch (err) {
      console.log(err);
      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  const onLoginGoogleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    try {
      const userToLoginPayload = {
        google_credential: credentialResponse.credential,
      };

      const loginGoogleRequest = await axios.post(
        "https://api-instagram-be.herokuapp.com/auth/login-google",
        userToLoginPayload
      );

      const loginGoogleResponse = loginGoogleRequest.data;

      if (loginGoogleResponse.status) {
        localStorage.setItem("token", loginGoogleResponse.data.token);

        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={onLogin}>
        <div className="user-box">
          <input type="text" ref={emailField} name="" required="" />
          <label>Email</label>
        </div>

        <div className="user-box">
          <input type="password" ref={emailField} name="" required="" />
          <label>Password</label>
        </div>

        <p className="text-warning">
          Don't have any account ?{" "}
          <Link to="/register" className="text-decoration-none text-danger">
            Sign up
          </Link>
        </p>
        {errorResponse.isError && (
          <Alert variant="danger">{errorResponse.message}</Alert>
        )}

        <div className="d-flex gap-1">
          <Button className="button-submit" type="submit">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Log in
          </Button>

          <div style={{ marginTop: "40px" }}>
            <GoogleOAuthProvider clientId="615245282222-8tpns87f4toeomvcftf7h0rs2b3kbcui.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={onLoginGoogleSuccess}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </form>
    </div>
  );
}
