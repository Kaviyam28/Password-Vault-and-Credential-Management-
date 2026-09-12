import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {

  const [receivedCredentials, setReceivedCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Actions dropdown
  const [actionsOpen, setActionsOpen] = useState(false);

  // Current section
  const [activeSection, setActiveSection] = useState("shared");

  // ==============================
  // REPORT STATES
  // ==============================

  const [passwordHealth, setPasswordHealth] = useState(null);
  const [loginReport, setLoginReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  // ==============================
  // Load Shared Credentials
  // ==============================

  const loadSharedCredentials = async () => {

    if (!userEmail) {
      setError("User email not found. Please login again.");
      setLoading(false);
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://password-vault-and-credential-management-4n8d.onrender.com/api/sharing/received/${encodeURIComponent(
          userEmail
        )}`
      );

      setReceivedCredentials(response.data || []);

    } catch (err) {

      console.error("Error loading shared credentials:", err);

      if (err.response) {

        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Failed to load shared credentials"
        );

      } else {

        setError("Cannot connect to Spring Boot server.");

      }

    } finally {

      setLoading(false);

    }
  };

  // ==============================
  // Load Reports
  // ==============================

  const loadReports = async () => {

    if (!userEmail) {
      setReportError("User email not found. Please login again.");
      return;
    }

    try {

      setReportLoading(true);
      setReportError("");

      const [passwordResponse, loginResponse] =
        await Promise.all([

          axios.get(
            `https://password-vault-and-credential-management-4n8d.onrender.com/api/reports/password-health/${encodeURIComponent(
              userEmail
            )}`
          ),

          axios.get(
            `https://password-vault-and-credential-management-4n8d.onrender.com/api/reports/login-activity/${encodeURIComponent(
              userEmail
            )}`
          )

        ]);

      setPasswordHealth(passwordResponse.data);
      setLoginReport(loginResponse.data);

    } catch (err) {

      console.error("Error loading reports:", err);

      setReportError(
        "Unable to load security reports. Please check the Spring Boot server."
      );

    } finally {

      setReportLoading(false);

    }
  };

  // ==============================
  // Initial Load
  // ==============================

  useEffect(() => {

    loadSharedCredentials();

  }, []);

  // ==============================
  // Open Credential
  // ==============================

  const openCredential = async (sharingId) => {

    try {

      const response = await axios.get(
        `https://password-vault-and-credential-management-4n8d.onrender.com/api/sharing/open/${sharingId}`
      );

      const credential = response.data;

      alert(
        `Website: ${credential.website}\n\n` +
        `Username: ${credential.username}\n\n` +
        `Password: ${credential.password}\n\n` +
        `Notes: ${credential.notes || "No notes"}`
      );

    } catch (err) {

      console.error("Error opening credential:", err);

      if (err.response) {

        alert(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to open credential"
        );

      } else {

        alert("Cannot connect to Spring Boot server.");

      }

    }
  };

  // ==============================
  // Actions Menu
  // ==============================

  const handleAction = (section) => {

    setActiveSection(section);
    setActionsOpen(false);

    // Load reports when Reports is selected
    if (section === "reports") {
      loadReports();
    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "35px",
      }}
    >

      {/* ==============================
          HEADER
      ============================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>

          <h1
            style={{
              color: "#1565C0",
              margin: 0,
            }}
          >
            Dashboard
          </h1>

          <p style={{ color: "#555" }}>
            Logged in as: <strong>{userEmail}</strong>
          </p>

        </div>

        {/* ==============================
            ACTIONS DROPDOWN
        ============================== */}

        <div
          style={{
            position: "relative",
          }}
        >

          <button
            onClick={() => setActionsOpen(!actionsOpen)}
            style={{
              background: "#1565C0",
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              minWidth: "150px",
            }}
          >
            Actions {actionsOpen ? "▲" : "▼"}
          </button>

          {actionsOpen && (

            <div
              style={{
                position: "absolute",
                top: "50px",
                right: 0,
                width: "220px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                overflow: "hidden",
                zIndex: 1000,
              }}
            >

              {/* Shared With Me */}

              <div
                onClick={() => handleAction("shared")}
                style={{
                  padding: "15px",
                  cursor: "pointer",
                  color: "#333",
                  borderBottom: "1px solid #eee",
                  fontWeight:
                    activeSection === "shared"
                      ? "600"
                      : "400",
                  background:
                    activeSection === "shared"
                      ? "#eaf3ff"
                      : "white",
                }}
              >
                🔑 Shared With Me
              </div>

              {/* Login Activity */}

              <div
                onClick={() => handleAction("login")}
                style={{
                  padding: "15px",
                  cursor: "pointer",
                  color: "#333",
                  borderBottom: "1px solid #eee",
                  fontWeight:
                    activeSection === "login"
                      ? "600"
                      : "400",
                  background:
                    activeSection === "login"
                      ? "#eaf3ff"
                      : "white",
                }}
              >
                🔐 Login Activity
              </div>

              {/* Reports */}

              <div
                onClick={() => handleAction("reports")}
                style={{
                  padding: "15px",
                  cursor: "pointer",
                  color: "#333",
                  fontWeight:
                    activeSection === "reports"
                      ? "600"
                      : "400",
                  background:
                    activeSection === "reports"
                      ? "#eaf3ff"
                      : "white",
                }}
              >
                📊 Security Reports
              </div>

            </div>

          )}

        </div>

      </div>


      {/* ==================================================
          SHARED WITH ME SECTION
      ================================================== */}

      {activeSection === "shared" && (

        <div>

          <div
            style={{
              background: "white",
              padding: "20px 25px",
              borderRadius: "12px",
              marginBottom: "20px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >

            <h2
              style={{
                color: "#1565C0",
                margin: 0,
              }}
            >
              🔑 Shared With Me
            </h2>

            <p
              style={{
                color: "#777",
                marginBottom: 0,
              }}
            >
              Credentials shared with your account.
            </p>

          </div>


          {/* Refresh */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >

            <button
              onClick={loadSharedCredentials}
              style={{
                background: "#1565C0",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🔄 Refresh
            </button>

          </div>


          {/* Loading */}

          {loading && (

            <div
              style={{
                background: "white",
                padding: "40px",
                textAlign: "center",
                borderRadius: "12px",
              }}
            >
              Loading shared credentials...
            </div>

          )}


          {/* Error */}

          {!loading && error && (

            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>

          )}


          {/* No Credentials */}

          {!loading &&
            !error &&
            receivedCredentials.length === 0 && (

              <div
                style={{
                  background: "white",
                  padding: "40px",
                  textAlign: "center",
                  borderRadius: "12px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
                }}
              >

                <h2 style={{ color: "#444" }}>
                  No Shared Credentials
                </h2>

                <p style={{ color: "#777" }}>
                  Nobody has shared a credential with you yet.
                </p>

              </div>

            )}


          {/* Shared Credentials */}

          {!loading &&
            receivedCredentials.length > 0 && (

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >

                {receivedCredentials.map((item) => (

                  <div
                    key={item.id}
                    style={{
                      background: "white",
                      padding: "25px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 3px 12px rgba(0,0,0,0.1)",
                    }}
                  >

                    <h2 style={{ color: "#1565C0" }}>
                      🔗 Shared Credential
                    </h2>

                    <p>
                      <strong>From:</strong>{" "}
                      {item.ownerEmail}
                    </p>

                    <p>
                      <strong>Permission:</strong>{" "}
                      {item.permission}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {item.active
                        ? "Active"
                        : "Inactive"}
                    </p>

                    <p>
                      <strong>Expires:</strong>{" "}
                      {item.expiresAt
                        ? new Date(
                            item.expiresAt
                          ).toLocaleString()
                        : "No expiry"}
                    </p>

                    <button
                      onClick={() =>
                        openCredential(item.id)
                      }
                      disabled={!item.active}
                      style={{
                        width: "100%",
                        marginTop: "15px",
                        padding: "12px",
                        background: item.active
                          ? "#1565C0"
                          : "#999",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: item.active
                          ? "pointer"
                          : "not-allowed",
                        fontWeight: "600",
                      }}
                    >
                      {item.active
                        ? "🔓 Open Vault"
                        : "Sharing Inactive"}
                    </button>

                  </div>

                ))}

              </div>

            )}

        </div>

      )}


      {/* ==================================================
          LOGIN ACTIVITY SECTION
      ================================================== */}

      {activeSection === "login" && (

        <div>

          <div
            style={{
              background: "white",
              padding: "20px 25px",
              borderRadius: "12px",
              marginBottom: "20px",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >

            <h2
              style={{
                color: "#1565C0",
                margin: 0,
              }}
            >
              🔐 Login Activity
            </h2>

            <p
              style={{
                color: "#777",
                marginBottom: 0,
              }}
            >
              View your recent login activity.
            </p>

          </div>


          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.1)",
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >

              <thead>

                <tr
                  style={{
                    background: "#1976D2",
                    color: "white",
                  }}
                >

                  <th style={{ padding: "14px" }}>
                    Status
                  </th>

                  <th style={{ padding: "14px" }}>
                    Date & Time
                  </th>

                  <th style={{ padding: "14px" }}>
                    IP Address
                  </th>

                  <th style={{ padding: "14px" }}>
                    Failure Reason
                  </th>

                </tr>

              </thead>


              <tbody>

                {loginReport &&
                loginReport.recentActivities &&
                loginReport.recentActivities.length > 0 ? (

                  loginReport.recentActivities.map(
                    (activity) => (

                      <tr key={activity.id}>

                        <td
                          style={{
                            padding: "14px",
                            textAlign: "center",
                            color:
                              activity.status ===
                              "SUCCESS"
                                ? "green"
                                : "#e53935",
                            fontWeight: "600",
                            borderBottom:
                              "1px solid #ddd",
                          }}
                        >
                          {activity.status ===
                          "SUCCESS"
                            ? "✓ SUCCESS"
                            : "✕ FAILED"}
                        </td>

                        <td
                          style={{
                            padding: "14px",
                            textAlign: "center",
                            borderBottom:
                              "1px solid #ddd",
                          }}
                        >
                          {new Date(
                            activity.timestamp
                          ).toLocaleString()}
                        </td>

                        <td
                          style={{
                            padding: "14px",
                            textAlign: "center",
                            borderBottom:
                              "1px solid #ddd",
                          }}
                        >
                          {activity.ipAddress}
                        </td>

                        <td
                          style={{
                            padding: "14px",
                            textAlign: "center",
                            borderBottom:
                              "1px solid #ddd",
                          }}
                        >
                          {activity.failureReason ||
                            "-"}
                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "#777",
                      }}
                    >
                      No login activity available.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}


      {/* ==================================================
          SECURITY REPORTS SECTION
      ================================================== */}

      {activeSection === "reports" && (

        <div>

          {/* Report Header */}

          <div
            style={{
              background: "white",
              padding: "20px 25px",
              borderRadius: "12px",
              marginBottom: "20px",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >

            <h2
              style={{
                color: "#1565C0",
                margin: 0,
              }}
            >
              📊 Security Reports
            </h2>

            <p
              style={{
                color: "#777",
                marginBottom: 0,
              }}
            >
              Password health and login activity reports
              generated from your existing SecureVault data.
            </p>

          </div>


          {/* Refresh Report */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >

            <button
              onClick={loadReports}
              style={{
                background: "#1565C0",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🔄 Refresh Reports
            </button>

          </div>


          {/* Loading */}

          {reportLoading && (

            <div
              style={{
                background: "white",
                padding: "40px",
                textAlign: "center",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              Generating security reports...
            </div>

          )}


          {/* Error */}

          {!reportLoading && reportError && (

            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {reportError}
            </div>

          )}


          {/* ==============================
              PASSWORD HEALTH
          ============================== */}

          {!reportLoading &&
            passwordHealth && (

              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.1)",
                  marginBottom: "25px",
                }}
              >

                <h2
                  style={{
                    color: "#1565C0",
                    marginTop: 0,
                  }}
                >
                  🔐 Password Health
                </h2>

                <p style={{ color: "#777" }}>
                  Password strength analysis of your
                  existing vault credentials.
                </p>


                {/* Password Cards */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >

                  {/* Total */}

                  <div
                    style={{
                      background: "#eaf3ff",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >

                    <h3
                      style={{
                        color: "#1565C0",
                        margin: 0,
                      }}
                    >
                      Total Credentials
                    </h3>

                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      {passwordHealth.totalCredentials}
                    </div>

                  </div>


                  {/* Strong */}

                  <div
                    style={{
                      background: "#e8f5e9",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >

                    <h3
                      style={{
                        color: "#2e7d32",
                        margin: 0,
                      }}
                    >
                      🟢 Strong
                    </h3>

                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      {passwordHealth.strong}
                    </div>

                  </div>


                  {/* Medium */}

                  <div
                    style={{
                      background: "#fff8e1",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >

                    <h3
                      style={{
                        color: "#f57f17",
                        margin: 0,
                      }}
                    >
                      🟡 Medium
                    </h3>

                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      {passwordHealth.medium}
                    </div>

                  </div>


                  {/* Weak */}

                  <div
                    style={{
                      background: "#ffebee",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >

                    <h3
                      style={{
                        color: "#c62828",
                        margin: 0,
                      }}
                    >
                      🔴 Weak
                    </h3>

                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      {passwordHealth.weak}
                    </div>

                  </div>

                </div>


                {/* Health Score */}

                <div
                  style={{
                    marginTop: "25px",
                    padding: "20px",
                    borderRadius: "10px",
                    background: "#f4f7fb",
                    textAlign: "center",
                  }}
                >

                  <h3
                    style={{
                      color: "#444",
                      marginTop: 0,
                    }}
                  >
                    Overall Password Health Score
                  </h3>

                  <div
                    style={{
                      fontSize: "40px",
                      fontWeight: "700",
                      color:
                        passwordHealth.healthScore >= 80
                          ? "#2e7d32"
                          : passwordHealth.healthScore >= 50
                          ? "#f57f17"
                          : "#c62828",
                    }}
                  >
                    {passwordHealth.healthScore}%
                  </div>

                </div>

              </div>

            )}


          {/* ==============================
              LOGIN ACTIVITY REPORT
          ============================== */}

          {!reportLoading &&
            loginReport && (

              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.1)",
                  marginBottom: "25px",
                }}
              >

                <h2
                  style={{
                    color: "#1565C0",
                    marginTop: 0,
                  }}
                >
                  🔑 Login Activity Report
                </h2>

                <p style={{ color: "#777" }}>
                  Analysis of your existing login logs.
                </p>


                {/* Login Statistics */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >

                  {/* Total */}

                  <div
                    style={{
                      background: "#eaf3ff",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >

                    <h3
                      style={{
                        color: "#1565C0",
                        margin: 0,
                      }}
                    >
                      Total Attempts
                    </h3>

                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      {loginReport.totalAttempts}
                    </div>

                  </div>


                  {/* Successful */}

                  <div
                    style={{
                      background: "#e8f5e9",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >

                    <h3
                      style={{
                        color: "#2e7d32",
                        margin: 0,
                      }}
                    >
                      ✅ Successful
                    </h3>

                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      {loginReport.successfulLogins}
                    </div>

                  </div>


                  {/* Failed */}

                  <div
                    style={{
                      background: "#ffebee",
                      padding: "20px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >

                    <h3
                      style={{
                        color: "#c62828",
                        margin: 0,
                      }}
                    >
                      ❌ Failed
                    </h3>

                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      {loginReport.failedLogins}
                    </div>

                  </div>

                </div>


                {/* Recent Activities */}

                <h3
                  style={{
                    color: "#444",
                    marginTop: "30px",
                  }}
                >
                  🕒 Recent Login Activities
                </h3>


                <div
                  style={{
                    overflowX: "auto",
                  }}
                >

                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >

                    <thead>

                      <tr
                        style={{
                          background: "#1976D2",
                          color: "white",
                        }}
                      >

                        <th style={{ padding: "12px" }}>
                          Status
                        </th>

                        <th style={{ padding: "12px" }}>
                          Date & Time
                        </th>

                        <th style={{ padding: "12px" }}>
                          IP Address
                        </th>

                        <th style={{ padding: "12px" }}>
                          Failure Reason
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {loginReport.recentActivities &&
                      loginReport.recentActivities.length > 0 ? (

                        loginReport.recentActivities.map(
                          (activity) => (

                            <tr key={activity.id}>

                              <td
                                style={{
                                  padding: "12px",
                                  textAlign: "center",
                                  color:
                                    activity.status ===
                                    "SUCCESS"
                                      ? "green"
                                      : "#e53935",
                                  fontWeight: "600",
                                  borderBottom:
                                    "1px solid #ddd",
                                }}
                              >
                                {activity.status ===
                                "SUCCESS"
                                  ? "✓ SUCCESS"
                                  : "✕ FAILED"}
                              </td>

                              <td
                                style={{
                                  padding: "12px",
                                  textAlign: "center",
                                  borderBottom:
                                    "1px solid #ddd",
                                }}
                              >
                                {new Date(
                                  activity.timestamp
                                ).toLocaleString()}
                              </td>

                              <td
                                style={{
                                  padding: "12px",
                                  textAlign: "center",
                                  borderBottom:
                                    "1px solid #ddd",
                                }}
                              >
                                {activity.ipAddress}
                              </td>

                              <td
                                style={{
                                  padding: "12px",
                                  textAlign: "center",
                                  borderBottom:
                                    "1px solid #ddd",
                                }}
                              >
                                {activity.failureReason ||
                                  "-"}
                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan="4"
                            style={{
                              padding: "25px",
                              textAlign: "center",
                              color: "#777",
                            }}
                          >
                            No recent login activities.
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

        </div>

      )}

    </div>

  );
}

export default Dashboard;