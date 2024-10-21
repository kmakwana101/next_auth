'use client';
import { useState } from 'react';

export default function Home() {
  // State to manage the form mode
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgetPasswordMode, setIsForgetPasswordMode] = useState(false);
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [isNewPasswordMode, setIsNewPasswordMode] = useState(false);

  // Function to switch to sign-up mode
  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    setIsForgetPasswordMode(false);
    setIsOTPMode(false);
    setIsNewPasswordMode(false);
  };

  // Function to switch to sign-in mode
  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setIsForgetPasswordMode(false);
    setIsOTPMode(false);
    setIsNewPasswordMode(false);
  };

  // Function to switch to forget-password mode
  const handleForgetPasswordClick = () => {
    setIsForgetPasswordMode(true);
    setIsOTPMode(false);
    setIsNewPasswordMode(false);
  };

  // Function to handle OTP submission
  const handleOTPSubmit = (e) => {
    e.preventDefault();
    // After OTP verification logic
    console.log("OTP verified");
    setIsNewPasswordMode(true);
    setIsOTPMode(false);
  };

  // Function to handle sending OTP and switch to OTP entry form
  const handleSendOTPClick = (e) => {
    e.preventDefault();
    setIsOTPMode(true);
    setIsForgetPasswordMode(false);
  };

  // Function to handle new password submission
  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    // Handle new password logic here
    console.log("New password set");
    setIsNewPasswordMode(false);
    setIsSignUpMode(false); // Optionally, switch to sign-in after setting the new password
  };

  return (
    <div className={`formContainer ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign-In Form */}
          {!isSignUpMode && !isForgetPasswordMode && !isOTPMode && !isNewPasswordMode && (
            <form action="#" className="sign-in-form">
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Login" className="btn solid fff" />
              <a
                href="#"
                onClick={handleForgetPasswordClick}
                className="forgot-password-link my-2"
              >
                Forgot Password?
              </a>
            </form>
          )}

          {/* Forgot Password Form */}
          {isForgetPasswordMode && !isOTPMode && (
            <form action="#" className="forgot-password-form">
              <h2 className="title">Forgot Password</h2>
              <p className="info-text">
                Enter your email address to reset your password.
              </p>
              <div className="input-field">
                <i className="fas fa-envelope" />
                <input type="email" placeholder="Email" />
              </div>
              <input
                type="submit"
                value="Send OTP"
                className="btn solid fff"
                onClick={handleSendOTPClick}
              />
              <a
                href="#"
                onClick={handleSignInClick}
                className="back-to-login-link my-2"
              >
                Back to Login
              </a>
            </form>
          )}

          {/* OTP Entry Form */}
          {isOTPMode && (
            <form action="#" className="otp-form" onSubmit={handleOTPSubmit}>
              <h2 className="title">Enter OTP</h2>
              <p className="info-text">
                OTP sent to your email. Please enter to verify.
              </p>
              <div className="input-field">
                <i className="fas fa-key" />
                <input type="text" placeholder="Enter OTP" />
              </div>
              <input type="submit" value="Verify OTP" className="btn solid fff" />
            </form>
          )}

          {/* New Password Form */}
          {isNewPasswordMode && (
            <form action="#" className="new-password-form" onSubmit={handleNewPasswordSubmit}>
              <h2 className="title">Set New Password</h2>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" placeholder="New Password" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" placeholder="Confirm Password" />
              </div>
              <input type="submit" value="Set Password" className="btn solid fff" />
            </form>
          )}

          {/* Sign-Up Form */}
          {isSignUpMode && (
            <form action="#" className="sign-up-form">
              <h2 className="title">Sign up</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Sign up" className="btn solid fff" />
              <a
                href="#"
                onClick={handleSignInClick}
                className="back-to-login-link my-2"
              >
                Already have an account? Sign in
              </a>
            </form>
          )}
        </div>
      </div>

      {/* Panels for additional content */}
      // Inside the panels-container div
<div className="panels-container">
  <div className="panel left-panel">
    <div className="content">
      <h3>New to our community ?</h3>
      <p>
        Discover a world of possibilities! Join us and explore a vibrant
        community where ideas flourish and connections thrive.
      </p>
      <button
        className="btn transparent"
        id="sign-up-btn"
        onClick={handleSignUpClick}
      >
        Sign up
      </button>
    <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" alt="Community" className="panel-image" />
    </div>
    {/* Add image here */}
  </div>
  <div className="panel right-panel">
    <div className="content">
      <h3>One of Our Valued Members</h3>
      <p>
        Thank you for being part of our community. Your presence enriches our
        shared experiences. Let's continue this journey together!
      </p>
      <button
        className="btn transparent"
        id="sign-in-btn"
        onClick={handleSignInClick}
      >
        Sign in
      </button>
      <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" alt="Community" className="panel-image" />
    </div>
    {/* Add another image here */}
    {/* <img src="/path/to/your/image.jpg" alt="Members" className="panel-image" /> */}
  </div>
</div>

    </div>
  );
}
