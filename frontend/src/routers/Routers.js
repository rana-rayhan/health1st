import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "../layout/Footer";
import NavBar from "../layout/NavBar";
import Blogs from "../components/blog/Blogs";
import PostPage from "../components/blog/PostPage";
import ErrorPage from "../components/ErrorPage";
import Login from "../components/auth/Login";
import Signup from "../components/auth/SignUp";
import CreateBlog from "../components/blog/CreateBlog";
import UserVerification from "../components/auth/UserVerification";
import AboutUs from "../components/About";

const Routers = () => {
  return (
    <BrowserRouter>
      <h1 className="bg-gradient-to-r from-pink-500 to-blue-500 text-center text-gray-100 text-sm p-1">
        Share, Connect, Heal - Empowering You with Real Stories and Real Support
      </h1>
      <NavBar />
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-post" element={<CreateBlog />} />
        <Route path="/blog/:title" element={<PostPage />} />
        <Route
          path="/api/users/activate/:token"
          element={<UserVerification />}
        />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Routers;
