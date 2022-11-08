import React from "react";
import { render } from "react-dom";
import "./index.css";
import Home from "./pages/Home";
import { store } from "./app/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Update from "./pages/Update";
import { Provider } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";

const root = document.getElementById("root");
render(
  <Provider store={store}>
    <SkeletonTheme baseColor="#202020" highlightColor="rgb(201, 182, 182)">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/update/:id" element={<Update />} />
        </Routes>
      </Router>
    </SkeletonTheme>
  </Provider>,
  root
);
