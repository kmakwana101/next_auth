'use client';
import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios'
import { useRouter } from 'next/navigation';

interface ApiResponse {
  success: boolean;
}

export default function Home() {

  const router = useRouter()

  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  const [isForgetPasswordMode, setIsForgetPasswordMode] = useState<boolean>(false);
  const [isOTPMode, setIsOTPMode] = useState<boolean>(false);
  const [isNewPasswordMode, setIsNewPasswordMode] = useState<boolean>(false);

  // State variables for form inputs
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  const apiCall = async (url: string, method: string, data: object): Promise<ApiResponse> => {
    try {
      const response = await axios({ method, url, data });
      return response.data; // Return the response data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setMobileNumber('');
    setConfirmPassword('');
    setOtp('');
  };


  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      
      const response: any = await apiCall('/api/login', 'POST', { email, password });
      if (response.statusCode == 200) {
        toast.success(response?.message);
        router.push('/dashboard')
      } else {
        const errorMessage = response.message || 'Login failed! Please check your credentials.';
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      // setLoading(false); // Reset loading state
      // resetForm();
    }
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response: any = await apiCall('/api/signup', 'POST', { email, password, username, mobileNumber, role: 'user' });
      if (response?.statusCode === 201) {
        toast.success(response?.message);
        handleSignInClick()
      } else {
        const errorMessage = response.message || 'Login failed! Please check your credentials.';
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      // setLoading(false); // Reset loading state
    }
  }

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    setIsForgetPasswordMode(false);
    setIsOTPMode(false);
    setIsNewPasswordMode(false);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setIsForgetPasswordMode(false);
    setIsOTPMode(false);
    setIsNewPasswordMode(false);
  };

  const handleForgetPasswordClick = () => {
    setIsForgetPasswordMode(true);
    setIsOTPMode(false);
    setIsNewPasswordMode(false);
  };

  const handleOTPSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiCall('/api/comparecode', 'POST', { email, verificationCode: otp });
      toast.success('OTP verified successfully!');
      setIsNewPasswordMode(true);
      setIsOTPMode(false);
      setPassword('')
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSendOTPClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiCall('/api/forgetpassword', 'POST', { email });
      toast.success('OTP sent to your email!');
      setIsOTPMode(true);
      setIsForgetPasswordMode(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleNewPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // console.log(email, password)
      await apiCall('/api/resetpassword', 'POST', { email, password, confirmPassword });
      toast.success('New password set successfully!');
      setIsNewPasswordMode(false);
      setIsSignUpMode(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`formContainer ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign-In Form */}
          {!isSignUpMode && !isForgetPasswordMode && !isOTPMode && !isNewPasswordMode && (
            <form className="sign-in-form" onSubmit={handleSignInSubmit}>
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input
                  type="text"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <input type="submit" value="Login" className="btn solid fff" />
              <a onClick={handleForgetPasswordClick} className="forgot-password-link my-2 cursor-pointer">
                Forgot Password?
              </a>
            </form>
          )}

          {/* Forgot Password Form */}
          {isForgetPasswordMode && !isOTPMode && (
            <form className="forgot-password-form" onSubmit={handleSendOTPClick}>
              <h2 className="title">Forgot Password</h2>
              <p className="info-text">Enter your email address to reset your password.</p>
              <div className="input-field">
                <i className="fas fa-envelope" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <input
                type="submit"
                value="Send OTP"
                className="btn solid fff"
              />
              <a onClick={handleSignInClick} className="back-to-login-link my-2 cursor-pointer">
                Back to Login
              </a>
            </form>
          )}

          {/* OTP Entry Form */}
          {isOTPMode && (
            <form className="otp-form" onSubmit={handleOTPSubmit}>
              <h2 className="title">Enter OTP</h2>
              <p className="info-text">OTP sent to your email. Please enter to verify.</p>
              <div className="input-field">
                <i className="fas fa-key" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <input type="submit" value="Verify OTP" className="btn solid fff" />
            </form>
          )}

          {/* New Password Form */}
          {isNewPasswordMode && (
            <form className="new-password-form" onSubmit={handleNewPasswordSubmit}>
              <h2 className="title">Set New Password</h2>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <input type="submit" value="Set Password" className="btn solid fff" />
            </form>
          )}

          {/* Sign-Up Form */}
          {isSignUpMode && (
            <form className="sign-up-form" onSubmit={handleSignUpSubmit}>
              <h2 className="title">Sign up</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
              <input type="submit" value="Sign up" className="btn solid fff" />
              <a onClick={handleSignInClick} className="back-to-login-link my-2 cursor-pointer">
                Already have an account? Sign in
              </a>
            </form>
          )}
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New to our community?</h3>
            <p>Discover a world of possibilities! Join us and explore a vibrant community where ideas flourish and connections thrive.</p>
            <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
              Sign up
            </button>
            <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" alt="Community" className="panel-image" />
          </div>
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Welcome back! Log in to your account and continue your journey with us.</p>
            <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
              Sign in
            </button>
            <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" alt="Returning User" className="panel-image" />
          </div>
        </div>
      </div>
    </div>
  );
}
