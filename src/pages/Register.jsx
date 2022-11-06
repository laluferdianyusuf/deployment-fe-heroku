import React, { useRef, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./All.css";

export default function Register() {
  const navigate = useNavigate();

  const nameField = useRef("");
  const emailField = useRef("");
  const roleField = useRef("");
  const passwordField = useRef("");

  const buttonBorder = {
    border: "1px solid transparent",
    borderRadius: "0px",
    cursor: "pointer",
    background: "none",
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
        "https://api-instagram-be.herokuapp.com/auth/register",
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
    <div className="register-box">
      <h2 className="fw-bold">Sign Up</h2>

      <form onSubmit={onRegister}>
        <div className="signup-box">
          <select ref={roleField} style={buttonBorder}>
            <option hidden>Choose a role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="signup-box">
          <input type="text" ref={nameField} required />
          <label>Name</label>
        </div>

        <div className="signup-box">
          <input type="text" ref={emailField} required />
          <label>Email</label>
        </div>

        <div className="signup-box">
          <input type="password" ref={passwordField} required />
          <label>Password</label>
        </div>

        <p className="text-secondary">
          Have an account ?{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </p>
        {errorResponse.isError && (
          <Alert variant="danger">{errorResponse.message}</Alert>
        )}
        <div>
          <Button className="button-submit" type="submit">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
}
