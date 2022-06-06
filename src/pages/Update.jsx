import React, { useRef, useState } from "react";
import { Form, Container, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Update() {
  const navigate = useNavigate();
  const titleField = useRef("");
  const descriptionField = useRef("");
  const [pictureField, setPictureField] = useState();
  const { id } = useParams();

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const onUpdate = async (e) => {
    e.preventDefault();

    try {
      const createPostPayload = new FormData();

      createPostPayload.append("title", titleField.current.value);
      createPostPayload.append("description", descriptionField.current.value);
      createPostPayload.append("picture", pictureField);

      const token = localStorage.getItem("token");

      const createRequest = await axios.put(
        `https://api-instagram-be.herokuapp.com/posts/${id}`,
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
    <Container className="my-5 w-50">
      <h1 className="mb-3 text-center">Update Post</h1>
      <Form onSubmit={onUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" ref={titleField} placeholder="Title" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            ref={descriptionField}
            placeholder="Description "
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setPictureField(e.target.files[0])}
          />
        </Form.Group>

        {errorResponse.isError && (
          <Alert variant="danger">{errorResponse.message}</Alert>
        )}
        <div className="d-flex justify-content-center">
          <Button type="submit">Submit</Button>
          <Link to="/">
            <Button type="submit" variant="outline-secondary" className="ms-3">
              Cancel
            </Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
}
