import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Sparkles } from "lucide-react";

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Pick a random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Login successful! Redirecting...");
        login(data.user, data.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        showToast("error", data.message || "Login failed");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Server error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex">
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

      {/* Left Side - Quote Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-12 items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Decorative shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-48 bg-gradient-to-b from-purple-500 to-purple-700 rounded-3xl transform -rotate-12 opacity-80"></div>
        <div className="absolute top-1/3 left-1/3 w-24 h-36 bg-[#1a1a2e] rounded-2xl transform rotate-6 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full opacity-90"></div>
        <div className="absolute bottom-1/4 right-1/3 w-28 h-40 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-3xl opacity-90"></div>

        {/* Quote Content */}
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-6" />
          </div>
          <blockquote className="text-3xl font-light text-white leading-relaxed mb-6">
            "{quote.text}"
          </blockquote>
          <p className="text-purple-300 text-lg font-medium">— {quote.author}</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Quote - Shows only on small screens */}
          <div className="lg:hidden mb-6 p-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl text-center">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-3" />
            <blockquote className="text-base sm:text-lg font-light text-white leading-relaxed mb-2">
              "{quote.text}"
            </blockquote>
            <p className="text-purple-300 text-sm font-medium">— {quote.author}</p>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="w-12 h-12 bg-[#1a1a2e] rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Please enter your details
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 px-1 py-3 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 px-1 py-3 pr-10 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-10 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a1a2e] text-white font-semibold py-3.5 rounded-full hover:bg-[#2d2d44] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-gray-900 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
