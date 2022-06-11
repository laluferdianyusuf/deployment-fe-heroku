import React, { useRef, useState } from "react";
import { Form, Container, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./All.css";

export default function Create() {
  const navigate = useNavigate();
  const titleField = useRef("");
  const descriptionField = useRef("");
  const [pictureField, setPictureField] = useState();

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const buttonPrimary = {
    backgroundColor: "rgb(10, 2, 77)",
    borderRadius: "10px",
  };

  const buttonBorder = {
    borderRadius: "10px",
  };

  const onCreate = async (e) => {
    e.preventDefault();

    try {
      const createPostPayload = new FormData();

      createPostPayload.append("title", titleField.current.value);
      createPostPayload.append("description", descriptionField.current.value);
      createPostPayload.append("picture", pictureField);

      const token = localStorage.getItem("token");

      const createRequest = await axios.post(
        "https://api-instagram-be.herokuapp.com/posts",
        createPostPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createResponse = createRequest.data;

      if (createResponse.status) {
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

  return (
    <Card className="w-50 card-create">
      <Container className="my-3 w-75">
        <h1 className="mb-3 text-center text-white">Create Post</h1>
        <Form onSubmit={onCreate} className="form-create">
          <Form.Group className="mb-3 form-create_box">
            <input type="text" ref={titleField} required />
            <label>Title</label>
          </Form.Group>

          <Form.Group className="mb-3 form-create_box">
            <input as="textarea" type="text" ref={descriptionField} required />
            <label>Description</label>
          </Form.Group>

          <Form.Group className="mb-3 form-create_box">
            <Form.Control
              type="file"
              onChange={(e) => setPictureField(e.target.files[0])}
            />
          </Form.Group>

          {errorResponse.isError && (
            <Alert variant="danger">{errorResponse.message}</Alert>
          )}
          <div className="d-flex">
            <Button type="submit" style={buttonPrimary}>
              Submit
            </Button>
            <Link to="/">
              <Button
                type="submit"
                style={buttonBorder}
                variant="outline-secondary"
                className="ms-3 "
              >
                Cancel
              </Button>
            </Link>
          </div>
        </Form>
      </Container>
    </Card>
  );
}
