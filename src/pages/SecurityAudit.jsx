import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SecurityAudit.css";

function SecurityAudit() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      navigate("/");
      return;
    }

    fetchAuditLogs();
  }, [userEmail, navigate]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8080/api/security/audit/${encodeURIComponent(
          userEmail
        )}`
      );

      setLogs(response.data || []);
    } catch (error) {
      console.error(
        "Error loading security audit logs:",
        error
      );

      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-audit-page">

      <header className="security-audit-header">
        <h1>📋 Security Audit Logs</h1>

        <button
          onClick={() => navigate("/home")}
          className="security-audit-back-button"
        >
          ← Dashboard
        </button>
      </header>

      <section className="security-audit-container">

        {loading ? (
          <p className="security-audit-no-data">
            Loading security audit logs...
          </p>
        ) : logs.length === 0 ? (
          <p className="security-audit-no-data">
            No security audit logs found.
          </p>
        ) : (
          <div className="security-audit-table-wrapper">

            <table className="security-audit-table">

              <thead>
                <tr>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Date &amp; Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>

                    <td>
                      {log.action}
                    </td>

                    <td>
                      {log.description}
                    </td>

                    <td>
                      {new Date(
                        log.timestamp
                      ).toLocaleString()}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default SecurityAudit;