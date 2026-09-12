import axios from "axios";
import { useState } from "react";
import {
  FaCloud,
  FaFingerprint,
  FaLock,
  FaShieldAlt
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  // ==========================================
  // LOGIN
  // ==========================================
  const handleLogin = async () => {
    // Clear previous error
    setErrorMessage("");

    // Empty field validation
    if (email.trim() === "" && password.trim() === "") {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    if (email.trim() === "") {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (password.trim() === "") {
      setErrorMessage("Please enter your password.");
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Prevent multiple requests
    if (isLoggingIn) {
      return;
    }

    try {
      setIsLoggingIn(true);

      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          email: email.trim(),
          password: password
        }
      );

      // ==========================================
      // SUCCESSFUL LOGIN
      // ==========================================
      if (response.data === "Login Successful") {
        // Save login session
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email.trim());

        alert("Login Successful");

        // Navigate to Home Dashboard
        navigate("/home");
      } else {
        setErrorMessage(
          response.data || "Invalid email or password."
        );
      }

    } catch (error) {
      console.error("Login error:", error);

      // ==========================================
      // BACKEND RESPONDED WITH ERROR
      // ==========================================
      if (error.response) {

        // 401 - Invalid credentials
        if (error.response.status === 401) {
          setErrorMessage("Invalid email or password.");
        }

        // 400 - Bad request
        else if (error.response.status === 400) {
          setErrorMessage(
            typeof error.response.data === "string"
              ? error.response.data
              : "Invalid login details."
          );
        }

        // 403 - Unauthorized
        else if (error.response.status === 403) {
          setErrorMessage(
            "You are not authorized to access this account."
          );
        }

        // 404 - API not found
        else if (error.response.status === 404) {
          setErrorMessage(
            "Login service is unavailable. Please try again later."
          );
        }

        // 500+ - Server error
        else if (error.response.status >= 500) {
          setErrorMessage(
            "Server error. Please try again later."
          );
        }

        // Other backend errors
        else {
          setErrorMessage(
            typeof error.response.data === "string"
              ? error.response.data
              : "Unable to login. Please try again."
          );
        }
      }

      // ==========================================
      // SERVER NOT REACHABLE / NETWORK ERROR
      // ==========================================
      else if (error.request) {
        setErrorMessage(
          "Unable to connect to the server. Please make sure the Spring Boot server is running."
        );
      }

      // ==========================================
      // UNEXPECTED ERROR
      // ==========================================
      else {
        setErrorMessage(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setIsLoggingIn(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="container">

      {/* ======================================
          LEFT PANEL
      ====================================== */}

      <div className="left-panel">

        <div className="logo">

          <FaShieldAlt className="shield" />

          <h1>
            SecureVault
          </h1>

          <p className="tagline">
            Protect • Encrypt • Control
          </p>

        </div>

        <h2>
          Your Digital Security Starts Here
        </h2>

        <p className="description">
          SecureVault safeguards passwords,
          confidential documents and sensitive
          information using enterprise-level
          encryption, intelligent monitoring and
          secure cloud synchronization.
        </p>

        {/* FEATURES */}

        <div className="features">

          <div className="feature">
            <FaLock />
            <span>
              AES-256 Data Encryption
            </span>
          </div>

          <div className="feature">
            <FaFingerprint />
            <span>
              Biometric Authentication
            </span>
          </div>

          <div className="feature">
            <FaCloud />
            <span>
              Encrypted Cloud Backup
            </span>
          </div>

          <div className="feature">
            <FaShieldAlt />
            <span>
              Real-Time Threat Protection
            </span>
          </div>

        </div>

      </div>

      {/* ======================================
          RIGHT PANEL
      ====================================== */}

      <div className="right-panel">

        <div className="login-card">

          <h2>
            Welcome Back
          </h2>

          {/* ======================================
              ERROR MESSAGE
          ====================================== */}

          {errorMessage && (
            <div
              role="alert"
              style={{
                background: "#ffebee",
                color: "#c62828",
                border: "1px solid #ef9a9a",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "15px",
                fontSize: "14px",
                lineHeight: "1.4",
                wordBreak: "break-word"
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* ======================================
              EMAIL
          ====================================== */}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            disabled={isLoggingIn}
            autoComplete="email"
          />

          {/* ======================================
              PASSWORD
          ====================================== */}

          <input
            type="password"
            placeholder="Master Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            disabled={isLoggingIn}
            autoComplete="current-password"
          />

          {/* ======================================
              LOGIN BUTTON
          ====================================== */}

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            style={{
              opacity: isLoggingIn ? 0.7 : 1,
              cursor: isLoggingIn
                ? "not-allowed"
                : "pointer"
            }}
          >
            {isLoggingIn
              ? "Logging in..."
              : "Secure Login"}
          </button>

          {/* ======================================
              LINKS
          ====================================== */}

          <div className="links">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;