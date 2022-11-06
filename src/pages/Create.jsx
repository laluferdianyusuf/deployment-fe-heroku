import React, { useRef, useState, useEffect } from "react";
import { Form, Container, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./All.css";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { useDropzone } from "react-dropzone";

export default function Create() {
  const navigate = useNavigate();
  const titleField = useRef("");
  const descriptionField = useRef("");

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const buttonPrimary = {
    background: "none",
    borderRadius: "5px",
    border: "none",
    borderBottom: "2px solid #910707",
  };

  const buttonBorder = {
    background: "none",
    borderRadius: "5px",
    border: "none",
    borderBottom: "2px solid grey",
  };

  const onCreate = async (e) => {
    e.preventDefault();

    try {
      const createPostPayload = new FormData();

      createPostPayload.append("title", titleField.current.value);
      createPostPayload.append("description", descriptionField.current.value);
      files.forEach((element) => {
        createPostPayload.append("picture", element);
      });

      const token = localStorage.getItem("token");

      const createRequest = await axios.post(
        "https://api-instagram-be.herokuapp.com/posts",
        createPostPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

  const thumb = {
    display: "inline-flex",
    borderRadius: "12px",
    border: "1px solid #eaeaea",
    width: "auto",
    height: 100,
    boxSizing: "border-box",
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
    borderRadius: "12px",
  };

  const buttonUpload = {
    borderRadius: "12px",
    background: "none",
    border: "none",
    padding: "0",
  };

  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          alt=""
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Card className="w-50 card-create">
      <Container className="my-3 w-75">
        <h1 className="mb-3 text-center text-white fw-bold">Create Post</h1>
        <Form onSubmit={onCreate} className="form-create">
          <Form.Group className="mb-3 form-create_box">
            <input type="text" ref={titleField} required />
            <label>Title</label>
          </Form.Group>

          <Form.Group className="mb-3 form-create_box">
            <input as="textarea" type="text" ref={descriptionField} required />
            <label>Description</label>
          </Form.Group>

          <Form.Group className="mb-3 upload ">
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                {files.length === 0 ? (
                  <Button
                    variant="secondary"
                    style={buttonUpload}
                    className="upload-image "
                  >
                    <h2 className="mb-0">
                      <MdOutlinePhotoCamera
                        style={{
                          fontSize: "36px",
                          color: "#910707",
                        }}
                      />
                    </h2>
                  </Button>
                ) : (
                  <div>{thumbs}</div>
                )}
              </div>
            </section>
          </Form.Group>

          {errorResponse.isError && (
            <Alert variant="danger">{errorResponse.message}</Alert>
          )}
          <div className="d-flex justify-content-between">
            <Button
              type="submit"
              style={buttonPrimary}
              variant="outline-secondary"
            >
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
