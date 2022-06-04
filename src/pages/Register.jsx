import React, { useRef, useState } from "react";
import {
  Form,
  Container,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import regisImage from "../images/airplane.png";

export default function Register() {
  const navigate = useNavigate();

  const nameField = useRef("");
  const emailField = useRef("");
  const roleField = useRef("");
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

  const onRegister = async (e) => {
    e.preventDefault();

    try {
      const userToRegisterPayload = {
        name: nameField.current.value,
        email: emailField.current.value,
        role: roleField.current.value,
        password: passwordField.current.value,
      };

      const registerRequest = await axios.post(
        "http://localhost:2000/auth/register",
        userToRegisterPayload
      );

      const registerResponse = registerRequest.data;

      if (registerResponse.status) navigate("/login");
    } catch (err) {
      console.log(err);
      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  return (
    <Card className="w-75 text-black" style={{ margin: "1% 11%" }}>
      <Container className="my-5">
        <Row>
          <h1 className="mb-3 text-center">Sign Up</h1>
          <Col md={5}>
            <img
              src={regisImage}
              className="w-75"
              style={{ margin: "10% 20% 0 20%" }}
              alt=""
            />
          </Col>
          <Col md={7} className="w-50 ms-3">
            <Form onSubmit={onRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select ref={roleField} style={buttonBorder}>
                  <option hidden>Choose a role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  style={buttonBorder}
                  type="text"
                  ref={nameField}
                  placeholder="Name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  style={buttonBorder}
                  ref={emailField}
                  placeholder="Email"
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
                Have an account ?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </p>
              {errorResponse.isError && (
                <Alert variant="danger">{errorResponse.message}</Alert>
              )}
              <div className="text-center">
                <Button style={buttonPrimary} className="w-100" type="submit">
                  Sign up
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
