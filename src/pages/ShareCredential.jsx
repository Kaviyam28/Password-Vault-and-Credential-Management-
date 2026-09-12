import axios from "axios";
import { useState } from "react";

function ShareCredential({ credential, onClose }) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [permission, setPermission] = useState("VIEW");
  const [loading, setLoading] = useState(false);

  // Task 2 - Error / Success message
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const senderEmail = localStorage.getItem("userEmail");

  // ==========================================
  // EMAIL VALIDATION
  // ==========================================
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // ==========================================
  // HANDLE SHARE
  // ==========================================
  const handleShare = async () => {
    setMessage("");
    setMessageType("");

    // ==============================
    // VALIDATE RECEIVER EMAIL
    // ==============================
    if (!receiverEmail.trim()) {
      setMessage("Please enter receiver email.");
      setMessageType("error");
      return;
    }

    if (!isValidEmail(receiverEmail.trim())) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    // ==============================
    // VALIDATE EXPIRY DATE
    // ==============================
    if (!expiryDate) {
      setMessage("Please select an expiry date.");
      setMessageType("error");
      return;
    }

    // ==============================
    // VALIDATE EXPIRY DATE
    // ==============================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(expiryDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setMessage("Expiry date cannot be in the past.");
      setMessageType("error");
      return;
    }

    // ==============================
    // VALIDATE PERMISSION
    // ==============================
    if (!permission) {
      setMessage("Please select a permission.");
      setMessageType("error");
      return;
    }

    // ==============================
    // VALIDATE SENDER
    // ==============================
    if (!senderEmail) {
      setMessage("Your session has expired. Please login again.");
      setMessageType("error");
      return;
    }

    // ==============================
    // VALIDATE CREDENTIAL
    // ==============================
    if (!credential || !credential.id) {
      setMessage("Credential information is missing.");
      setMessageType("error");

      console.error("Credential:", credential);
      return;
    }

    // ==============================
    // PREVENT SELF SHARING
    // ==============================
    if (
      receiverEmail.trim().toLowerCase() ===
      senderEmail.trim().toLowerCase()
    ) {
      setMessage("You cannot share a credential with yourself.");
      setMessageType("error");
      return;
    }

    // ==============================
    // PREVENT DUPLICATE CLICK
    // ==============================
    if (loading) {
      return;
    }

    // ==============================
    // DATA TO SEND
    // ==============================
    const shareData = {
      credentialId: credential.id,
      senderEmail: senderEmail.trim(),
      receiverEmail: receiverEmail.trim(),
      expiryDate: expiryDate,
      permission: permission,
    };

    console.log("=================================");
    console.log("SHARE DATA");
    console.log("Credential ID:", credential.id);
    console.log("Sender:", senderEmail);
    console.log("Receiver:", receiverEmail);
    console.log("Expiry Date:", expiryDate);
    console.log("Permission:", permission);
    console.log("=================================");

    try {
      setLoading(true);

      // ==============================
      // SEND TO SPRING BOOT
      // ==============================
      const response = await axios.post(
        "https://password-vault-and-credential-management-4n8d.onrender.com/api/sharing/share",
        shareData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("SERVER RESPONSE:");
      console.log(response.data);

      setMessage("Credential shared successfully.");
      setMessageType("success");

      // Close popup after successful sharing
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      console.error("=================================");
      console.error("SHARE ERROR");
      console.error(error);
      console.error("=================================");

      // ==============================
      // SERVER RESPONDED WITH ERROR
      // ==============================
      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("SERVER RESPONSE:", error.response.data);

        const status = error.response.status;
        const data = error.response.data;

        let serverMessage = "";

        if (typeof data === "string") {
          serverMessage = data;
        } else if (data?.message) {
          serverMessage = data.message;
        }

        if (status === 400) {
          setMessage(
            serverMessage ||
              "Invalid sharing details. Please check the entered information."
          );
        } else if (status === 401) {
          setMessage(
            "Unauthorized request. Please login again."
          );
        } else if (status === 403) {
          setMessage(
            serverMessage ||
              "You are not authorized to share this credential."
          );
        } else if (status === 404) {
          setMessage(
            serverMessage ||
              "Credential or receiver account was not found."
          );
        } else if (status === 409) {
          setMessage(
            serverMessage ||
              "This credential has already been shared with this user."
          );
        } else if (status === 410) {
          setMessage(
            serverMessage ||
              "This credential sharing request has expired."
          );
        } else if (status === 500) {
          setMessage(
            "Server error while sharing the credential. Please try again later."
          );
        } else if (status >= 500) {
          setMessage(
            "The SecureVault server is currently unavailable. Please try again later."
          );
        } else {
          setMessage(
            serverMessage ||
              "Unable to share the credential. Please try again."
          );
        }

        setMessageType("error");
      }

      // ==============================
      // SERVER DID NOT RESPOND
      // ==============================
      else if (error.request) {
        setMessage(
          "Unable to connect to the SecureVault server. Please make sure Spring Boot is running on port 8080."
        );

        setMessageType("error");
      }

      // ==============================
      // OTHER ERROR
      // ==============================
      else {
        setMessage(
          "Unable to send the sharing request. Please try again."
        );

        setMessageType("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="share-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "15px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <div
        className="share-modal"
        style={{
          width: "420px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          boxSizing: "border-box",
        }}
      >

        {/* TITLE */}
        <h2
          style={{
            color: "#1565C0",
            marginBottom: "20px",
          }}
        >
          🔗 Share Credential
        </h2>

        {/* SUCCESS / ERROR MESSAGE */}
        {message && (
          <div
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: "15px",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "13px",
              lineHeight: "1.4",
              background:
                messageType === "success"
                  ? "#E8F5E9"
                  : "#FFEBEE",
              border:
                messageType === "success"
                  ? "1px solid #81C784"
                  : "1px solid #EF9A9A",
              color:
                messageType === "success"
                  ? "#2E7D32"
                  : "#C62828",
            }}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* WEBSITE */}
        <p
          style={{
            wordBreak: "break-word",
            lineHeight: "1.5",
          }}
        >
          <strong>Website:</strong>{" "}
          {credential?.website}
        </p>

        {/* USERNAME */}
        <p
          style={{
            wordBreak: "break-word",
            lineHeight: "1.5",
          }}
        >
          <strong>Username:</strong>{" "}
          {credential?.username}
        </p>

        {/* SENDER */}
        <p
          style={{
            wordBreak: "break-word",
            lineHeight: "1.5",
          }}
        >
          <strong>Sharing from:</strong>{" "}
          {senderEmail}
        </p>

        {/* RECEIVER EMAIL */}
        <input
          type="email"
          placeholder="Enter registered user's email"
          value={receiverEmail}
          onChange={(e) =>
            setReceiverEmail(e.target.value)
          }
          disabled={loading}
          style={{
            width: "100%",
            height: "42px",
            padding: "10px",
            marginTop: "15px",
            marginBottom: "15px",
            border:
              messageType === "error" && !receiverEmail.trim()
                ? "1px solid #E53935"
                : "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        {/* PERMISSION */}
        <label
          style={{
            display: "block",
            marginBottom: "8px",
          }}
        >
          <strong>Permission:</strong>
        </label>

        <select
          value={permission}
          onChange={(e) =>
            setPermission(e.target.value)
          }
          disabled={loading}
          style={{
            width: "100%",
            height: "42px",
            padding: "8px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        >
          <option value="VIEW">
            View Only
          </option>

          <option value="EDIT">
            View & Edit
          </option>

          <option value="FULL">
            Full Access
          </option>
        </select>

        {/* EXPIRY DATE */}
        <label
          style={{
            display: "block",
            marginBottom: "8px",
          }}
        >
          <strong>Expiry Date:</strong>
        </label>

        <input
          type="date"
          value={expiryDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setExpiryDate(e.target.value)
          }
          disabled={loading}
          style={{
            width: "100%",
            height: "42px",
            padding: "10px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        {/* BUTTONS */}
        <div
          className="share-buttons"
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          {/* SHARE BUTTON */}
          <button
            type="button"
            onClick={handleShare}
            disabled={loading}
            style={{
              flex: 1,
              height: "42px",
              padding: "10px",
              background: loading
                ? "#90A4AE"
                : "#1565C0",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "600",
            }}
          >
            {loading ? "Sharing..." : "Share"}
          </button>

          {/* CANCEL BUTTON */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              height: "42px",
              padding: "10px",
              background: loading
                ? "#BDBDBD"
                : "#757575",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>

        </div>

      </div>

      {/* RESPONSIVE STYLES */}
      <style>
        {`
          @media (max-width: 600px) {
            .share-overlay {
              align-items: flex-start !important;
              padding: 12px !important;
            }

            .share-modal {
              width: 100% !important;
              max-width: 100% !important;
              padding: 20px !important;
              margin-top: 10px;
              border-radius: 10px !important;
            }

            .share-modal h2 {
              font-size: 21px !important;
              margin-bottom: 16px !important;
            }

            .share-buttons {
              flex-direction: column !important;
              gap: 8px !important;
            }

            .share-buttons button {
              width: 100% !important;
              flex: none !important;
            }
          }

          @media (max-width: 400px) {
            .share-overlay {
              padding: 8px !important;
            }

            .share-modal {
              padding: 16px !important;
            }

            .share-modal h2 {
              font-size: 19px !important;
            }
          }
        `}
      </style>

    </div>
  );
}

export default ShareCredential;