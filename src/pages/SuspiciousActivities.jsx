import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuspiciousActivities.css";

function SuspiciousActivities() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // LOAD SUSPICIOUS ACTIVITIES
  // ==========================================

  const fetchActivities = async () => {
    if (!userEmail) {
      localStorage.removeItem("isLoggedIn");
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `https://password-vault-and-credential-management-sku2.onrender.com/api/security/suspicious/${encodeURIComponent(
          userEmail
        )}`
      );

      const activityData = Array.isArray(response.data)
        ? response.data
        : [];

      setActivities(activityData);

    } catch (error) {
      console.error(
        "Error loading suspicious activities:",
        error
      );

      setActivities([]);

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
            "You are not authorized to view suspicious activities."
          );

        } else if (status === 404) {
          setErrorMessage(
            "Suspicious activity service or records were not found."
          );

        } else if (status >= 500) {
          setErrorMessage(
            "Server error. Please try again later."
          );

        } else {
          setErrorMessage(
            error.response.data?.message ||
              error.response.data ||
              "Unable to load suspicious activities."
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

    fetchActivities();
  }, [userEmail, navigate]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString();
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="suspicious-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="suspicious-header">

        <h1>
          ⚠️ Suspicious Activities
        </h1>

        <button
          onClick={() => navigate("/home")}
          className="suspicious-back-button"
        >
          ← Dashboard
        </button>

      </header>

      {/* ======================================
          MAIN CONTAINER
      ====================================== */}

      <section className="suspicious-container">

        {/* ERROR MESSAGE */}

        {errorMessage && (
          <div className="suspicious-error">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* REFRESH BUTTON */}

        {!loading && (
          <div className="suspicious-refresh-container">

            <button
              onClick={fetchActivities}
              disabled={loading}
              className="suspicious-refresh-button"
            >
              🔄 Refresh Activities
            </button>

          </div>
        )}

        {/* LOADING */}

        {loading ? (

          <p className="suspicious-no-data">
            Loading suspicious activities...
          </p>

        ) : errorMessage ? (

          <p className="suspicious-no-data">
            Unable to display suspicious activities.
          </p>

        ) : activities.length === 0 ? (

          <p className="suspicious-no-data">
            No suspicious activities found.
          </p>

        ) : (

          activities.map((activity) => (

            <div
              key={activity.id}
              className="suspicious-card"
            >

              <h2>
                ⚠️{" "}
                {activity.activityType ||
                  "Suspicious Activity"}
              </h2>

              <p>
                <strong>Description:</strong>{" "}
                {activity.description || "-"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="suspicious-flagged">
                  {activity.status || "-"}
                </span>
              </p>

              <p>
                <strong>Detected:</strong>{" "}
                {formatDate(activity.detectedAt)}
              </p>

            </div>

          ))
        )}

      </section>

    </div>
  );
}

export default SuspiciousActivities;