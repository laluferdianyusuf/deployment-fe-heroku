import React, { useRef, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import "./All.css";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { RiFacebookCircleLine } from "react-icons/ri";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const emailField = useRef("");
  const passwordField = useRef("");

  const responseFacebook = (response) => {
    console.log(response);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
        setLoading(!loading);
      }
    } catch (err) {
      const response = err.response.data;
      console.log(response);

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
      <h2 className="fw-bold">Sign In</h2>
      <form onSubmit={onLogin}>
        <div className="user-box">
          <input type="text" ref={emailField} required />
          <label>Email</label>
        </div>

        <div className="user-box d-flex position-relative">
          <input
            type={showPassword ? "text" : "password"}
            ref={passwordField}
            required
          />
          <Button
            onClick={handleShowPassword}
            className="position-absolute button-show-password p-0"
            style={{
              right: "0",
              top: "15%",
              backgroundColor: "transparent",
              border: "transparent",
              boxShadow: "0 0 0 0 transparent",
            }}
          >
            {showPassword ? (
              <HiOutlineEyeOff size={20} color="red" title="hide" />
            ) : (
              <HiOutlineEye size={20} title="show" />
            )}
          </Button>
          <label>Password</label>
        </div>

        <p className="text-secondary">
          Don't have any account ?{" "}
          <Link to="/register" className="text-decoration-none">
            Sign up
          </Link>
        </p>
        {errorResponse.isError && (
          <Alert variant="danger">{errorResponse.message}</Alert>
        )}

        <div className="d-flex gap-2 option-login justify-content-between">
          <Button className="button-submit" type="submit">
            {/* <span></span>
            <span></span>
            <span></span>
            <span></span> */}
            Login
          </Button>

          <div
            className="d-flex gap-1 authentication"
            style={{ marginTop: "45px" }}
          >
            <GoogleOAuthProvider clientId="615245282222-8tpns87f4toeomvcftf7h0rs2b3kbcui.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={onLoginGoogleSuccess}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>

            <FacebookLogin
              appId="1088597931155576"
              autoLoad={true}
              fields="name,email,picture"
              icon={<RiFacebookCircleLine size={25} color="blue" />}
              textButton=""
              // onClick={componentClicked}
              callback={responseFacebook}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
