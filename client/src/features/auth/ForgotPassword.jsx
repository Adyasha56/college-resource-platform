import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast("error", "Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );

      if (res.status === 200) {
        showToast("success", "Enter your new password");
        setResetToken(res.data.resetToken);
        setShowResetForm(true);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Error validating email. Please try again.";
      showToast("error", errorMessage);
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return <ResetPasswordForm email={email} resetToken={resetToken} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white" 
            : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/login"
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Enter your email address to reset your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-200 px-1 py-3 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white font-semibold py-3.5 rounded-full hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Reset Password Form Component
const ResetPasswordForm = ({ email, resetToken }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [resetSuccess, setResetSuccess] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.newPassword.trim()) {
      showToast("error", "Please enter a new password");
      return false;
    }

    if (formData.newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
        {
          token: resetToken,
          email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }
      );

      if (res.status === 200) {
        showToast("success", "Password reset successful!");
        setResetSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      showToast("error", errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white" 
            : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-500 text-center mb-8">
            {resetSuccess
              ? "Your password has been reset successfully"
              : "Enter your new password below"}
          </p>

          {!resetSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 px-1 py-3 pr-10 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-10 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <XCircle className="w-5 h-5" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                </span>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 px-1 py-3 pr-10 focus:outline-none focus:border-purple-600 transition-colors bg-transparent"
                  placeholder="Confirm password"
                  required
                  disabled={isLoading}
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-10 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirm ? <XCircle className="w-5 h-5" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white font-semibold py-3.5 rounded-full hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-gray-700">
                  Your password has been reset successfully!
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Redirecting to login...
              </p>
            </div>
          )}

          <p className="text-sm text-center mt-6 text-gray-600">
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
