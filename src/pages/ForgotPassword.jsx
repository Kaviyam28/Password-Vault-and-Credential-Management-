import axios from "axios";
import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // ==========================================
  // EMAIL VALIDATION
  // ==========================================
  const isValidEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value.trim());
  };

  // ==========================================
  // SHOW MESSAGE
  // ==========================================
  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // ==========================================
  // SEND OTP
  // ==========================================
  const sendOtp = async () => {
    setMessage("");
    setMessageType("");

    // Prevent multiple requests
    if (isSendingOtp) {
      return;
    }

    // Empty email validation
    if (email.trim() === "") {
      showMessage("Please enter your registered email address.");
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    try {
      setIsSendingOtp(true);

      const response = await axios.post(
        "https://password-vault-and-credential-management-4n8d.onrender.com/api/password/forgot",
        {
          email: email.trim()
        }
      );

      showMessage(
        response.data || "OTP has been sent to your email.",
        "success"
      );

    } catch (error) {
      console.error("Send OTP error:", error);

      // Backend responded
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        const backendMessage =
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              responseData?.error ||
              "";

        if (status === 400) {
          showMessage(
            backendMessage ||
              "Please enter a valid email address."
          );
        }

        else if (status === 404) {
          showMessage(
            backendMessage ||
              "No account was found with this email address."
          );
        }

        else if (status === 429) {
          showMessage(
            "Too many OTP requests. Please wait before trying again."
          );
        }

        else if (status >= 500) {
          showMessage(
            "Server error. Unable to send OTP. Please try again later."
          );
        }

        else {
          showMessage(
            backendMessage ||
              "Failed to send OTP. Please try again."
          );
        }
      }

      // Server unavailable
      else if (error.request) {
        showMessage(
          "Unable to connect to the server. Please make sure the Spring Boot server is running."
        );
      }

      // Unexpected error
      else {
        showMessage(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setIsSendingOtp(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================
  const verifyOtp = async () => {
    setMessage("");
    setMessageType("");

    // Prevent multiple requests
    if (isVerifyingOtp) {
      return;
    }

    // Email validation
    if (email.trim() === "") {
      showMessage("Please enter your registered email address.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    // OTP validation
    if (otp.trim() === "") {
      showMessage("Please enter the OTP.");
      return;
    }

    if (!/^\d{4,6}$/.test(otp.trim())) {
      showMessage("Please enter a valid OTP.");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      const response = await axios.post(
        "https://password-vault-and-credential-management-4n8d.onrender.com/api/password/verify-otp",
        {
          email: email.trim(),
          otp: otp.trim()
        }
      );

      if (response.data === "OTP Verified") {
        showMessage(
          "OTP verified successfully. You can now reset your password.",
          "success"
        );

        setOtpVerified(true);
      } else {
        showMessage(
          typeof response.data === "string"
            ? response.data
            : "Invalid OTP. Please enter the correct OTP."
        );

        setOtpVerified(false);
      }

    } catch (error) {
      console.error("OTP verification error:", error);

      // Backend responded
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        const backendMessage =
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              responseData?.error ||
              "";

        if (status === 400) {
          showMessage(
            backendMessage ||
              "Invalid OTP. Please check the OTP and try again."
          );
        }

        else if (status === 401) {
          showMessage(
            "The OTP is invalid or has expired."
          );
        }

        else if (status === 404) {
          showMessage(
            "OTP verification service is unavailable."
          );
        }

        else if (status >= 500) {
          showMessage(
            "Server error. Unable to verify OTP. Please try again later."
          );
        }

        else {
          showMessage(
            backendMessage ||
              "OTP verification failed. Please try again."
          );
        }
      }

      // Server unavailable
      else if (error.request) {
        showMessage(
          "Unable to connect to the server. Please make sure the Spring Boot server is running."
        );
      }

      // Unexpected error
      else {
        showMessage(
          "Something went wrong while verifying the OTP."
        );
      }

    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================
  const resetPassword = async () => {
    setMessage("");
    setMessageType("");

    // Prevent multiple requests
    if (isResettingPassword) {
      return;
    }

    // Make sure OTP was verified
    if (!otpVerified) {
      showMessage(
        "Please verify the OTP before resetting your password."
      );
      return;
    }

    // Password empty validation
    if (newPassword === "") {
      showMessage("Please enter a new password.");
      return;
    }

    // Confirm password empty validation
    if (confirmPassword === "") {
      showMessage("Please confirm your new password.");
      return;
    }

    // Password length validation
    if (newPassword.length < 6) {
      showMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    // Password matching validation
    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    try {
      setIsResettingPassword(true);

      const response = await axios.post(
        "https://password-vault-and-credential-management-4n8d.onrender.com/api/password/reset",
        {
          email: email.trim(),
          newPassword: newPassword
        }
      );

      showMessage(
        response.data || "Password reset successfully.",
        "success"
      );

      // Clear password fields
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("Password reset error:", error);

      // Backend responded
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        const backendMessage =
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              responseData?.error ||
              "";

        if (status === 400) {
          showMessage(
            backendMessage ||
              "Invalid password reset request."
          );
        }

        else if (status === 401) {
          showMessage(
            "Password reset is not authorized. Please verify your OTP again."
          );
        }

        else if (status === 403) {
          showMessage(
            "You are not authorized to reset this password."
          );
        }

        else if (status === 404) {
          showMessage(
            "Password reset service is unavailable."
          );
        }

        else if (status >= 500) {
          showMessage(
            "Server error. Unable to reset password. Please try again later."
          );
        }

        else {
          showMessage(
            backendMessage ||
              "Password reset failed. Please try again."
          );
        }
      }

      // Server unavailable
      else if (error.request) {
        showMessage(
          "Unable to connect to the server. Please make sure the Spring Boot server is running."
        );
      }

      // Unexpected error
      else {
        showMessage(
          "Something went wrong while resetting your password."
        );
      }

    } finally {
      setIsResettingPassword(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="forgot-password-container">

      <div className="forgot-password-card">

        <h2>
          Forgot Password
        </h2>

        {/* ======================================
            MESSAGE
        ====================================== */}

        {message && (
          <div
            role={messageType === "success" ? "status" : "alert"}
            className={
              messageType === "success"
                ? "forgot-success-message"
                : "forgot-error-message"
            }
          >
            {messageType === "success" ? "✅" : "⚠️"} {message}
          </div>
        )}

        {/* ======================================
            EMAIL
        ====================================== */}

        <input
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
            setMessageType("");
          }}
          disabled={isSendingOtp || isVerifyingOtp || isResettingPassword}
          autoComplete="email"
        />

        {/* ======================================
            SEND OTP
        ====================================== */}

        <button
          type="button"
          onClick={sendOtp}
          disabled={isSendingOtp}
        >
          {isSendingOtp
            ? "Sending OTP..."
            : "Send OTP"}
        </button>

        {/* ======================================
            OTP
        ====================================== */}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            setOtp(value);
            setMessage("");
            setMessageType("");
          }}
          maxLength="6"
          inputMode="numeric"
          disabled={
            isSendingOtp ||
            isVerifyingOtp ||
            isResettingPassword
          }
          autoComplete="one-time-code"
        />

        {/* ======================================
            VERIFY OTP
        ====================================== */}

        <button
          type="button"
          onClick={verifyOtp}
          disabled={isVerifyingOtp}
        >
          {isVerifyingOtp
            ? "Verifying OTP..."
            : "Verify OTP"}
        </button>

        {/* ======================================
            RESET PASSWORD
        ====================================== */}

        {otpVerified && (
          <div className="reset-password-section">

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setMessage("");
                setMessageType("");
              }}
              disabled={isResettingPassword}
              autoComplete="new-password"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setMessage("");
                setMessageType("");
              }}
              disabled={isResettingPassword}
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={resetPassword}
              disabled={isResettingPassword}
            >
              {isResettingPassword
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default ForgotPassword;