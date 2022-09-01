import React, { useRef, useState, useEffect } from "react";
import { Form, Container, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { useDropzone } from "react-dropzone";

export default function Update() {
  const navigate = useNavigate();
  const titleField = useRef("");
  const descriptionField = useRef("");
  const { id } = useParams();

  const buttonBorder = {
    borderRadius: "10px",
  };

  const buttonPrimary = {
    backgroundColor: "rgb(10, 2, 77)",
    borderRadius: "10px",
  };

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
      files.forEach((element) => {
        createPostPayload.append("picture", element);
      });

      const token = localStorage.getItem("token");

      const createRequest = await axios.put(
        `https://api-instagram-be.herokuapp.com/posts/${id}`,
        createPostPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const createResponse = createRequest.data;
      console.log(createResponse);

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
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
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
  };

  const buttonUpload = {
    borderRadius: "12px",
    backgroundColor: "rgba(226, 212, 240, 1)",
    border: "1px solid rgba(226, 212, 240, 1)",
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
        <h1 className="mb-3 text-center text-white">Update Post</h1>
        <Form onSubmit={onUpdate} className="form-create">
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
                    <h2>
                      <MdOutlinePhotoCamera
                        style={{
                          fontSize: "36px",
                          color: "rgba(113, 38, 181, 1)",
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
