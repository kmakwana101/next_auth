'use client';
import { useState, FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import './styles/main.css'
import Cookies from 'js-cookie';
import { apiCall } from '@/helpers/apiCall';

export default function Home() {

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false); // State to track loading
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

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, [router]);

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
      setIsLoading(true);
      const response: any = await apiCall('/api/login', 'POST', { email, password });
      if (response.statusCode === 200) {
        toast.success(response?.message);
        Cookies.set('accessToken', response.accessToken, { expires: 365, secure: true });
        router.push('/dashboard')
      } else {
        const errorMessage = response.message || 'Login failed! Please check your credentials.';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(error.message);
        router.push('/'); // Redirect to home page on error
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
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
      setIsLoading(false); // Reset loading state
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
    console.log('first')
    setIsLoading(true);
    try {
      let response: any = await apiCall('/api/comparecode', 'POST', { email, verificationCode: otp });
      console.log(response, "response11")
      if (response?.statusCode === 200) {
        toast.success('OTP verified successfully!');
        setIsNewPasswordMode(true);
        setIsOTPMode(false);
        setPassword('')
        setIsLoading(false);
      } else {
        toast.error(response.message);
        setIsLoading(false);
      }

    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleSendOTPClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response: any = await apiCall('/api/forgetpassword', 'POST', { email });
      if (response?.statusCode === 201) {
        toast.success('OTP sent to your email!');
        setIsOTPMode(true);
        setIsForgetPasswordMode(false);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleNewPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response : any = await apiCall('/api/resetpassword', 'POST', { email, password, confirmPassword });

      if (response?.statusCode === 201) {
        toast.success('New password set successfully!');
        setIsNewPasswordMode(false);
        setIsSignUpMode(false);
        resetForm();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
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
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Logging in..." : "Login"} // Change button text based on loading state
                  className="btn solid fff"
                  disabled={isLoading} // Disable button if loading
                />
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
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Sending..." : "Send OTP"} // Change button text based on loading state
                  className="btn solid fff"
                  disabled={isLoading} // Disable button if loading
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
                    type="number"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Verifying..." : "Verify OTP"} // Change button text based on loading state
                  className="btn solid fff"
                  disabled={isLoading} // Disable button if loading
                />
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
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Setting Password..." : "Set Password"} // Change button text based on loading state
                  className="btn solid fff"
                  disabled={isLoading} // Disable button if loading
                />
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
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-envelope" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock" />
                  <input
                    type="number"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={isLoading} // Disable input if loading
                  />
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Signing up..." : "Sign up"} // Change button text based on loading state
                  className="btn solid fff"
                  disabled={isLoading} // Disable button if loading
                />
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
              <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" alt="Community" className="panel-image img-fluid" />
            </div>
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>Welcome back! Log in to your account and continue your journey with us.</p>
              <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
                Sign in
              </button>
              <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" alt="Returning User" className="panel-image img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
