import axios from "axios";
import React, { useEffect, useState } from "react";
import ShareCredential from "./ShareCredential";

function Vault() {
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");

  const [passwords, setPasswords] = useState([]);
  const [showPasswordId, setShowPasswordId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");
  const [sharingCredential, setSharingCredential] = useState(null);

  // ==========================================
  // TASK 2 - ERROR / LOADING STATES
  // ==========================================
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPasswords, setLoadingPasswords] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const userEmail = localStorage.getItem("userEmail");

  // ==========================================
  // LOAD PASSWORDS
  // ==========================================
  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      if (!userEmail) {
        setMessage("Your session has expired. Please login again.");
        setMessageType("error");
        setLoadingPasswords(false);
        return;
      }

      setLoadingPasswords(true);

      const response = await axios.get(
        `https://password-vault-and-credential-management-sku2.onrender.com/api/passwords/${encodeURIComponent(
          userEmail
        )}`
      );

      setPasswords(response.data || []);
    } catch (error) {
      console.error("Failed to load passwords:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Unauthorized access. Please login again.");
        } else if (error.response.status === 403) {
          setMessage(
            "You are not authorized to access these credentials."
          );
        } else if (error.response.status === 404) {
          setMessage("Password vault service was not found.");
        } else if (error.response.status >= 500) {
          setMessage("Server error. Please try again later.");
        } else {
          setMessage(
            error.response.data?.message ||
              error.response.data ||
              "Unable to load saved credentials."
          );
        }
      } else {
        setMessage(
          "Unable to connect to the server. Please make sure Spring Boot is running."
        );
      }

      setMessageType("error");
    } finally {
      setLoadingPasswords(false);
    }
  };

  // ==========================================
  // PASSWORD STRENGTH CHECK
  // ==========================================
  const getPasswordStrength = (passwordValue) => {
    if (!passwordValue) {
      return "";
    }

    const hasLowercase = /[a-z]/.test(passwordValue);
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecial = /[@#$%&*!?]/.test(passwordValue);

    let score = 0;

    if (passwordValue.length >= 8) {
      score++;
    }

    if (hasLowercase) {
      score++;
    }

    if (hasUppercase) {
      score++;
    }

    if (hasNumber) {
      score++;
    }

    if (hasSpecial) {
      score++;
    }

    if (score <= 2) {
      return "Weak";
    } else if (score <= 4) {
      return "Medium";
    } else {
      return "Strong";
    }
  };

  // ==========================================
  // CURRENT PASSWORD STRENGTH
  // ==========================================
  const passwordStrength = getPasswordStrength(password);

  // ==========================================
  // GENERATE STRONG PASSWORD
  // ==========================================
  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "@#$%&*!?";

    const allCharacters =
      uppercase + lowercase + numbers + symbols;

    let generatedPassword = "";

    // At least one uppercase
    generatedPassword +=
      uppercase[
        Math.floor(Math.random() * uppercase.length)
      ];

    // At least one lowercase
    generatedPassword +=
      lowercase[
        Math.floor(Math.random() * lowercase.length)
      ];

    // At least one number
    generatedPassword +=
      numbers[
        Math.floor(Math.random() * numbers.length)
      ];

    // At least one special character
    generatedPassword +=
      symbols[
        Math.floor(Math.random() * symbols.length)
      ];

    // Add remaining characters
    for (let i = 4; i < 12; i++) {
      generatedPassword +=
        allCharacters[
          Math.floor(Math.random() * allCharacters.length)
        ];
    }

    // Shuffle password
    generatedPassword = generatedPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(generatedPassword);

    setMessage("Strong password generated successfully.");
    setMessageType("success");
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================
  const validateForm = () => {
    if (!website.trim()) {
      setMessage("Please enter a website.");
      setMessageType("error");
      return false;
    }

    if (!username.trim()) {
      setMessage("Please enter a username or email.");
      setMessageType("error");
      return false;
    }

    if (!password.trim()) {
      setMessage(
        isEditing
          ? "Please enter a password."
          : "Please enter or generate a password."
      );
      setMessageType("error");
      return false;
    }

    // IMPORTANT:
    // Weak and Medium passwords are now allowed.
    // Password strength is only displayed to the user.

    return true;
  };

  // ==========================================
  // SAVE PASSWORD
  // ==========================================
  const savePassword = async () => {
    setMessage("");
    setMessageType("");

    if (!userEmail) {
      setMessage("Your session has expired. Please login again.");
      setMessageType("error");
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await axios.post(
  "https://password-vault-and-credential-management-sku2.onrender.com/api/passwords",
  {
    website: website.trim(),
    username: username.trim(),
    password: password,
    notes: notes.trim(),
    userEmail: userEmail,
  }
);

      setMessage("Password saved successfully.");
      setMessageType("success");

      setWebsite("");
      setUsername("");
      setPassword("");
      setNotes("");

      await loadPasswords();
    } catch (error) {
      console.error("Save password error:", error);

      if (error.response) {
        if (error.response.status === 400) {
          setMessage(
            error.response.data?.message ||
              error.response.data ||
              "Invalid password details. Please check your input."
          );
        } else if (error.response.status === 401) {
          setMessage("Unauthorized. Please login again.");
        } else if (error.response.status === 403) {
          setMessage(
            "You are not authorized to save this credential."
          );
        } else if (error.response.status === 409) {
          setMessage("This credential already exists.");
        } else if (error.response.status >= 500) {
          setMessage(
            "Server error while saving the password. Please try again."
          );
        } else {
          setMessage(
            error.response.data?.message ||
              error.response.data ||
              "Failed to save password."
          );
        }
      } else {
        setMessage(
          "Unable to connect to the server. Please make sure Spring Boot is running."
        );
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE PASSWORD
  // ==========================================
  const deletePassword = async (id) => {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this password?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setMessageType("");

    try {
      setDeletingId(id);

      await axios.delete(
        `https://password-vault-and-credential-management-sku2.onrender.com/api/passwords/${id}`
      );

      setMessage("Password deleted successfully.");
      setMessageType("success");

      await loadPasswords();
    } catch (error) {
      console.error("Delete password error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Unauthorized. Please login again.");
        } else if (error.response.status === 403) {
          setMessage(
            "You are not authorized to delete this credential."
          );
        } else if (error.response.status === 404) {
          setMessage(
            "Credential not found. It may already be deleted."
          );
        } else if (error.response.status >= 500) {
          setMessage(
            "Server error while deleting the password."
          );
        } else {
          setMessage(
            error.response.data?.message ||
              error.response.data ||
              "Delete failed."
          );
        }
      } else {
        setMessage(
          "Unable to connect to the server. Please try again."
        );
      }

      setMessageType("error");
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // EDIT PASSWORD
  // ==========================================
  const editPassword = (item) => {
    setMessage("");
    setMessageType("");

    setEditId(item.id);

    setWebsite(item.website || "");
    setUsername(item.username || "");
    setPassword(item.password || "");
    setNotes(item.notes || "");

    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // UPDATE PASSWORD
  // ==========================================
  const updatePassword = async () => {
    setMessage("");
    setMessageType("");

    if (!editId) {
      setMessage("No credential selected for editing.");
      setMessageType("error");
      return;
    }

    if (!userEmail) {
      setMessage("Your session has expired. Please login again.");
      setMessageType("error");
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `https://password-vault-and-credential-management-sku2.onrender.com/api/passwords/${editId}`,
        {
          website: website.trim(),
          username: username.trim(),
          password: password,
          notes: notes.trim(),
          userEmail: userEmail,
        }
      );

      setMessage("Password updated successfully.");
      setMessageType("success");

      setWebsite("");
      setUsername("");
      setPassword("");
      setNotes("");

      setEditId(null);
      setIsEditing(false);

      await loadPasswords();
    } catch (error) {
      console.error("Update password error:", error);

      if (error.response) {
        if (error.response.status === 400) {
          setMessage(
            error.response.data?.message ||
              error.response.data ||
              "Invalid password details."
          );
        } else if (error.response.status === 401) {
          setMessage("Unauthorized. Please login again.");
        } else if (error.response.status === 403) {
          setMessage(
            "You are not authorized to update this credential."
          );
        } else if (error.response.status === 404) {
          setMessage(
            "Credential not found. It may have been deleted."
          );
        } else if (error.response.status >= 500) {
          setMessage(
            "Server error while updating the password."
          );
        } else {
          setMessage(
            error.response.data?.message ||
              error.response.data ||
              "Update failed."
          );
        }
      } else {
        setMessage(
          "Unable to connect to the server. Please make sure Spring Boot is running."
        );
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // COPY PASSWORD
  // ==========================================
  const copyPassword = async (passwordValue) => {
    try {
      await navigator.clipboard.writeText(passwordValue);

      setMessage("Password copied successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Copy failed:", error);

      setMessage(
        "Unable to copy password. Please check browser permissions."
      );
      setMessageType("error");
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================
  const cancelEdit = () => {
    setWebsite("");
    setUsername("");
    setPassword("");
    setNotes("");

    setEditId(null);
    setIsEditing(false);

    setMessage("");
    setMessageType("");
  };

  // ==========================================
  // FILTER PASSWORDS
  // ==========================================
  const filteredPasswords = passwords.filter(
    (item) =>
      (item.website || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.username || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          input::placeholder,
          textarea::placeholder {
            font-size: 13px;
            color: #777;
          }

          input:focus,
          textarea:focus {
            outline: none;
            border-color: #1565C0 !important;
            box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.12);
          }

          .vault-page {
            width: 90%;
            max-width: 900px;
            margin: 25px auto;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #333;
          }

          .vault-password-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            width: 100%;
          }

          .vault-password-input {
            flex: 1;
            min-width: 0;
          }

          .vault-generate-button {
            width: 140px;
            flex-shrink: 0;
          }

          .vault-message {
            width: 100%;
            padding: 10px 12px;
            border-radius: 6px;
            margin-bottom: 12px;
            font-size: 13px;
            line-height: 1.4;
          }

          .vault-message-success {
            background: #E8F5E9;
            border: 1px solid #81C784;
            color: #2E7D32;
          }

          .vault-message-error {
            background: #FFEBEE;
            border: 1px solid #EF9A9A;
            color: #C62828;
          }

          .vault-table-container {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #ddd;
            border-radius: 6px;
          }

          .vault-table {
            width: 100%;
            min-width: 700px;
            border-collapse: collapse;
            text-align: center;
            font-size: 13px;
          }

          .vault-action-button {
            white-space: nowrap;
          }

          .vault-loading {
            text-align: center;
            padding: 25px;
            color: #777;
            font-size: 14px;
          }

          .vault-empty {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 14px;
          }

          .password-strength {
            width: 100%;
            margin-top: -2px;
            margin-bottom: 10px;
            padding: 8px 10px;
            border-radius: 5px;
            font-size: 13px;
            font-weight: 600;
          }

          .password-strength-weak {
            background: #FFEBEE;
            border: 1px solid #EF9A9A;
            color: #C62828;
          }

          .password-strength-medium {
            background: #FFF8E1;
            border: 1px solid #FFD54F;
            color: #F57C00;
          }

          .password-strength-strong {
            background: #E8F5E9;
            border: 1px solid #81C784;
            color: #2E7D32;
          }

          @media (max-width: 900px) {
            .vault-page {
              width: 94%;
              margin: 20px auto;
            }
          }

          @media (max-width: 600px) {
            .vault-page {
              width: calc(100% - 24px);
              margin: 15px 12px;
            }

            .vault-title {
              font-size: 23px !important;
              line-height: 1.3;
              margin-bottom: 18px !important;
            }

            .vault-password-row {
              flex-direction: column;
              gap: 8px;
            }

            .vault-password-input {
              width: 100%;
              flex: none;
            }

            .vault-generate-button {
              width: 100%;
              height: 40px !important;
            }

            .vault-section-title {
              font-size: 20px !important;
            }

            .vault-table-container {
              border-radius: 6px;
            }

            .vault-table {
              min-width: 700px;
            }
          }

          @media (max-width: 400px) {
            .vault-page {
              width: calc(100% - 16px);
              margin: 10px 8px;
            }

            .vault-title {
              font-size: 20px !important;
            }

            .vault-section-title {
              font-size: 19px !important;
            }
          }
        `}
      </style>

      <div className="vault-page">

        {/* TITLE */}
        <h1
          className="vault-title"
          style={{
            textAlign: "center",
            color: "#1565C0",
            fontSize: "28px",
            marginBottom: "24px",
            fontWeight: "700",
          }}
        >
          🔐 SecureVault Password Manager
        </h1>

        {/* SUCCESS / ERROR MESSAGE */}
        {message && (
          <div
            className={`vault-message ${
              messageType === "success"
                ? "vault-message-success"
                : "vault-message-error"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* WEBSITE */}
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            height: "40px",
            padding: "8px 12px",
            marginBottom: "10px",
            border: "1px solid #bbb",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        />

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            height: "40px",
            padding: "8px 12px",
            marginBottom: "10px",
            border: "1px solid #bbb",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        />

        {/* PASSWORD + GENERATE */}
        <div className="vault-password-row">

          <input
            className="vault-password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              height: "40px",
              padding: "8px 12px",
              border: "1px solid #90CAF9",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          />

          <button
            className="vault-generate-button"
            type="button"
            onClick={generatePassword}
            disabled={loading}
            style={{
              height: "40px",
              background: loading ? "#9E9E9E" : "#43A047",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            🔑 Generate
          </button>

        </div>

        {/* PASSWORD STRENGTH */}
        {password && (
          <div
            className={`password-strength ${
              passwordStrength === "Strong"
                ? "password-strength-strong"
                : passwordStrength === "Medium"
                ? "password-strength-medium"
                : "password-strength-weak"
            }`}
          >
            {passwordStrength === "Strong" && "🟢"}
            {passwordStrength === "Medium" && "🟡"}
            {passwordStrength === "Weak" && "🔴"}

            {" "}Password Strength: {passwordStrength}
          </div>
        )}

        {/* PASSWORD REQUIREMENTS */}
        <div
          style={{
            background: "#FFF8E1",
            border: "1px solid #FFD54F",
            borderRadius: "6px",
            padding: "9px 12px",
            marginBottom: "10px",
            color: "#333",
            fontSize: "12px",
            lineHeight: "1.45",
          }}
        >
          <strong>Password Requirements</strong>

          <br />

          ✓ Minimum 8 characters

          <br />

          ✓ One Uppercase Letter (A-Z)

          <br />

          ✓ One Lowercase Letter (a-z)

          <br />

          ✓ One Number (0-9)

          <br />

          ✓ One Special Character (@, #, $, %, &, !)

          <br />

          <span
            style={{
              color: "#666",
              fontStyle: "italic",
            }}
          >
            These requirements are used to determine password strength.
            Weak and Medium passwords can still be saved.
          </span>
        </div>

        {/* NOTES */}
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            height: "65px",
            padding: "8px 12px",
            marginBottom: "10px",
            border: "1px solid #bbb",
            borderRadius: "6px",
            fontSize: "13px",
            resize: "vertical",
          }}
        />

        {/* SAVE / UPDATE */}
        <button
          type="button"
          onClick={
            isEditing
              ? updatePassword
              : savePassword
          }
          disabled={loading}
          style={{
            width: "100%",
            height: "40px",
            background: loading ? "#90A4AE" : "#1565C0",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update Password"
            : "Save Password"}
        </button>

        {/* CANCEL EDIT */}
        {isEditing && (
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            style={{
              width: "100%",
              height: "40px",
              marginTop: "10px",
              background: loading ? "#BDBDBD" : "#757575",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Cancel Edit
          </button>
        )}

        {/* DIVIDER */}
        <hr
          style={{
            margin: "35px 0 25px",
            border: "none",
            borderTop: "1px solid #ddd",
          }}
        />

        {/* SAVED CREDENTIALS */}
        <h2
          className="vault-section-title"
          style={{
            color: "#1565C0",
            fontSize: "24px",
            marginBottom: "15px",
          }}
        >
          Saved Credentials
        </h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search by Website or Username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            height: "40px",
            padding: "10px 12px",
            marginBottom: "18px",
            border: "1px solid #1565C0",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />

        {/* TABLE */}
        <div className="vault-table-container">

          <table className="vault-table">

            <thead>
              <tr
                style={{
                  background: "#1565C0",
                  color: "white",
                }}
              >
                <th style={{ padding: "10px" }}>
                  Website
                </th>

                <th style={{ padding: "10px" }}>
                  Username
                </th>

                <th style={{ padding: "10px" }}>
                  Password
                </th>

                <th style={{ padding: "10px" }}>
                  Notes
                </th>

                <th style={{ padding: "10px" }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {loadingPasswords ? (
                <tr>
                  <td
                    colSpan="5"
                    className="vault-loading"
                  >
                    Loading saved credentials...
                  </td>
                </tr>
              ) : (
                filteredPasswords.map((item) => (

                  <React.Fragment key={item.id}>

                    <tr
                      style={{
                        borderBottom: "1px solid #ddd",
                        background: "#fff",
                      }}
                    >

                      {/* WEBSITE */}
                      <td
                        style={{
                          padding: "10px",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.website}
                      </td>

                      {/* USERNAME */}
                      <td
                        style={{
                          padding: "10px",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.username}
                      </td>

                      {/* PASSWORD */}
                      <td style={{ padding: "10px" }}>
                        {showPasswordId === item.id
                          ? item.password
                          : "••••••••"}
                      </td>

                      {/* NOTES */}
                      <td
                        style={{
                          padding: "10px",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.notes}
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: "10px" }}>

                        {/* EDIT */}
                        <button
                          className="vault-action-button"
                          type="button"
                          onClick={() =>
                            editPassword(item)
                          }
                          disabled={deletingId !== null}
                          style={{
                            background: "#FFC107",
                            color: "#222",
                            border: "none",
                            padding: "5px 9px",
                            marginRight: "5px",
                            marginBottom: "4px",
                            borderRadius: "4px",
                            cursor:
                              deletingId !== null
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Edit
                        </button>

                        {/* COPY */}
                        <button
                          className="vault-action-button"
                          type="button"
                          onClick={() =>
                            copyPassword(item.password)
                          }
                          disabled={deletingId !== null}
                          style={{
                            background: "#43A047",
                            color: "white",
                            border: "none",
                            padding: "5px 9px",
                            marginRight: "5px",
                            marginBottom: "4px",
                            borderRadius: "4px",
                            cursor:
                              deletingId !== null
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Copy
                        </button>

                        {/* VIEW */}
                        <button
                          className="vault-action-button"
                          type="button"
                          onClick={() =>
                            setShowPasswordId(
                              showPasswordId === item.id
                                ? null
                                : item.id
                            )
                          }
                          disabled={deletingId !== null}
                          style={{
                            background: "#1976D2",
                            color: "white",
                            border: "none",
                            padding: "5px 9px",
                            marginRight: "5px",
                            marginBottom: "4px",
                            borderRadius: "4px",
                            cursor:
                              deletingId !== null
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "12px",
                          }}
                        >
                          👁{" "}
                          {showPasswordId === item.id
                            ? "Hide"
                            : "View"}
                        </button>

                        {/* SHARE */}
                        <button
                          className="vault-action-button"
                          type="button"
                          onClick={() =>
                            setSharingCredential(item)
                          }
                          disabled={deletingId !== null}
                          style={{
                            background: "#8E24AA",
                            color: "white",
                            border: "none",
                            padding: "5px 9px",
                            marginRight: "5px",
                            marginBottom: "4px",
                            borderRadius: "4px",
                            cursor:
                              deletingId !== null
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "12px",
                          }}
                        >
                          🔗 Share
                        </button>

                        {/* DELETE */}
                        <button
                          className="vault-action-button"
                          type="button"
                          onClick={() =>
                            deletePassword(item.id)
                          }
                          disabled={deletingId === item.id}
                          style={{
                            background:
                              deletingId === item.id
                                ? "#BDBDBD"
                                : "#E53935",
                            color: "white",
                            border: "none",
                            padding: "5px 9px",
                            marginBottom: "4px",
                            borderRadius: "4px",
                            cursor:
                              deletingId === item.id
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "12px",
                          }}
                        >
                          {deletingId === item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </td>

                    </tr>

                  </React.Fragment>

                ))
              )}

            </tbody>

          </table>

        </div>

        {/* NO RESULTS */}
        {!loadingPasswords &&
          filteredPasswords.length === 0 && (
            <div className="vault-empty">
              {search.trim()
                ? "No credentials match your search."
                : "No credentials found."}
            </div>
          )}

        {/* SHARE COMPONENT */}
        {sharingCredential && (
          <ShareCredential
            credential={sharingCredential}
            onClose={() =>
              setSharingCredential(null)
            }
          />
        )}

      </div>
    </>
  );
}

export default Vault;