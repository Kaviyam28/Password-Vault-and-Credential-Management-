import axios from "axios";
import { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleInput = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    // Clear old messages when user starts correcting the form
    setErrorMessage("");
    setSuccessMessage("");
  };

  // ==========================================
  // CREATE ACCOUNT
  // ==========================================
  const createAccount = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // Prevent multiple requests
    if (isRegistering) {
      return;
    }

    // ==========================================
    // EMPTY FIELD VALIDATION
    // ==========================================
    if (
      formData.userName.trim() === "" ||
      formData.email.trim() === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // ==========================================
    // USERNAME VALIDATION
    // ==========================================
    if (formData.userName.trim().length < 3) {
      setErrorMessage(
        "User name must contain at least 3 characters."
      );
      return;
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // ==========================================
    // PASSWORD LENGTH VALIDATION
    // ==========================================
    if (formData.password.length < 6) {
      setErrorMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // ==========================================
    // CONFIRM PASSWORD VALIDATION
    // ==========================================
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsRegistering(true);

      const response = await axios.post(
        "http://localhost:8080/api/register",
        {
          userName: formData.userName.trim(),
          email: formData.email.trim(),
          password: formData.password
        }
      );

      // ==========================================
      // SUCCESS
      // ==========================================
      setSuccessMessage(
        response.data || "Registration successful!"
      );

      // Clear form after successful registration
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error("Registration error:", error);

      // ==========================================
      // BACKEND ERROR
      // ==========================================
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        // Convert backend response safely into a message
        const backendMessage =
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              responseData?.error ||
              "";

        // 400 - Bad Request
        if (status === 400) {
          setErrorMessage(
            backendMessage || "Invalid registration details."
          );
        }

        // 409 - Conflict / Duplicate account
        else if (status === 409) {
          setErrorMessage(
            backendMessage ||
              "Email or user name already exists."
          );
        }

        // 401 - Unauthorized
        else if (status === 401) {
          setErrorMessage(
            "You are not authorized to create an account."
          );
        }

        // 403 - Forbidden
        else if (status === 403) {
          setErrorMessage(
            "Registration is currently not allowed."
          );
        }

        // 404 - API endpoint not found
        else if (status === 404) {
          setErrorMessage(
            "Registration service is unavailable. Please try again later."
          );
        }

        // 500+ - Server error
        else if (status >= 500) {
          setErrorMessage(
            "Server error. Please try again later."
          );
        }

        // Other backend errors
        else {
          setErrorMessage(
            backendMessage ||
              "Registration failed. Please try again."
          );
        }
      }

      // ==========================================
      // NETWORK / SERVER NOT AVAILABLE
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
      setIsRegistering(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="register-container">

      <div className="register-card">

        <div className="heading-section">

          <h1>
            Create Account
          </h1>

          <p>
            Join SecureVault and protect your digital information securely.
          </p>

        </div>

        <form onSubmit={createAccount}>

          {/* USER NAME */}

          <div className="input-box">

            <label htmlFor="userName">
              User Name
            </label>

            <input
              id="userName"
              type="text"
              name="userName"
              placeholder="Enter your name"
              value={formData.userName}
              onChange={handleInput}
              disabled={isRegistering}
              autoComplete="username"
            />

          </div>

          {/* EMAIL */}

          <div className="input-box">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInput}
              disabled={isRegistering}
              autoComplete="email"
            />

          </div>

          {/* PASSWORD */}

          <div className="input-box">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleInput}
              disabled={isRegistering}
              autoComplete="new-password"
            />

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="input-box">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInput}
              disabled={isRegistering}
              autoComplete="new-password"
            />

          </div>

          {/* ERROR MESSAGE */}

          {errorMessage && (
            <div
              role="alert"
              className="register-error-message"
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* SUCCESS MESSAGE */}

          {successMessage && (
            <div
              role="status"
              className="register-success-message"
            >
              ✅ {successMessage}
            </div>
          )}

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="register-btn"
            disabled={isRegistering}
          >
            {isRegistering
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;