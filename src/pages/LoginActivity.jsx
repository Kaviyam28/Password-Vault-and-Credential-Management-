import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function LoginActivity() {
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  const [searchParams] = useSearchParams();

  // ==========================================
  // LOGIN STATUS FILTER
  // ==========================================

  const statusFilter = searchParams.get("status");

  const [loginActivities, setLoginActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // ERROR / SUCCESS MESSAGE
  // ==========================================

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ==========================================
  // SHOW MESSAGE
  // ==========================================

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // ==========================================
  // LOAD LOGIN ACTIVITY
  // ==========================================

  const fetchLoginActivities = async () => {
    if (!userEmail) {
      localStorage.removeItem("isLoggedIn");
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const response = await axios.get(
        `http://localhost:8080/api/login-activity/${encodeURIComponent(
          userEmail
        )}`
      );

      const activities = Array.isArray(response.data)
        ? response.data
        : [];

      // ==========================================
      // FILTER LOGIN ACTIVITY
      // ==========================================

      if (
        statusFilter &&
        (
          statusFilter.toUpperCase() === "SUCCESS" ||
          statusFilter.toUpperCase() === "FAILED"
        )
      ) {
        const filteredActivities = activities.filter(
          (activity) =>
            activity.status &&
            activity.status.toUpperCase() ===
              statusFilter.toUpperCase()
        );

        setLoginActivities(filteredActivities);
      } else {
        // Show all login activities
        setLoginActivities(activities);
      }

    } catch (error) {
      console.error(
        "Error loading login activity:",
        error
      );

      setLoginActivities([]);

      // ==========================================
      // ERROR HANDLING
      // ==========================================

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          showMessage(
            "Invalid request. Please try again.",
            "error"
          );
        } else if (status === 401) {
          showMessage(
            "Your session has expired. Please login again.",
            "error"
          );

          setTimeout(() => {
            localStorage.removeItem("userEmail");
            localStorage.removeItem("isLoggedIn");
            navigate("/");
          }, 1200);

        } else if (status === 403) {
          showMessage(
            "You are not authorized to view login activity.",
            "error"
          );
        } else if (status === 404) {
          showMessage(
            "Login activity service or records were not found.",
            "error"
          );
        } else if (status >= 500) {
          showMessage(
            "Server error. Please try again later.",
            "error"
          );
        } else {
          showMessage(
            error.response.data?.message ||
              error.response.data ||
              "Unable to load login activity.",
            "error"
          );
        }

      } else if (error.request) {
        showMessage(
          "Unable to connect to the server. Please make sure the backend is running.",
          "error"
        );

      } else {
        showMessage(
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchLoginActivities();
  }, [statusFilter]);

  // ==========================================
  // PAGE TITLE
  // ==========================================

  const getPageTitle = () => {
    if (
      statusFilter &&
      statusFilter.toUpperCase() === "SUCCESS"
    ) {
      return "Successful Login Activity";
    }

    if (
      statusFilter &&
      statusFilter.toUpperCase() === "FAILED"
    ) {
      return "Failed Login Activity";
    }

    return "Login Activity";
  };

  // ==========================================
  // PAGE DESCRIPTION
  // ==========================================

  const getPageDescription = () => {
    if (
      statusFilter &&
      statusFilter.toUpperCase() === "SUCCESS"
    ) {
      return "Showing only successfully authenticated login attempts.";
    }

    if (
      statusFilter &&
      statusFilter.toUpperCase() === "FAILED"
    ) {
      return "Showing only failed authentication attempts.";
    }

    return "Showing all login attempts recorded for your account.";
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "-";
    }

    return formattedDate.toLocaleString();
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    if (
      status &&
      status.toUpperCase() === "SUCCESS"
    ) {
      return {
        color: "green",
        fontWeight: "bold"
      };
    }

    return {
      color: "red",
      fontWeight: "bold"
    };
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");

    navigate("/");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ======================================
          HEADER
      ====================================== */}

      <header
        style={{
          ...styles.header,
        }}
        className="login-activity-header"
      >

        <div className="login-activity-header-title">
          <h1 style={styles.logo}>
            🔐 SecureVault
          </h1>

          <p style={styles.subtitle}>
            {getPageTitle()}
          </p>
        </div>

        <div
          style={styles.headerButtons}
          className="login-activity-header-buttons"
        >

          <button
            onClick={() => navigate("/home")}
            style={styles.dashboardButton}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main
        style={styles.container}
        className="login-activity-container"
      >

        <div
          style={styles.card}
          className="login-activity-card"
        >

          {/* ==================================
              TITLE
          ================================== */}

          <div
            style={styles.titleRow}
            className="login-activity-title-row"
          >

            <div className="login-activity-title-content">

              <h2 style={styles.title}>
                🔐 {getPageTitle()}
              </h2>

              <p style={styles.emailText}>
                {getPageDescription()}
              </p>

              <p
                style={{
                  ...styles.emailText,
                  wordBreak: "break-word"
                }}
              >
                Account:{" "}
                <strong>{userEmail}</strong>
              </p>

            </div>

            <button
              onClick={fetchLoginActivities}
              style={{
                ...styles.refreshButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer"
              }}
              disabled={loading}
              className="login-activity-refresh-button"
            >
              {loading
                ? "Refreshing..."
                : "🔄 Refresh"}
            </button>

          </div>

          {/* ==================================
              ERROR / SUCCESS MESSAGE
          ================================== */}

          {message && (
            <div
              className={
                messageType === "success"
                  ? "login-activity-message login-activity-success"
                  : "login-activity-message login-activity-error"
              }
            >
              {message}
            </div>
          )}

          {/* ==================================
              ACTIVE FILTER
          ================================== */}

          {statusFilter &&
            statusFilter.toUpperCase() ===
              "SUCCESS" && (

            <div style={styles.successFilter}>
              ✅ Showing Successful Logins Only
            </div>

          )}

          {statusFilter &&
            statusFilter.toUpperCase() ===
              "FAILED" && (

            <div style={styles.failedFilter}>
              ❌ Showing Failed Logins Only
            </div>

          )}

          {/* ==================================
              BACK TO ALL LOGIN ACTIVITY
          ================================== */}

          {statusFilter && (
            <button
              onClick={() =>
                navigate("/login-activity")
              }
              style={styles.allLoginButton}
            >
              ← View All Login Activity
            </button>
          )}

          {/* ==================================
              LOADING
          ================================== */}

          {loading && (
            <div style={styles.message}>
              Loading login activity...
            </div>
          )}

          {/* ==================================
              NO DATA
          ================================== */}

          {!loading &&
            loginActivities.length === 0 && (
              <div style={styles.message}>

                {statusFilter &&
                statusFilter.toUpperCase() ===
                  "SUCCESS"
                  ? "No successful login activity found."
                  : statusFilter &&
                    statusFilter.toUpperCase() ===
                      "FAILED"
                  ? "No failed login activity found."
                  : "No login activity found."}

              </div>
            )}

          {/* ==================================
              LOGIN ACTIVITY TABLE
          ================================== */}

          {!loading &&
            loginActivities.length > 0 && (

              <div
                style={styles.tableContainer}
                className="login-activity-table-container"
              >

                <table
                  style={styles.table}
                  className="login-activity-table"
                >

                  <thead>

                    <tr>

                      <th style={styles.th}>
                        Status
                      </th>

                      <th style={styles.th}>
                        Date & Time
                      </th>

                      <th style={styles.th}>
                        IP Address
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {loginActivities.map(
                      (activity) => (

                        <tr
                          key={activity.id}
                          style={styles.tr}
                        >

                          {/* STATUS */}

                          <td style={styles.td}>

                            <span
                              style={getStatusStyle(
                                activity.status
                              )}
                            >

                              {activity.status &&
                              activity.status.toUpperCase() ===
                                "SUCCESS"
                                ? "✓ SUCCESS"
                                : "✗ FAILED"}

                            </span>

                          </td>

                          {/* DATE */}

                          <td style={styles.td}>
                            {formatDate(
                              activity.timestamp
                            )}
                          </td>

                          {/* IP */}

                          <td style={styles.td}>
                            {activity.ipAddress ||
                              "-"}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

        </div>

      </main>

      {/* ======================================
          RESPONSIVE CSS
      ====================================== */}

      <style>
        {`

          * {
            box-sizing: border-box;
          }

          .login-activity-header {
            width: 100%;
          }

          .login-activity-header-title {
            min-width: 0;
          }

          .login-activity-header-buttons {
            flex-shrink: 0;
          }

          .login-activity-container {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          .login-activity-card {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }

          .login-activity-title-content {
            min-width: 0;
          }

          .login-activity-title-content h2 {
            overflow-wrap: anywhere;
          }

          .login-activity-table-container {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .login-activity-table {
            min-width: 650px;
          }

          .login-activity-message {
            width: 100%;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 14px;
            line-height: 1.5;
            overflow-wrap: anywhere;
          }

          .login-activity-error {
            background: #ffebee;
            color: #c62828;
            border: 1px solid #ef9a9a;
          }

          .login-activity-success {
            background: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #a5d6a7;
          }

          /* ==================================
             TABLET
          ================================== */

          @media (max-width: 900px) {

            .login-activity-header {
              padding: 18px 22px !important;
            }

            .login-activity-container {
              padding: 22px !important;
            }

            .login-activity-card {
              padding: 22px !important;
            }

            .login-activity-title-row {
              align-items: flex-start !important;
              gap: 15px;
            }

            .login-activity-table th,
            .login-activity-table td {
              white-space: nowrap;
            }

          }

          /* ==================================
             MOBILE
          ================================== */

          @media (max-width: 600px) {

            .login-activity-header {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 15px !important;
              padding: 15px !important;
            }

            .login-activity-header-title {
              width: 100%;
            }

            .login-activity-header-buttons {
              width: 100%;
              display: flex !important;
              gap: 8px !important;
            }

            .login-activity-header-buttons button {
              flex: 1;
              min-width: 0;
              padding: 10px 8px !important;
              font-size: 13px;
            }

            .login-activity-container {
              padding: 12px !important;
            }

            .login-activity-card {
              padding: 16px !important;
              border-radius: 12px !important;
            }

            .login-activity-title-row {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 12px !important;
            }

            .login-activity-title-content {
              width: 100%;
            }

            .login-activity-refresh-button {
              width: 100%;
              padding: 11px !important;
            }

            .login-activity-table {
              min-width: 600px;
            }

            .login-activity-table th,
            .login-activity-table td {
              padding: 11px !important;
              font-size: 13px !important;
            }

          }

          /* ==================================
             SMALL MOBILE
          ================================== */

          @media (max-width: 400px) {

            .login-activity-header {
              padding: 12px !important;
            }

            .login-activity-header-buttons {
              flex-direction: column !important;
            }

            .login-activity-header-buttons button {
              width: 100%;
            }

            .login-activity-container {
              padding: 8px !important;
            }

            .login-activity-card {
              padding: 12px !important;
            }

            .login-activity-table {
              min-width: 560px;
            }

            .login-activity-table th,
            .login-activity-table td {
              padding: 9px !important;
              font-size: 12px !important;
            }

          }

        `}
      </style>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#f3f6fa",
    fontFamily: "Arial, sans-serif",
    color: "#222",
    overflowX: "hidden"
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 35px",
    background: "white",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)"
  },

  logo: {
    margin: 0,
    color: "#1565C0",
    fontSize: "28px"
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#666",
    fontSize: "16px"
  },

  headerButtons: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  dashboardButton: {
    background: "#1565C0",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  logoutButton: {
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 22px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  // ========================================
  // MAIN CONTAINER
  // ========================================

  container: {
    padding: "35px"
  },

  // ========================================
  // CARD
  // ========================================

  card: {
    background: "white",
    borderRadius: "15px",
    padding: "30px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.10)"
  },

  // ========================================
  // TITLE
  // ========================================

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    margin: 0,
    color: "#1565C0",
    fontSize: "25px"
  },

  emailText: {
    marginTop: "8px",
    color: "#666",
    lineHeight: "1.5"
  },

  // ========================================
  // REFRESH BUTTON
  // ========================================

  refreshButton: {
    background: "#1565C0",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "11px 20px",
    fontWeight: "bold"
  },

  // ========================================
  // FILTER MESSAGE
  // ========================================

  successFilter: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontWeight: "bold"
  },

  failedFilter: {
    background: "#ffebee",
    color: "#c62828",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontWeight: "bold"
  },

  // ========================================
  // ALL LOGIN ACTIVITY BUTTON
  // ========================================

  allLoginButton: {
    background: "#eeeeee",
    color: "#333",
    border: "none",
    borderRadius: "7px",
    padding: "10px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "20px"
  },

  // ========================================
  // TABLE
  // ========================================

  tableContainer: {
    width: "100%",
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    background: "#1976D2",
    color: "white",
    padding: "14px",
    textAlign: "center",
    fontWeight: "bold"
  },

  td: {
    padding: "14px",
    borderBottom:
      "1px solid #ddd",
    textAlign: "center",
    fontSize: "14px"
  },

  tr: {
    background: "white"
  },

  // ========================================
  // MESSAGE
  // ========================================

  message: {
    textAlign: "center",
    padding: "50px 20px",
    color: "#777",
    fontSize: "16px"
  }

};

export default LoginActivity;