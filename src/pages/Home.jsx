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
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../slices/userSlice";
import "./All.css";
import { BiEdit } from "react-icons/bi";
import { TiDeleteOutline } from "react-icons/ti";
import { TbArrowBigLeftLines } from "react-icons/tb";
import DeleteImage from "../images/folder.png";
import CreateImage from "../images/page.png";
import LogoutImage from "../images/logout.png";
import UserImage from "../images/user.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingSkeletonImage from "../components/LoadingSkeleton";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const dispatch = useDispatch();
  const [postDelete, setPostDelete] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
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
    background: "none",
    border: "none",
    borderRadius: "10px",
    padding: "0",
  };
  const buttonPrimary = {
    backgroundColor: "rgba(10, 2, 77, 0)",
    borderRadius: "10px",
  };
  const buttonDanger = {
    border: "2px solid transparent",
    backgroundColor: "transparent",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    marginBottom: "10px",
  };

  const buttonDangerV2 = {
    border: "2px solid rgba(255, 153, 0, 0.4)",
    backgroundColor: "rgba(255, 153, 0, 0.4)",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
    margin: "0 12.5%",
  };
  const buttonBorder = {
    borderRadius: "10px",
    border: "2px solid transparent",
    backgroundColor: "transparent",
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

    const getDataAll = async () => {
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

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    validateLogin();
    getDataAll();
    setIsRefresh(false);
  }, [isRefresh]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoadingContent(true);
    }, 3000);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUser({});
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
          {/* header */}
          <Container className="position-absolute pb-0 mt-4 dropdown-content">
            <div className="d-flex ps-3 justify-content-between">
              <Link
                to="/about"
                height={30}
                style={{ top: "20px", left: "25px" }}
                className="align-self-center"
              >
                <Button variant="success" style={buttonSuccess}>
                  <TbArrowBigLeftLines size={30} className="icon-arrow" />
                </Button>
              </Link>

              <h4 className="text-white text-center m-0 align-self-center">
                <a
                  href="#hero"
                  className="text-decoration-none text-white fw-bold text-title"
                >
                  CU
                </a>
              </h4>

              <Dropdown className="pe-2">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  style={buttonBorder}
                  id="dropdown-basic"
                >
                  <img
                    src={UserImage}
                    className="pe-2"
                    style={{ width: "68%" }}
                    alt=""
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu w-100">
                  <p>{user.name}</p>

                  <Button
                    variant="danger"
                    style={buttonDanger}
                    onClick={(e) => logout(e)}
                  >
                    <img src={LogoutImage} className="w-75 " alt="" />
                  </Button>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Container>
          {/* header */}

          {/* hero */}
          <div className="hero-content text-center" id="hero">
            <h1 className="text-white">CINEMATIC UNIVERSE</h1>
            <p></p>
          </div>
          {/* hero */}

          <Container className="mt-2">
            {/* alert success */}
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
            {/* alert success */}

            {/* alert error */}
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
            {/* alert error */}

            <div className="p-3">
              {/* category and create */}
              <div className="d-flex mb-2 create-icon gap-3 ms-3">
                <a
                  className="text-white text-decoration-none align-self-center"
                  href="#"
                >
                  Latest
                </a>
                <a
                  className="text-white text-decoration-none align-self-center"
                  href="#"
                >
                  Popular
                </a>
                <p className="fw-bold">|</p>
                <a
                  className="text-decoration-none align-self-center"
                  href="#"
                  style={{ color: "rgb(255, 153, 0)" }}
                >
                  Action
                </a>
                <a
                  className="text-decoration-none align-self-center"
                  href="#"
                  style={{ color: "blue" }}
                >
                  Sci-Fi
                </a>

                <Link to="/create" className="ms-auto align-self-center mb-4">
                  <Button variant="primary" style={buttonPrimary}>
                    <img src={CreateImage} className="w-75" alt="" />
                  </Button>
                </Link>
              </div>
              {/* category and create */}

              <Row>
                {/* card */}

                {posts.map((data) => (
                  <Col md={4} key={data.id} className="card-column mb-4">
                    <Card className="card-container">
                      <div className="card-image">
                        {loadingContent ? (
                          <Card.Img src={`${data.picture[0]}`} />
                        ) : (
                          <LoadingSkeletonImage />
                        )}

                        <Card.Body>
                          <Card.Title style={{ height: "55px" }}>
                            {loadingContent ? (
                              data.title
                            ) : (
                              <Skeleton
                                width={data.title}
                                style={{ height: "40%" }}
                              />
                            )}
                          </Card.Title>
                          <Card.Text style={{ textAlign: "justify" }}>
                            {loadingContent ? (
                              data.description
                            ) : (
                              <Skeleton count={6} />
                            )}
                          </Card.Text>
                          <Button
                            style={buttonDangerV2}
                            variant="danger"
                            className="w-75"
                          >
                            Learn More
                          </Button>
                        </Card.Body>
                      </div>

                      <div className="button-action" style={{ width: "20px" }}>
                        <a
                          onClick={(e) => handleShowModal(e, data)}
                          style={{
                            color: "rgb(255, 153, 0)",
                            cursor: "pointer",
                          }}
                        >
                          <TiDeleteOutline style={{ fontSize: "26px" }} />
                        </a>

                        <Link
                          to={`/update/${data.id}`}
                          style={{ color: "white", fontSize: "24px" }}
                        >
                          <BiEdit style={{ fontSize: "24px" }} />
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))}
                {/* card */}

                {/* modal */}
                <Modal
                  show={showModal}
                  onHide={handleCloseModal}
                  ClassName="bg-black"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header className="d-block">
                    <Modal.Title className="text-white text-center">
                      ------ Are You Sure ? ------
                    </Modal.Title>
                    <Modal.Body className="text-center">
                      <img src={DeleteImage} alt="" />
                    </Modal.Body>
                  </Modal.Header>
                  <Modal.Footer>
                    <div className="d-flex gap-2 me-5 ms-5">
                      <Button
                        variant="secondary"
                        style={buttonBorder}
                        onClick={handleCloseModal}
                      >
                        Close
                      </Button>

                      <Button
                        variant="danger"
                        style={buttonDangerV2}
                        onClick={(e) => onDelete(e)}
                      >
                        YES
                      </Button>
                    </div>
                  </Modal.Footer>
                </Modal>
                {/* modal */}
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
