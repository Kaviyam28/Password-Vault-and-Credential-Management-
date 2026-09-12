import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  // ==========================================
  // PASSWORD STATE
  // ==========================================

  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // SECURITY STATE
  // ==========================================

  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [securityLoading, setSecurityLoading] = useState(true);

  // ==========================================
  // LOGIN ANALYTICS STATE
  // ==========================================

  const [loginAnalytics, setLoginAnalytics] = useState({
    totalLogins: 0,
    successfulLogins: 0,
    failedLogins: 0
  });

  const [loginAnalyticsLoading, setLoginAnalyticsLoading] =
    useState(true);

  // ==========================================
  // ACTIONS DROPDOWN
  // ==========================================

  const [actionsOpen, setActionsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // ==========================================
  // NOTIFICATION STATE
  // ==========================================

  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    if (!userEmail) {
      navigate("/");
      return;
    }

    fetchPasswords();
    fetchSecurityData();
    fetchLoginAnalytics();
    fetchNotifications();
  }, [userEmail, navigate]);

  // ==========================================
  // LOAD PASSWORDS
  // ==========================================

  const fetchPasswords = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8080/api/passwords/${encodeURIComponent(userEmail)}`
      );

      setPasswords(response.data || []);
    } catch (error) {
      console.error("Error loading passwords:", error);
      setPasswords([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD SECURITY DATA
  // ==========================================

  const fetchSecurityData = async () => {
    try {
      setSecurityLoading(true);

      const [
        alertsResponse,
        suspiciousResponse,
        auditResponse
      ] = await Promise.all([
        axios.get(
          `http://localhost:8080/api/security/alerts/${encodeURIComponent(userEmail)}`
        ),

        axios.get(
          `http://localhost:8080/api/security/suspicious/${encodeURIComponent(userEmail)}`
        ),

        axios.get(
          `http://localhost:8080/api/security/audit/${encodeURIComponent(userEmail)}`
        )
      ]);

      setSecurityAlerts(alertsResponse.data || []);
      setSuspiciousActivities(suspiciousResponse.data || []);
      setAuditLogs(auditResponse.data || []);
    } catch (error) {
      console.error("Error loading security data:", error);

      setSecurityAlerts([]);
      setSuspiciousActivities([]);
      setAuditLogs([]);
    } finally {
      setSecurityLoading(false);
    }
  };

  // ==========================================
  // LOAD LOGIN ANALYTICS
  // ==========================================

  const fetchLoginAnalytics = async () => {
    try {
      setLoginAnalyticsLoading(true);

      const response = await axios.get(
        `http://localhost:8080/api/security-analytics/${encodeURIComponent(userEmail)}`
      );

      setLoginAnalytics({
        totalLogins: response.data?.totalLogins || 0,
        successfulLogins: response.data?.successfulLogins || 0,
        failedLogins: response.data?.failedLogins || 0
      });
    } catch (error) {
      console.error(
        "Error loading login analytics:",
        error
      );

      setLoginAnalytics({
        totalLogins: 0,
        successfulLogins: 0,
        failedLogins: 0
      });
    } finally {
      setLoginAnalyticsLoading(false);
    }
  };

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);

      // First get the logged-in user's database ID
      const userResponse = await axios.get(
        `http://localhost:8080/api/user/${encodeURIComponent(userEmail)}`
      );

      const userId = userResponse.data?.id;

      if (!userId) {
        console.error("User ID not found");
        setNotifications([]);
        return;
      }

      // Get notifications using the user ID
      const response = await axios.get(
        `http://localhost:8080/api/notifications/${userId}`
      );

      setNotifications(response.data || []);
    } catch (error) {
      console.error(
        "Error loading notifications:",
        error
      );

      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // ==========================================
  // MARK NOTIFICATION AS READ
  // ==========================================

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/read/${notificationId}`
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );
    }
  };

  // ==========================================
  // HANDLE NOTIFICATION CLICK
  // ==========================================

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
  };

  // ==========================================
  // REFRESH ALL SECURITY DATA
  // ==========================================

  const refreshSecurityData = () => {
    fetchSecurityData();
    fetchLoginAnalytics();
  };

  // ==========================================
  // ACTIONS DROPDOWN
  // ==========================================

  const handleAction = (action) => {
    setActiveAction(action);
    setActionsOpen(false);

    if (action === "passwords") {
      navigate("/vault");
    }

    if (action === "login") {
      navigate("/login-activity");
    }

    if (action === "analytics") {
      navigate("/security-analytics");
    }

    if (action === "alerts") {
      navigate("/security-alerts");
    }

    if (action === "suspicious") {
      navigate("/suspicious-activities");
    }

    if (action === "audit") {
      navigate("/security-audit");
    }

    if (action === "reports") {
      navigate("/reports");
    }

    if (action === "shared") {
      navigate("/shared-with-me");
    }
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
  // COUNTS
  // ==========================================

  const passwordCount = passwords.length;

  const websiteCount = new Set(
    passwords.map((item) => item.website)
  ).size;

  const alertCount = securityAlerts.length;

  const suspiciousCount =
    suspiciousActivities.length;

  const auditCount = auditLogs.length;

  const unreadNotificationCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  const lastSave =
    passwords.length > 0
      ? "Today"
      : "No Data";

  // ==========================================
  // FORMAT NOTIFICATION TIME
  // ==========================================

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    const date = new Date(createdAt);

    if (isNaN(date.getTime())) {
      return createdAt;
    }

    return date.toLocaleString();
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div
      style={styles.page}
      className="home-dashboard"
    >

      {/* HEADER */}

      <header
        style={styles.header}
        className="home-header"
      >

        <div>

          <h1 style={styles.logo}>
            🔐 SecureVault Dashboard
          </h1>

          <p style={styles.welcome}>
            Welcome, {userEmail}
          </p>

        </div>

        <div
          style={styles.headerActions}
          className="home-header-actions"
        >

          {/* ==========================================
              NOTIFICATION BUTTON
          ========================================== */}

          <div
            style={styles.notificationContainer}
          >

            <button
              onClick={() => {
                setNotificationsOpen(
                  !notificationsOpen
                );

                setActionsOpen(false);

                if (!notificationsOpen) {
                  fetchNotifications();
                }
              }}
              style={styles.notificationButton}
              title="Notifications"
            >

              🔔

              {unreadNotificationCount > 0 && (
                <span
                  style={styles.notificationBadge}
                >
                  {unreadNotificationCount}
                </span>
              )}

            </button>

            {/* ==========================================
                NOTIFICATION DROPDOWN
            ========================================== */}

            {notificationsOpen && (

              <div
                style={styles.notificationMenu}
              >

                <div
                  style={styles.notificationHeader}
                >

                  <span
                    style={styles.notificationHeaderTitle}
                  >
                    🔔 Notifications
                  </span>

                  <button
                    onClick={fetchNotifications}
                    style={styles.notificationRefresh}
                  >
                    🔄
                  </button>

                </div>

                {notificationsLoading ? (

                  <div
                    style={styles.notificationEmpty}
                  >
                    Loading notifications...
                  </div>

                ) : notifications.length === 0 ? (

                  <div
                    style={styles.notificationEmpty}
                  >
                    No notifications
                  </div>

                ) : (

                  <div
                    style={styles.notificationList}
                  >

                    {notifications.map(
                      (notification) => (

                        <div
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          style={{
                            ...styles.notificationItem,
                            background:
                              notification.read
                                ? "white"
                                : "#eef6ff"
                          }}
                        >

                          <div
                            style={
                              styles.notificationItemTop
                            }
                          >

                            <div
                              style={
                                styles.notificationType
                              }
                            >
                              {notification.type ===
                              "LOGIN"
                                ? "🔐"
                                : notification.type ===
                                  "SECURITY"
                                ? "🚨"
                                : notification.type ===
                                  "SHARING"
                                ? "🔗"
                                : notification.type ===
                                  "CREDENTIAL_SHARED"
                                ? "🔗"
                                : notification.type ===
                                  "PASSWORD_EXPIRATION"
                                ? "🔑"
                                : notification.type ===
                                  "SUSPICIOUS_ACTIVITY"
                                ? "⚠️"
                                : "🔔"}
                            </div>

                            <div
                              style={
                                styles.notificationTitle
                              }
                            >
                              {notification.title}
                            </div>

                            {!notification.read && (
                              <span
                                style={
                                  styles.unreadDot
                                }
                              />
                            )}

                          </div>

                          <div
                            style={
                              styles.notificationMessage
                            }
                          >
                            {notification.message}
                          </div>

                          <div
                            style={
                              styles.notificationTime
                            }
                          >
                            {formatNotificationTime(
                              notification.createdAt
                            )}
                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </div>

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div
            style={styles.actionsContainer}
            className="home-actions-container"
          >

            <button
              onClick={() =>
                setActionsOpen(!actionsOpen)
              }
              style={styles.actionsButton}
            >
              Actions {actionsOpen ? "▲" : "▼"}
            </button>

            {actionsOpen && (

              <div
                style={styles.actionsMenu}
                className="home-actions-menu"
              >

                <button
                  onClick={() =>
                    handleAction("passwords")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "passwords"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  🔑 Recent Passwords
                </button>

                <button
                  onClick={() =>
                    handleAction("login")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "login"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  🔐 Login Activity
                </button>

                <button
                  onClick={() =>
                    handleAction("analytics")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "analytics"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  📊 Security Analytics
                </button>

                <button
                  onClick={() =>
                    handleAction("alerts")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "alerts"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  🚨 Security Alerts
                </button>

                <button
                  onClick={() =>
                    handleAction("suspicious")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "suspicious"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  ⚠️ Suspicious Activities
                </button>

                <button
                  onClick={() =>
                    handleAction("audit")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "audit"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  📋 Security Audit Logs
                </button>

                <button
                  onClick={() =>
                    handleAction("reports")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "reports"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  📊 Security Reports
                </button>

                <button
                  onClick={() =>
                    handleAction("shared")
                  }
                  style={{
                    ...styles.actionMenuItem,
                    background:
                      activeAction === "shared"
                        ? "#e3f2fd"
                        : "white"
                  }}
                >
                  📥 Shared With You
                </button>

              </div>
            )}

          </div>

          {/* LOGOUT */}

          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      {/* WELCOME BANNER */}

      <section
        style={styles.banner}
        className="home-banner"
      >

        <div>

          <h2 style={styles.bannerTitle}>
            👋 Welcome Back!
          </h2>

          <p style={styles.bannerText}>
            Store and manage all your passwords
            securely in one place.
          </p>

          <button
            onClick={() =>
              navigate("/vault")
            }
            style={styles.openVaultButton}
          >
            Open Password Vault
          </button>

        </div>

      </section>

      {/* BASIC STATISTICS */}

      <section
        style={styles.stats}
        className="responsive-stats"
      >

        <div style={styles.statCard}>

          <div style={styles.statTitle}>
            🔑 Passwords
          </div>

          <div style={styles.statValue}>
            {loading ? "..." : passwordCount}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statTitle}>
            🌐 Websites
          </div>

          <div style={styles.statValue}>
            {loading ? "..." : websiteCount}
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statTitle}>
            🛡 Security
          </div>

          <div style={styles.statValue}>
            Strong
          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statTitle}>
            📅 Last Save
          </div>

          <div style={styles.statValue}>
            {lastSave}
          </div>

        </div>

      </section>

      {/* LOGIN OVERVIEW */}

      <section
        style={styles.loginSection}
        className="responsive-login-section"
      >

        <div
          style={styles.loginHeader}
          className="responsive-section-header"
        >

          <div>

            <h2 style={styles.loginSectionTitle}>
              🔐 Login Overview
            </h2>

            <p style={styles.loginSubtitle}>
              Monitor successful and failed login
              activities in your SecureVault account.
            </p>

          </div>

          <button
            onClick={fetchLoginAnalytics}
            style={styles.loginRefreshButton}
            disabled={loginAnalyticsLoading}
          >
            {loginAnalyticsLoading
              ? "Refreshing..."
              : "🔄 Refresh"}
          </button>

        </div>

        <div
          style={styles.loginCards}
          className="responsive-login-cards"
        >

          {/* TOTAL LOGINS */}

          <div
            style={{
              ...styles.loginCard,
              borderTop: "4px solid #1565C0"
            }}
          >

            <div style={styles.loginIcon}>
              🔐
            </div>

            <div style={styles.loginCardTitle}>
              Total Logins
            </div>

            <div
              style={{
                ...styles.loginCount,
                color: "#1565C0"
              }}
            >
              {loginAnalyticsLoading
                ? "..."
                : loginAnalytics.totalLogins}
            </div>

            <div style={styles.loginCardText}>
              Total login attempts recorded
            </div>

            <button
              onClick={() =>
                navigate("/login-activity")
              }
              style={styles.loginViewButton}
            >
              View Login Activity →
            </button>

          </div>

          {/* SUCCESSFUL LOGINS */}

          <div
            style={{
              ...styles.loginCard,
              borderTop: "4px solid #2e7d32"
            }}
          >

            <div style={styles.loginIcon}>
              ✅
            </div>

            <div style={styles.loginCardTitle}>
              Successful Logins
            </div>

            <div
              style={{
                ...styles.loginCount,
                color: "#2e7d32"
              }}
            >
              {loginAnalyticsLoading
                ? "..."
                : loginAnalytics.successfulLogins}
            </div>

            <div style={styles.loginCardText}>
              Successfully authenticated logins
            </div>

            <button
              onClick={() =>
                navigate(
                  "/login-activity?status=SUCCESS"
                )
              }
              style={{
                ...styles.loginViewButton,
                background: "#2e7d32"
              }}
            >
              View Successful Logins →
            </button>

          </div>

          {/* FAILED LOGINS */}

          <div
            style={{
              ...styles.loginCard,
              borderTop: "4px solid #e53935"
            }}
          >

            <div style={styles.loginIcon}>
              ❌
            </div>

            <div style={styles.loginCardTitle}>
              Failed Logins
            </div>

            <div
              style={{
                ...styles.loginCount,
                color: "#e53935"
              }}
            >
              {loginAnalyticsLoading
                ? "..."
                : loginAnalytics.failedLogins}
            </div>

            <div style={styles.loginCardText}>
              Failed authentication attempts
            </div>

            <button
              onClick={() =>
                navigate(
                  "/login-activity?status=FAILED"
                )
              }
              style={{
                ...styles.loginViewButton,
                background: "#e53935"
              }}
            >
              View Failed Logins →
            </button>

          </div>

        </div>

      </section>

      {/* SECURITY OVERVIEW */}

      <section
        style={styles.securitySection}
        className="responsive-security-section"
      >

        <div
          style={styles.securityHeader}
          className="responsive-section-header"
        >

          <div>

            <h2 style={styles.sectionTitle}>
              🛡 Security Overview
            </h2>

            <p style={styles.securitySubtitle}>
              Monitor security events detected
              in your SecureVault account.
            </p>

          </div>

          <button
            onClick={refreshSecurityData}
            style={styles.securityRefreshButton}
            disabled={
              securityLoading ||
              loginAnalyticsLoading
            }
          >
            {securityLoading ||
            loginAnalyticsLoading
              ? "Refreshing..."
              : "🔄 Refresh"}
          </button>

        </div>

        <div
          style={styles.securityCards}
          className="responsive-security-cards"
        >

          {/* SECURITY ALERTS */}

          <div
            style={{
              ...styles.securityCard,
              borderTop: "4px solid #e53935"
            }}
            onClick={() =>
              navigate("/security-alerts")
            }
          >

            <div style={styles.securityIcon}>
              🚨
            </div>

            <div style={styles.securityCardTitle}>
              Security Alerts
            </div>

            <div style={styles.securityCount}>
              {securityLoading ? "..." : alertCount}
            </div>

            <div style={styles.securityCardText}>
              High priority security alerts
            </div>

            <button
              style={{
                ...styles.securityViewButton,
                background: "#e53935"
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/security-alerts");
              }}
            >
              View Alerts →
            </button>

          </div>

          {/* SUSPICIOUS ACTIVITIES */}

          <div
            style={{
              ...styles.securityCard,
              borderTop: "4px solid #fb8c00"
            }}
            onClick={() =>
              navigate("/suspicious-activities")
            }
          >

            <div style={styles.securityIcon}>
              ⚠️
            </div>

            <div style={styles.securityCardTitle}>
              Suspicious Activities
            </div>

            <div style={styles.securityCount}>
              {securityLoading
                ? "..."
                : suspiciousCount}
            </div>

            <div style={styles.securityCardText}>
              Suspicious events detected
            </div>

            <button
              style={{
                ...styles.securityViewButton,
                background: "#fb8c00"
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/suspicious-activities");
              }}
            >
              View Activities →
            </button>

          </div>

          {/* SECURITY AUDIT LOGS */}

          <div
            style={{
              ...styles.securityCard,
              borderTop: "4px solid #1565C0"
            }}
            onClick={() =>
              navigate("/security-audit")
            }
          >

            <div style={styles.securityIcon}>
              📋
            </div>

            <div style={styles.securityCardTitle}>
              Security Audit Logs
            </div>

            <div style={styles.securityCount}>
              {securityLoading ? "..." : auditCount}
            </div>

            <div style={styles.securityCardText}>
              Security actions recorded
            </div>

            <button
              style={styles.securityViewButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/security-audit");
              }}
            >
              View Audit Logs →
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f3f6fa",
    fontFamily: "Arial, sans-serif",
    color: "#222",
    paddingBottom: "25px"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "12px 22px",
    background: "#f4f7fb"
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logo: {
    margin: 0,
    color: "#1565C0",
    fontSize: "25px"
  },

  welcome: {
    marginTop: "4px",
    marginBottom: 0,
    fontSize: "15px",
    fontWeight: "600"
  },

  // ==========================================
  // NOTIFICATION STYLES
  // ==========================================

  notificationContainer: {
    position: "relative"
  },

  notificationButton: {
    position: "relative",
    background: "white",
    color: "#1565C0",
    border: "1px solid #d5dce5",
    borderRadius: "7px",
    width: "40px",
    height: "38px",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  notificationBadge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    minWidth: "18px",
    height: "18px",
    padding: "0 4px",
    borderRadius: "10px",
    background: "#e53935",
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box"
  },

  notificationMenu: {
    position: "absolute",
    top: "46px",
    right: "0",
    width: "360px",
    maxHeight: "450px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.20)",
    overflow: "hidden",
    zIndex: 4000,
    border: "1px solid #e0e0e0",
    boxSizing: "border-box"
  },

  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    borderBottom: "1px solid #e5e5e5",
    background: "#f7f9fc"
  },

  notificationHeaderTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#1565C0"
  },

  notificationRefresh: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "15px"
  },

  notificationList: {
    maxHeight: "390px",
    overflowY: "auto"
  },

  notificationItem: {
    padding: "12px 14px",
    borderBottom: "1px solid #eeeeee",
    cursor: "pointer",
    transition: "background 0.2s"
  },

  notificationItemTop: {
    display: "flex",
    alignItems: "center",
    gap: "7px"
  },

  notificationType: {
    fontSize: "17px",
    flexShrink: 0
  },

  notificationTitle: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#222",
    flex: 1
  },

  unreadDot: {
    width: "8px",
    height: "8px",
    background: "#e53935",
    borderRadius: "50%",
    flexShrink: 0
  },

  notificationMessage: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#555",
    lineHeight: "1.45"
  },

  notificationTime: {
    marginTop: "6px",
    fontSize: "10px",
    color: "#888"
  },

  notificationEmpty: {
    padding: "25px 15px",
    textAlign: "center",
    color: "#777",
    fontSize: "13px"
  },

  // ==========================================
  // ACTIONS STYLES
  // ==========================================

  actionsContainer: {
    position: "relative"
  },

  actionsButton: {
    background: "#1565C0",
    color: "white",
    border: "none",
    borderRadius: "7px",
    padding: "9px 16px",
    fontWeight: "bold",
    fontSize: "13px",
    cursor: "pointer",
    minWidth: "115px"
  },

  actionsMenu: {
    position: "absolute",
    top: "42px",
    right: "0",
    width: "225px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.18)",
    overflow: "hidden",
    zIndex: 3000,
    border: "1px solid #e0e0e0",
    boxSizing: "border-box"
  },

  actionMenuItem: {
    width: "100%",
    padding: "11px 14px",
    border: "none",
    textAlign: "left",
    fontSize: "13px",
    color: "#333",
    cursor: "pointer",
    fontWeight: "600"
  },

  logoutButton: {
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "7px",
    padding: "9px 19px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  banner: {
    margin: "10px 22px 18px",
    padding: "20px 25px",
    borderRadius: "15px",
    background:
      "linear-gradient(90deg, #1976d2, #42a5f5)",
    color: "white"
  },

  bannerTitle: {
    margin: "0 0 4px",
    fontSize: "21px"
  },

  bannerText: {
    margin: 0,
    fontSize: "14px"
  },

  openVaultButton: {
    marginTop: "12px",
    padding: "9px 20px",
    border: "none",
    borderRadius: "7px",
    background: "white",
    color: "#1565C0",
    fontWeight: "bold",
    cursor: "pointer"
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    margin: "0 22px 18px"
  },

  statCard: {
    background: "white",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 3px 9px rgba(0,0,0,0.10)"
  },

  statTitle: {
    fontSize: "14px",
    fontWeight: "600"
  },

  statValue: {
    marginTop: "5px",
    fontSize: "24px",
    color: "#1565C0",
    fontWeight: "bold"
  },

  loginSection: {
    background: "white",
    margin: "0 22px 18px",
    padding: "18px",
    borderRadius: "13px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.10)"
  },

  loginHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },

  loginSectionTitle: {
    color: "#1565C0",
    margin: 0,
    fontSize: "21px"
  },

  loginSubtitle: {
    color: "#666",
    margin: "5px 0 0",
    fontSize: "13px"
  },

  loginRefreshButton: {
    padding: "8px 14px",
    background: "#1565C0",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px"
  },

  loginCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px"
  },

  loginCard: {
    background: "#fafafa",
    padding: "14px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 7px rgba(0,0,0,0.08)",
    minHeight: "155px",
    boxSizing: "border-box"
  },

  loginIcon: {
    fontSize: "28px",
    marginBottom: "4px"
  },

  loginCardTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "4px"
  },

  loginCount: {
    fontSize: "27px",
    fontWeight: "bold",
    marginBottom: "4px"
  },

  loginCardText: {
    color: "#777",
    fontSize: "12px",
    marginBottom: "8px"
  },

  loginViewButton: {
    padding: "7px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#1565C0",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px"
  },

  securitySection: {
    background: "white",
    margin: "0 22px 18px",
    padding: "18px",
    borderRadius: "13px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.10)"
  },

  securityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },

  sectionTitle: {
    color: "#1565C0",
    margin: 0,
    fontSize: "21px"
  },

  securitySubtitle: {
    color: "#666",
    margin: "5px 0 0",
    fontSize: "13px"
  },

  securityRefreshButton: {
    padding: "8px 14px",
    background: "#1565C0",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px"
  },

  securityCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px"
  },

  securityCard: {
    background: "#fafafa",
    padding: "14px",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 7px rgba(0,0,0,0.08)",
    minHeight: "160px",
    boxSizing: "border-box"
  },

  securityIcon: {
    fontSize: "28px",
    marginBottom: "4px"
  },

  securityCardTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "4px"
  },

  securityCount: {
    fontSize: "27px",
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: "4px"
  },

  securityCardText: {
    color: "#777",
    fontSize: "12px",
    marginBottom: "8px"
  },

  securityViewButton: {
    padding: "7px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#1565C0",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px"
  }

};

export default Home;