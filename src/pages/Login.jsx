import { FaCloud, FaFingerprint, FaLock, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../App.css";

function Login() {
  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo">
          <FaShieldAlt className="shield" />
          <h1>SecureVault</h1>
          <p className="tagline">Protect • Encrypt • Control</p>
        </div>

        <h2>Your Digital Security Starts Here</h2>

        <p className="description">
          SecureVault safeguards passwords, confidential documents and
          sensitive information using enterprise-level encryption,
          intelligent monitoring and secure cloud synchronization.
        </p>

        <div className="features">
          <div className="feature">
            <FaLock />
            <span>AES-256 Data Encryption</span>
          </div>

          <div className="feature">
            <FaFingerprint />
            <span>Biometric Authentication</span>
          </div>

          <div className="feature">
            <FaCloud />
            <span>Encrypted Cloud Backup</span>
          </div>

          <div className="feature">
            <FaShieldAlt />
            <span>Real-Time Threat Protection</span>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <input type="email" placeholder="Email Address" />

          <input type="password" placeholder="Master Password" />

          <button>Secure Login</button>

          <div className="links">
            <Link to="#">Forgot Password?</Link>
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;