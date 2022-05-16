import "./LoginPage.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    loginBtn: false,
    loginStatus: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const loginFunc = async () => {
    try {
      const response = await axios.post("/api/auth/login", {
        email: loginInfo.email,
        password: loginInfo.password,
      });

      localStorage.setItem("TOKEN", response.data.encodedToken);
      localStorage.setItem(
        "USER_INFO",
        JSON.stringify({
          email: response.data.foundUser.email,
          fullname: response.data.foundUser.fullname,
        })
      );

      navigate("/");
    } catch (error) {
      if (error.response.status === 401) {
        alert("Password is wrong");
      } else if (error.response.status === 404) {
        if (loginInfo.loginStatus) {
          alert("Email doesnt exist");
        }
      }
    }
  };

  const singupSubmiter = (e) => {
    e.preventDefault();
    setLoginInfo((item) => ({ ...item, loginStatus: true }));
    loginFunc();
  };

  const loginAsGuest = () => {
    setLoginInfo((item) => ({
      ...item,
      email: "adarshbalika@gmail.com",
      password: "adarshBalika123",
      loginStatus: false,
    }));
    loginFunc();
  };

  return (
    <>
      <div className="sidebar-box">
        <Sidebar />
      </div>
      <form className="login-outerbox" onSubmit={singupSubmiter}>
        <div className="login-container">
          <div className="login-text">Login</div>

          <div className="input-container">
            <label className="login-heading" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input-feild"
              id="email"
              value={loginInfo.email}
              onChange={(e) => {
                setLoginInfo((item) => ({
                  ...item,
                  email: e.target.value,
                }));

                e.target.value.length > 0
                  ? setLoginInfo((item) => ({ ...item, loginBtn: true }))
                  : setLoginInfo((item) => ({ ...item, loginBtn: false }));
              }}
              required
            ></input>
          </div>

          <div className="input-container password-container">
            <label className="login-heading" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-feild"
              id="password"
              value={loginInfo.password}
              onChange={(e) => {
                setLoginInfo((item) => ({
                  ...item,
                  password: e.target.value,
                }));
              }}
              required
            ></input>
            <span className="password-eye">
              {showPassword ? (
                <i
                  className="fas fa-eye"
                  onClick={() => setShowPassword(false)}
                ></i>
              ) : (
                <i
                  className="fas fa-eye-slash"
                  onClick={() => setShowPassword(true)}
                ></i>
              )}
            </span>
          </div>

          {!loginInfo.loginBtn && <div className="or-text">OR</div>}
          {loginInfo.loginBtn ? (
            <button
              className={`guest-login-btn ${
                loginInfo.loginBtn ? "margin-login" : null
              }`}
              type="submit"
            >
              Login
            </button>
          ) : (
            <button className="guest-login-btn" onClick={loginAsGuest}>
              Login as guest
            </button>
          )}

          <div className="new-text">
            Don't have an account yet?
            <Link to="/signup" className="signup-text Link">
              &nbsp;Signup
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export { LoginPage };
