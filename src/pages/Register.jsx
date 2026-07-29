import { useState } from "react";
import "./Register.css";

function Register() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInput = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const createAccount = (event) => {
    event.preventDefault();

    if(formData.password !== formData.confirmPassword){
      alert("Passwords do not match");
      return;
    }

    console.log("Account Data:", formData);
  };


  return (
    <div className="register-container">

      <div className="register-card">

        <div className="heading-section">
          <h1>Create Account</h1>
          <p>
            Join SecureVault and protect your digital information securely.
          </p>
        </div>


        <form onSubmit={createAccount}>

          <div className="input-box">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your name"
              onChange={handleInput}
            />
          </div>


          <div className="input-box">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleInput}
            />
          </div>


          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={handleInput}
            />
          </div>


          <div className="input-box">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={handleInput}
            />
          </div>

<button type="submit" className="register-btn">
            Create Account
          </button>


        </form>

      </div>

    </div>
  );
}

export default Register;