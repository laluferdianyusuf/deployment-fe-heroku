import { Link, Navigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Dropdown,
  Modal,
  Alert,
  Spinner,
  Carousel,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../slices/userSlice";
import "./All.css";
import { BiEdit } from "react-icons/bi";
import { TiDeleteOutline } from "react-icons/ti";
import DeleteImage from "../images/folder.png";
import shangchiImage from "../images/shang-chi.jpg";
import endgameImage from "../images/endgame.jpg";
import doctorImage from "../images/doctor-strange.jpeg";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const dispatch = useDispatch();
  const [postDelete, setPostDelete] = useState();
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setPostDelete(null);
    setShowModal(false);
  };

  const handleShowModal = (e, post) => {
    e.preventDefault();
    setPostDelete(post);
    setShowModal(true);
  };

  const [successResponse, setSuccessResponse] = useState({
    isSuccess: false,
    message: "",
  });

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const buttonSuccess = {
    backgroundColor: "rgb(1, 66, 1)",
    borderRadius: "0px",
  };
  const buttonPrimary = {
    backgroundColor: "rgb(10, 2, 77)",
    borderRadius: "0px",
  };
  const buttonDanger = {
    backgroundColor: "rgb(119, 0, 0)",
    borderRadius: "0px",
  };
  const buttonBorder = {
    borderRadius: "0px",
  };

  useEffect(() => {
    const validateLogin = async () => {
      try {
        // Check status user login
        // 1. Get token from localStorage
        const token = localStorage.getItem("token");

        // 2. Check token validity from API
        const currentUserRequest = await axios.get(
          "https://api-instagram-be.herokuapp.com/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentUserResponse = currentUserRequest.data;

        if (currentUserResponse.status) {
          dispatch(
            addUser({
              user: currentUserResponse.data.user,
              token: token,
            })
          );
          setUser(currentUserResponse.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    validateLogin();
    fetchData();
    setIsRefresh(false);
  }, [isRefresh]);

  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUser({});
  };

  const fetchData = async () => {
    //fetching
    const response = await axios.get(
      "https://api-instagram-be.herokuapp.com/api/posts"
    );
    //get response data
    const data = await response.data.data.Loaded_Posts;
    console.log(data);

    //assign response data to state "posts"
    setPosts(data);
  };

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const createRequest = await axios.delete(
        `https://api-instagram-be.herokuapp.com/posts/${postDelete.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const createResponse = createRequest.data.message;

      setSuccessResponse({
        isSuccess: true,
        message: createResponse,
      });

      console.log(createResponse);

      setPostDelete(null);
      setShowModal(false);

      setIsRefresh(true);
    } catch (err) {
      const response = err.response.data;
      console.log(response);

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  return isLoggedIn ? (
    <>
      {loading ? (
        <div className="text-center" style={{ marginTop: "15rem" }}>
          <h2 className="mb-2">Please Wait</h2>
          <Spinner
            animation="border"
            variant="dark"
            style={{ height: "4rem", width: "4rem" }}
          />
        </div>
      ) : (
        <>
          <Carousel>
            <Carousel.Item interval={1000}>
              <img
                className="d-block w-100"
                src={shangchiImage}
                alt="First slide"
                style={{ height: "70vh" }}
              />
              <Carousel.Caption>
                <h3>Shang-Chi The Legends of The Ten Rings</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={500}>
              <img
                className="d-block w-100"
                src={endgameImage}
                alt="Second slide"
                style={{ height: "70vh" }}
              />
              <Carousel.Caption>
                <h3>Avengers: Endgame</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={doctorImage}
                alt="Third slide"
                style={{ height: "70vh" }}
              />
              <Carousel.Caption>
                <h3>Doctor Strange in The Multiverse of Madness</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

          <Container>
            {successResponse.isSuccess && (
              <Alert
                variant="success"
                onClose={() => setSuccessResponse(true)}
                dismissible
                style={buttonBorder}
              >
                {successResponse.message}
              </Alert>
            )}

            {errorResponse.isError && (
              <Alert
                variant="danger"
                onClose={() => setErrorResponse(true)}
                dismissible
                style={buttonBorder}
              >
                {errorResponse.message}
              </Alert>
            )}

            <div className="p-3">
              <div className="d-flex mb-5 dropdown-content">
                <Link to="/about">
                  <Button variant="success" style={buttonSuccess}>
                    Go to about page
                  </Button>
                </Link>

                <h4
                  className="mb-0 ms-auto text-white"
                  style={{ alignSelf: "center" }}
                >
                  MARVEL CINEMATIC UNIVERSE
                </h4>

                <Link to="/create" className="ms-auto">
                  <Button variant="primary" style={buttonPrimary}>
                    Create
                  </Button>
                </Link>

                <Dropdown className="ms-2">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    style={buttonBorder}
                    id="dropdown-basic"
                  >
                    {user.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu w-100">
                    <p>{user.name}</p>

                    <Button
                      variant="danger"
                      style={buttonDanger}
                      onClick={(e) => logout(e)}
                    >
                      Logout
                    </Button>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <Row>
                {posts.map((post) => (
                  <Col md={4} key={post.id} className="card-column mb-4">
                    <Card className="card-container">
                      <div className="card-image">
                        <img
                          src={`https://api-instagram-be.herokuapp.com/public/files/${post.picture}`}
                          alt=""
                        />
                        <Card.Body>
                          <Card.Title style={{ height: "55px" }}>
                            {post.title}{" "}
                          </Card.Title>
                          <Card.Text
                            style={{ textAlign: "justify", height: "140px" }}
                          >
                            {post.description}
                          </Card.Text>
                        </Card.Body>
                      </div>
                      <div className="button-action" style={{ width: "20px" }}>
                        <a
                          onClick={(e) => handleShowModal(e, post)}
                          style={{ color: "red", cursor: "pointer" }}
                        >
                          <TiDeleteOutline style={{ fontSize: "26px" }} />
                        </a>

                        <Link
                          to={`/update/${post.id}`}
                          style={{ color: "white", fontSize: "24px" }}
                        >
                          <BiEdit style={{ fontSize: "24px" }} />
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))}

                <Modal
                  show={showModal}
                  onHide={handleCloseModal}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header
                    className="d-block"
                    style={{
                      borderBottom: "1px solid rgb(119, 0, 0)",
                      borderRadius: "8px",
                    }}
                  >
                    <Modal.Title className="text-black text-center">
                      ------ Are You Sure ? ------
                    </Modal.Title>
                    <Modal.Body className="text-center">
                      <img src={DeleteImage} alt="" />
                    </Modal.Body>
                  </Modal.Header>
                  <Modal.Footer style={{ borderTop: "2px solid white" }}>
                    <Button
                      variant="secondary"
                      style={buttonBorder}
                      onClick={handleCloseModal}
                    >
                      Close
                    </Button>

                    <Button
                      variant="danger"
                      style={buttonDanger}
                      onClick={(e) => onDelete(e)}
                    >
                      YES
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Row>
            </div>
          </Container>
        </>
      )}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Home;
