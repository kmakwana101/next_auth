'use client'
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  // State to manage the form mode (sign-in or forget-password)
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgetPasswordMode, setIsForgetPasswordMode] = useState(false);

  // Function to switch to sign-up mode
  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    setIsForgetPasswordMode(false);
  };

  // Function to switch to sign-in mode
  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setIsForgetPasswordMode(false);
  };

  // Function to switch to forget-password mode
  const handleForgetPasswordClick = () => {
    setIsForgetPasswordMode(true);
  };

  return (
    <div className={`formContainer ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {!isForgetPasswordMode ? (
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
              <input type="submit" defaultValue="Login" className="btn solid fff" />
              <a
                href="#"
                onClick={handleForgetPasswordClick}
                className="forgot-password-link my-2"
              >
                Forgot Password?
              </a>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </form>
          ) : (
            <form action="#" className="forgot-password-form">
              <h2 className="title">Forgot Password</h2>
              <p className="info-text">
                Enter your email address to reset your password.
              </p>
              <div className="input-field">
                <i className="fas fa-envelope" />
                <input type="email" placeholder="Email" />
              </div>
              <input type="submit" defaultValue="Send Reset Link" className="btn solid fff" />
              <a
                href="#"
                onClick={handleSignInClick}
                className="back-to-login-link my-2"
              >
                Back to Login
              </a>
            </form>
          )}
        </div>
      </div>
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
          </div>
          <img
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
            className="image"
            alt=""
          />
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
          </div>
          <img
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
            className="image"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
