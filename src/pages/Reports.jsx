import axios from "axios";
import { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
  const [passwordHealth, setPasswordHealth] = useState(null);
  const [totalLogins, setTotalLogins] = useState(0);
  const [successfulLogins, setSuccessfulLogins] = useState(0);
  const [failedLogins, setFailedLogins] = useState(0);
  const [recentLogins, setRecentLogins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  // ==========================================
  // LOAD REPORTS
  // ==========================================

  const loadReports = async () => {
    if (!userEmail) {
      setError("User email not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const encodedEmail = encodeURIComponent(userEmail);

      const [
        passwordHealthResponse,
        totalResponse,
        successfulResponse,
        failedResponse,
        recentResponse,
      ] = await Promise.all([
        axios.get(
          `https://password-vault-and-credential-management-sku2.onrender.com/api/reports/password-health/${encodedEmail}`
        ),

        axios.get(
          `https://password-vault-and-credential-management-sku2.onrender.com/api/reports/login-activity/total/${encodedEmail}`
        ),

        axios.get(
          `https://password-vault-and-credential-management-sku2.onrender.com/api/reports/login-activity/successful/${encodedEmail}`
        ),

        axios.get(
          `https://password-vault-and-credential-management-sku2.onrender.com/api/reports/login-activity/failed/${encodedEmail}`
        ),

        axios.get(
          `https://password-vault-and-credential-management-sku2.onrender.com/api/reports/login-activity/recent/${encodedEmail}`
        ),
      ]);

      // Password health
      setPasswordHealth(passwordHealthResponse.data);

      // Login counts
      setTotalLogins(totalResponse.data);
      setSuccessfulLogins(successfulResponse.data);
      setFailedLogins(failedResponse.data);

      // Recent activity
      setRecentLogins(recentResponse.data || []);
    } catch (err) {
      console.error("Error loading reports:", err);

      if (err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to load reports."
        );
      } else {
        setError(
          "Unable to load reports. Please make sure the Spring Boot server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD REPORTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadReports();
  }, []);

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="reports-page reports-loading">
        <h2>Loading Reports...</h2>
      </div>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {
    return (
      <div className="reports-page reports-error-page">
        <div className="reports-error-box">
          {error}
        </div>

        <button
          onClick={loadReports}
          className="reports-retry-button"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // ==========================================
  // MAIN REPORT PAGE
  // ==========================================

  return (
    <div className="reports-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="reports-header">
        <div className="reports-header-content">
          <h1>📊 Security Reports</h1>

          <p>
            Security and password health reports for{" "}
            <strong>{userEmail}</strong>
          </p>
        </div>

        <button
          onClick={loadReports}
          className="reports-refresh-button"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ==========================================
          PASSWORD HEALTH
      ========================================== */}

      <div className="report-section">
        <h2>🔐 Password Health</h2>

        <div className="password-health-grid">

          {/* TOTAL CREDENTIALS */}

          <div className="health-card total-card">
            <h3>Total Credentials</h3>

            <h1>
              {passwordHealth?.totalCredentials ?? 0}
            </h1>
          </div>

          {/* STRONG */}

          <div className="health-card strong-card">
            <h3>💪 Strong</h3>

            <h1>
              {passwordHealth?.strong ?? 0}
            </h1>
          </div>

          {/* MEDIUM */}

          <div className="health-card medium-card">
            <h3>⚠️ Medium</h3>

            <h1>
              {passwordHealth?.medium ?? 0}
            </h1>
          </div>

          {/* WEAK */}

          <div className="health-card weak-card">
            <h3>❌ Weak</h3>

            <h1>
              {passwordHealth?.weak ?? 0}
            </h1>
          </div>

          {/* HEALTH SCORE */}

          <div className="health-card score-card">
            <h3>🛡️ Health Score</h3>

            <h1>
              {passwordHealth?.healthScore ?? 0}%
            </h1>
          </div>

        </div>
      </div>

      {/* ==========================================
          LOGIN REPORT
      ========================================== */}

      <div className="report-section">
        <h2>🔑 Login Activity Report</h2>

        <div className="login-report-grid">

          {/* TOTAL */}

          <div className="login-card total-login-card">
            <h3>🔐 Total Login Attempts</h3>

            <h1>
              {totalLogins}
            </h1>
          </div>

          {/* SUCCESSFUL */}

          <div className="login-card successful-login-card">
            <h3>✅ Successful Logins</h3>

            <h1>
              {successfulLogins}
            </h1>
          </div>

          {/* FAILED */}

          <div className="login-card failed-login-card">
            <h3>❌ Failed Logins</h3>

            <h1>
              {failedLogins}
            </h1>
          </div>

        </div>
      </div>

      {/* ==========================================
          RECENT LOGIN ACTIVITY
      ========================================== */}

      <div className="report-section recent-login-section">
        <h2>🕒 Recent Login Activity</h2>

        {recentLogins.length === 0 ? (
          <p className="no-login-data">
            No login activity found.
          </p>
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>IP Address</th>
                  <th>Failure Reason</th>
                </tr>
              </thead>

              <tbody>
                {recentLogins.map((activity) => (
                  <tr key={activity.id}>

                    <td
                      className={
                        activity.status === "SUCCESS"
                          ? "status-success"
                          : "status-failed"
                      }
                    >
                      {activity.status === "SUCCESS"
                        ? "✓ SUCCESS"
                        : "✕ FAILED"}
                    </td>

                    <td>
                      {activity.timestamp
                        ? new Date(
                            activity.timestamp
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      {activity.ipAddress || "-"}
                    </td>

                    <td className="failure-reason">
                      {activity.failureReason || "-"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default Reports;