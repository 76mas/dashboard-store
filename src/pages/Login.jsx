import axios from "axios";
import "../App.css";

import React, { useEffect, useState } from "react";

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  const handellogin = async () => {
    const postData = {
      username: userInfo.username,
      password: userInfo.password,
    };
    try {
      const response = await axios.post(
        "http://161.97.169.6:4000/user/login",
        postData
      );
      console.log(response.data);

      localStorage.setItem("token_dashboard", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.user));

      window.location.href = "/order";
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token_dashboard")) {
      window.location.href = "/order";
    }
  }, []);

  return (
    <div className="flex w-full h-full min-h-screen  justify-center items-center">
      {" "}
      <div className="container">
        <input type="checkbox" id="signup_toggle" />
        <form className="form">
          <div className="form_front">
            <div className="form_details">Login</div>
            <input
              onChange={(e) => {
                setUserInfo({ ...userInfo, username: e.target.value });
              }}
              placeholder="Username"
              className="input"
              type="text"
            />
            <input
              onChange={(e) => {
                setUserInfo({ ...userInfo, password: e.target.value });
              }}
              placeholder="Password"
              className="input"
              type="text"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handellogin();
              }}
              className="btn"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
