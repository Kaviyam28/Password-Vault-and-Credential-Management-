import { Navigate, Route, Routes } from "react-router-dom";

import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginActivity from "./pages/LoginActivity";
import ReceivedCredentials from "./pages/ReceivedCredentials";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import SecurityAlerts from "./pages/SecurityAlerts";
import SecurityAnalytics from "./pages/SecurityAnalytics";
import SecurityAudit from "./pages/SecurityAudit";
import ShareCredential from "./pages/ShareCredential";
import SuspiciousActivities from "./pages/SuspiciousActivities";
import Vault from "./pages/Vault";

function App() {
  return (
    <Routes>

      {/* Login */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Dashboard */}
      <Route
        path="/home"
        element={<Home />}
      />

      {/* Password Vault */}
      <Route
        path="/vault"
        element={<Vault />}
      />

      {/* Share Credential */}
      <Route
        path="/share-credential"
        element={<ShareCredential />}
      />

      {/* Shared With You */}
      <Route
        path="/shared-with-me"
        element={<ReceivedCredentials />}
      />

      {/* Login Activity */}
      <Route
        path="/login-activity"
        element={<LoginActivity />}
      />

      {/* Security Alerts */}
      <Route
        path="/security-alerts"
        element={<SecurityAlerts />}
      />

      {/* Suspicious Activities */}
      <Route
        path="/suspicious-activities"
        element={<SuspiciousActivities />}
      />

      {/* Security Audit Logs */}
      <Route
        path="/security-audit"
        element={<SecurityAudit />}
      />

      {/* Security Analytics */}
      <Route
        path="/security-analytics"
        element={<SecurityAnalytics />}
      />

      {/* Security Reports */}
      <Route
        path="/reports"
        element={<Reports />}
      />

      {/* Dashboard Redirect */}
      <Route
        path="/dashboard"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />

      {/* Unknown URL → Login */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;