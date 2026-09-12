import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SecurityAnalytics() {
    const navigate = useNavigate();

    const userEmail = localStorage.getItem("userEmail");

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userEmail) {
            navigate("/");
            return;
        }

        fetchSecurityAnalytics();
    }, [userEmail, navigate]);

    const fetchSecurityAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `https://password-vault-and-credential-management-4n8d.onrender.com/api/security-analytics/${encodeURIComponent(userEmail)}`
            );

            setAnalytics(response.data);
        } catch (err) {
            console.error("Error fetching security analytics:", err);
            setError("Unable to load security analytics.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div style={styles.center}>
                <h2>Loading Security Analytics...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.center}>
                <h2>{error}</h2>
                <button onClick={fetchSecurityAnalytics}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div style={styles.center}>
                <h2>No security analytics data available.</h2>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        📊 Security Analytics
                    </h1>

                    <p style={styles.subtitle}>
                        Monitor your account's security activities
                    </p>
                </div>

                <button
                    style={styles.backButton}
                    onClick={() => navigate("/home")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Security Statistics */}
            <h2 style={styles.sectionTitle}>
                Security Statistics
            </h2>

            <div style={styles.statsGrid}>

                <div style={styles.card}>
                    <div style={styles.icon}>🔐</div>
                    <h3>Total Logins</h3>
                    <p style={styles.number}>
                        {analytics.totalLogins}
                    </p>
                </div>

                <div style={styles.card}>
                    <div style={styles.icon}>✅</div>
                    <h3>Successful Logins</h3>
                    <p style={styles.number}>
                        {analytics.successfulLogins}
                    </p>
                </div>

                <div style={styles.card}>
                    <div style={styles.icon}>❌</div>
                    <h3>Failed Logins</h3>
                    <p style={styles.number}>
                        {analytics.failedLogins}
                    </p>
                </div>

                <div style={styles.card}>
                    <div style={styles.icon}>⚠️</div>
                    <h3>Suspicious Activities</h3>
                    <p style={styles.number}>
                        {analytics.suspiciousActivities}
                    </p>
                </div>

                <div style={styles.card}>
                    <div style={styles.icon}>🚨</div>
                    <h3>Security Alerts</h3>
                    <p style={styles.number}>
                        {analytics.securityAlerts}
                    </p>
                </div>

            </div>

            {/* Login Activity */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    🔐 Login Activity
                </h2>

                {analytics.recentLoginActivities?.length === 0 ? (
                    <p style={styles.empty}>
                        No login activity found.
                    </p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Timestamp</th>
                                    <th>IP Address</th>
                                    <th>Failure Reason</th>
                                </tr>
                            </thead>

                            <tbody>
                                {analytics.recentLoginActivities.map(
                                    (activity) => (
                                        <tr key={activity.id}>
                                            <td>
                                                <span
                                                    style={
                                                        activity.status?.toUpperCase() ===
                                                        "SUCCESS"
                                                            ? styles.success
                                                            : styles.failed
                                                    }
                                                >
                                                    {activity.status}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    activity.timestamp
                                                )}
                                            </td>

                                            <td>
                                                {activity.ipAddress || "N/A"}
                                            </td>

                                            <td>
                                                {activity.failureReason ||
                                                    "-"}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Suspicious Activities */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    ⚠️ Suspicious Activities
                </h2>

                {analytics.recentSuspiciousActivities?.length === 0 ? (
                    <p style={styles.empty}>
                        No suspicious activities found.
                    </p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Activity Type</th>
                                    <th>Description</th>
                                    <th>Detected At</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {analytics.recentSuspiciousActivities.map(
                                    (activity) => (
                                        <tr key={activity.id}>
                                            <td>
                                                {activity.activityType}
                                            </td>

                                            <td>
                                                {activity.description}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    activity.detectedAt
                                                )}
                                            </td>

                                            <td>
                                                {activity.status}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Security Alerts */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    🚨 Security Alerts
                </h2>

                {analytics.recentSecurityAlerts?.length === 0 ? (
                    <p style={styles.empty}>
                        No security alerts found.
                    </p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Alert Type</th>
                                    <th>Message</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {analytics.recentSecurityAlerts.map(
                                    (alert) => (
                                        <tr key={alert.id}>
                                            <td>
                                                {alert.alertType}
                                            </td>

                                            <td>
                                                {alert.message}
                                            </td>

                                            <td>
                                                <span
                                                    style={
                                                        alert.severity?.toUpperCase() ===
                                                        "HIGH"
                                                            ? styles.high
                                                            : styles.normal
                                                    }
                                                >
                                                    {alert.severity}
                                                </span>
                                            </td>

                                            <td>
                                                {alert.status}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    alert.createdAt
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Audit Logs */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    📋 Recent Audit Activity
                </h2>

                {analytics.recentAuditLogs?.length === 0 ? (
                    <p style={styles.empty}>
                        No audit activity found.
                    </p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Description</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>

                            <tbody>
                                {analytics.recentAuditLogs.map(
                                    (log) => (
                                        <tr key={log.id}>
                                            <td>
                                                {log.action}
                                            </td>

                                            <td>
                                                {log.description}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    log.timestamp
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        padding: "30px",
        backgroundColor: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },

    title: {
        margin: 0,
        fontSize: "32px",
        color: "#1f2937",
    },

    subtitle: {
        marginTop: "8px",
        color: "#6b7280",
    },

    backButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#374151",
        color: "white",
        fontSize: "14px",
    },

    section: {
        marginTop: "35px",
    },

    sectionTitle: {
        color: "#1f2937",
        marginBottom: "18px",
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
    },

    card: {
        backgroundColor: "white",
        padding: "22px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        textAlign: "center",
    },

    icon: {
        fontSize: "28px",
    },

    number: {
        fontSize: "30px",
        fontWeight: "bold",
        margin: "10px 0 0",
        color: "#111827",
    },

    tableContainer: {
        backgroundColor: "white",
        borderRadius: "12px",
        overflowX: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    success: {
        color: "green",
        fontWeight: "bold",
    },

    failed: {
        color: "red",
        fontWeight: "bold",
    },

    high: {
        color: "red",
        fontWeight: "bold",
    },

    normal: {
        fontWeight: "bold",
    },

    empty: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        color: "#6b7280",
    },

    center: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
};

export default SecurityAnalytics;