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
import loginImage from "../images/key.png";

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
        "http://localhost:2000/auth/login",
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
        "http://localhost:2000/auth/login-google",
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
    <Card className="w-50 text-black" style={{ margin: "6% 25%" }}>
      <Container className="my-5">
        <Row className="justify-content-md-center">
          <h1 className="mb-3 text-center">Sign In</h1>
          <Col md={7}>
            <Form onSubmit={onLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  ref={emailField}
                  placeholder="Email"
                  style={buttonBorder}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  style={buttonBorder}
                  type="password"
                  ref={passwordField}
                  placeholder="Password"
                />
              </Form.Group>
              <p>
                Don't have any account ?{" "}
                <Link to="/register" className="text-decoration-none">
                  Sign up
                </Link>
              </p>
              {errorResponse.isError && (
                <Alert variant="danger">{errorResponse.message}</Alert>
              )}
              <div className="text-center d-flex">
                <Button
                  className="w-50 text-center me-3"
                  style={buttonPrimary}
                  type="submit"
                >
                  Log in
                </Button>

                <GoogleOAuthProvider clientId="615245282222-8tpns87f4toeomvcftf7h0rs2b3kbcui.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={onLoginGoogleSuccess}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
            </Form>
          </Col>
          <Col md={4}>
            <img
              src={loginImage}
              className="w-100"
              style={{ margin: "20% 25% 0 10px" }}
              alt=""
            />
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
