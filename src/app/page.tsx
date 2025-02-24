'use client';
import { useState, FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import './styles/main.css';
import Cookies from 'js-cookie';
import { apiCall } from '@/helpers/apiCall';
import { Eye, EyeOff } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
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

  const [showPassword, setShowPassword] = useState(false);

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
        router.push('/dashboard');
      } else {
        const errorMessage = response.message || 'Login failed! Please check your credentials.';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(error.message);
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response: any = await apiCall('/api/signup', 'POST', {
        email,
        password,
        username,
        mobileNumber,
        role: 'user',
      });
      if (response?.statusCode === 201) {
        toast.success(response?.message);
        handleSignInClick();
      } else {
        const errorMessage = response.message || 'Signup failed! Please check your details.';
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsLoading(true);
    try {
      let response: any = await apiCall('/api/comparecode', 'POST', { email, verificationCode: otp });
      if (response?.statusCode === 200) {
        toast.success('OTP verified successfully!');
        setIsNewPasswordMode(true);
        setIsOTPMode(false);
        setPassword('');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
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
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response: any = await apiCall('/api/resetpassword', 'POST', {
        email,
        password,
        confirmPassword,
      });
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
      setIsLoading(false);
    }
  };

  // Inside your Home component
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = otp.split('');
      newOtp[index] = value;
      setOtp(newOtp.join(''));
      if (value && index < 5) {
        const nextInput = document.querySelector(`input:nth-child(${index + 2})`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input:nth-child(${index})`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <>
      <div className={`formContainer ${isSignUpMode ? 'sign-up-mode' : ''}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign-In Form */}
            {!isSignUpMode && !isForgetPasswordMode && !isOTPMode && !isNewPasswordMode && (
              <form
                className="sign-in-form max-w-sm mx-auto p-6 bg-white shadow rounded-lg full-w"
                onSubmit={handleSignInSubmit}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Sign In</h2>

                <div className="mb-4 w-full">
                  <input
                    type="text"
                    placeholder="Username or Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="mb-4 w-full relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className={`absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500 hover:text-gray-700 focus:outline-none ${isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <input
                  type="submit"
                  value={isLoading ? 'Signing in...' : 'SIGN IN'}
                  className={`w-full p-3 rounded-md text-white font-medium text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition duration-200`}
                  disabled={isLoading}
                />

                <p className="text-center mt-4 text-sm text-gray-600">
                  Forgot your password?{' '}
                  <a
                    onClick={handleForgetPasswordClick}
                    className="text-blue-600 hover:underline cursor-pointer font-medium"
                  >
                    Reset it here
                  </a>
                </p>
              </form>
            )}

            {/* Forgot Password Form */}
            {isForgetPasswordMode && !isOTPMode && (
              <form
                className="forgot-password-form max-w-sm mx-auto p-6 bg-white shadow rounded-lg full-w"
                onSubmit={handleSendOTPClick}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Forgot Password</h2>

                <div className="mb-4 w-full">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <input
                  type="submit"
                  value={isLoading ? 'Sending...' : 'SEND OTP'}
                  className={`w-full p-3 rounded-md text-white font-medium text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition duration-200`}
                  disabled={isLoading}
                />

                <p className="text-center mt-4 text-sm text-gray-600">
                  Back to{' '}
                  <a
                    onClick={handleSignInClick}
                    className="text-blue-600 hover:underline cursor-pointer font-medium"
                  >
                    Sign In
                  </a>
                </p>
              </form>
            )}

            {/* OTP Entry Form */}
            {isOTPMode && (
              <form
                className="otp-form max-w-sm mx-auto p-6 bg-white shadow rounded-lg full-w"
                onSubmit={handleOTPSubmit}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Enter OTP</h2>

                <p className="text-center text-sm text-gray-600 mb-6">
                  OTP sent to your email. Please enter it below.
                </p>

                {/* OTP Input Fields */}
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text" // Changed to text to allow single character
                      maxLength={1} // Limit to one character
                      value={otp[index] || ''} // Get individual digit from otp string
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      disabled={isLoading}
                      className={`w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${isLoading ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      placeholder="-"
                      autoFocus={index === 0} // Auto-focus first input
                    />
                  ))}
                </div>

                <input
                  type="submit"
                  value={isLoading ? 'Verifying...' : 'VERIFY OTP'}
                  className={`w-full p-3 rounded-md text-white font-medium text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition duration-200`}
                  disabled={isLoading}
                />
              </form>
            )}

            {/* New Password Form */}
            {isNewPasswordMode && (
              <form
                className="new-password-form max-w-sm mx-auto p-6 bg-white shadow rounded-lg full-w"
                onSubmit={handleNewPasswordSubmit}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Set New Password</h2>

                <div className="mb-4 w-full">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="mb-4 w-full">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <input
                  type="submit"
                  value={isLoading ? 'Setting Password...' : 'SET PASSWORD'}
                  className={`w-full p-3 rounded-md text-white font-medium text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition duration-200`}
                  disabled={isLoading}
                />
              </form>
            )}

            {/* Sign-Up Form */}
            {isSignUpMode && (
              <form
                className="sign-up-form max-w-sm mx-auto p-6 bg-white shadow rounded-lg full-w"
                onSubmit={handleSignUpSubmit}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Sign Up</h2>

                <div className="mb-4 w-full">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="mb-4 w-full">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="mb-4 w-full relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className={`absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500 hover:text-gray-700 focus:outline-none ${isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="mb-4 w-full">
                  <input
                    type="number"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <input
                  type="submit"
                  value={isLoading ? 'Signing up...' : 'SIGN UP'}
                  className={`w-full p-3 rounded-md text-white font-medium text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition duration-200`}
                  disabled={isLoading}
                />

                <p className="text-center mt-4 text-sm text-gray-600">
                  Already have an account?{' '}
                  <a
                    onClick={handleSignInClick}
                    className="text-blue-600 hover:underline cursor-pointer font-medium"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New to our community?</h3>
              <p>
                Discover a world of possibilities! Join us and explore a vibrant community where
                ideas flourish and connections thrive.
              </p>
              <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                Sign up
              </button>
              <img
                src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
                alt="Community"
                className={`panel-image img-fluid ${isSignUpMode ? 'mgb' : ''}`}
              />
            </div>
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>Welcome back! Log in to your account and continue your journey with us.</p>
              <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
                Sign in
              </button>
              <img
                src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
                alt="Returning User"
                className="panel-image img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}