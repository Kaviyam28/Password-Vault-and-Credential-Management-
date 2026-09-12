import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SecurityAlerts.css";

function SecurityAlerts() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // ERROR MESSAGE
  // ==========================================

  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // LOAD SECURITY ALERTS
  // ==========================================

  const fetchAlerts = async () => {
    if (!userEmail) {
      localStorage.removeItem("isLoggedIn");
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `https://password-vault-and-credential-management-4n8d.onrender.com/api/security/alerts/${encodeURIComponent(
          userEmail
        )}`
      );

      const alertData = Array.isArray(response.data)
        ? response.data
        : [];

      setAlerts(alertData);

    } catch (error) {
      console.error(
        "Error loading security alerts:",
        error
      );

      setAlerts([]);

      // ==========================================
      // ERROR HANDLING
      // ==========================================

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          setErrorMessage(
            "Invalid request. Please try again."
          );

        } else if (status === 401) {
          setErrorMessage(
            "Your session has expired. Please login again."
          );

          setTimeout(() => {
            localStorage.removeItem("userEmail");
            localStorage.removeItem("isLoggedIn");
            navigate("/");
          }, 1500);

        } else if (status === 403) {
          setErrorMessage(
            "You are not authorized to view security alerts."
          );

        } else if (status === 404) {
          setErrorMessage(
            "Security alert service or records were not found."
          );

        } else if (status >= 500) {
          setErrorMessage(
            "Server error. Please try again later."
          );

        } else {
          setErrorMessage(
            error.response.data?.message ||
              error.response.data ||
              "Unable to load security alerts."
          );
        }

      } else if (error.request) {
        setErrorMessage(
          "Unable to connect to the server. Please make sure the backend is running."
        );

      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again."
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
    if (!userEmail) {
      navigate("/");
      return;
    }

    fetchAlerts();
  }, [userEmail, navigate]);

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
    <div className="security-alerts-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="security-alerts-header">

        <h1>
          🚨 Security Alerts
        </h1>

        <button
          onClick={() => navigate("/home")}
          className="security-alerts-back-button"
        >
          ← Dashboard
        </button>

      </header>

      {/* ======================================
          MAIN CONTAINER
      ====================================== */}

      <section className="security-alerts-container">

        {/* ====================================
            ERROR MESSAGE
        ==================================== */}

        {errorMessage && (
          <div className="security-alerts-error">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* ====================================
            REFRESH BUTTON
        ==================================== */}

        {!loading && (
          <div className="security-alerts-refresh-container">

            <button
              onClick={fetchAlerts}
              disabled={loading}
              className="security-alerts-refresh-button"
            >
              🔄 Refresh Alerts
            </button>

          </div>
        )}

        {/* ====================================
            LOADING
        ==================================== */}

        {loading ? (

          <p className="security-alerts-no-data">
            Loading security alerts...
          </p>

        ) : errorMessage ? (

          <p className="security-alerts-no-data">
            Unable to display security alerts.
          </p>

        ) : alerts.length === 0 ? (

          <p className="security-alerts-no-data">
            No security alerts found.
          </p>

        ) : (

          /* ==================================
             ALERT LIST
          ================================== */

          alerts.map((alert) => (

            <div
              key={alert.id}
              className="security-alert-card"
            >

              <h2>
                🚨 {alert.alertType || "Security Alert"}
              </h2>

              <p>
                <strong>Message:</strong>{" "}
                {alert.message || "-"}
              </p>

              <p>
                <strong>Severity:</strong>{" "}
                <span className="security-alert-high">
                  {alert.severity || "-"}
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {alert.status || "-"}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {alert.createdAt
                  ? new Date(
                      alert.createdAt
                    ).toLocaleString()
                  : "-"}
              </p>

            </div>

          ))
        )}

      </section>

      {/* ======================================
          RESPONSIVE ERROR / REFRESH STYLES
      ====================================== */}

      <style>
        {`

          .security-alerts-error {
            width: 100%;
            box-sizing: border-box;
            padding: 12px 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            background: #ffebee;
            color: #c62828;
            border: 1px solid #ef9a9a;
            font-size: 14px;
            line-height: 1.5;
            overflow-wrap: anywhere;
          }

          .security-alerts-refresh-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
          }

          .security-alerts-refresh-button {
            padding: 10px 18px;
            background: #1565c0;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          }

          .security-alerts-refresh-button:hover {
            opacity: 0.9;
          }

          .security-alerts-refresh-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .security-alerts-page {
            overflow-x: hidden;
          }

          .security-alerts-container {
            max-width: 100%;
            overflow-x: hidden;
          }

          @media (max-width: 600px) {

            .security-alerts-refresh-container {
              justify-content: stretch;
            }

            .security-alerts-refresh-button {
              width: 100%;
              min-height: 42px;
            }

            .security-alerts-error {
              font-size: 13px;
              padding: 11px 12px;
            }

          }

        `}
      </style>

    </div>
  );
}

export default SecurityAlerts;