// features/auth/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Sparkles } from "lucide-react";

const quotes = [
  { text: "The beginning is the most important part of the work.", author: "Plato" },
  { text: "Every expert was once a beginner.", author: "Rutherford B. Hayes" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: "",
  });
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showToast("error", data.message || "Registration failed");
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
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        {/* Decorative shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-48 bg-gradient-to-b from-emerald-500 to-teal-700 rounded-3xl transform -rotate-12 opacity-80"></div>
        <div className="absolute top-1/3 left-1/3 w-24 h-36 bg-[#1a1a2e] rounded-2xl transform rotate-6 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full opacity-90"></div>
        <div className="absolute bottom-1/4 right-1/3 w-28 h-40 bg-gradient-to-b from-teal-400 to-emerald-500 rounded-3xl opacity-90"></div>

        {/* Quote Content */}
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8">
            <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          </div>
          <blockquote className="text-3xl font-light text-white leading-relaxed mb-6">
            "{quote.text}"
          </blockquote>
          <p className="text-emerald-300 text-lg font-medium">— {quote.author}</p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Quote - Shows only on small screens */}
          <div className="lg:hidden mb-6 p-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl text-center">
            <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
            <blockquote className="text-base sm:text-lg font-light text-white leading-relaxed mb-2">
              "{quote.text}"
            </blockquote>
            <p className="text-emerald-300 text-sm font-medium">— {quote.author}</p>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Join EduHub and start your journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 px-1 py-2.5 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 px-1 py-2.5 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1.5">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 px-1 py-2.5 pr-10 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 px-1 py-2.5 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                  placeholder="e.g., CSE"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 px-1 py-2.5 focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                  placeholder="e.g., 3"
                  min="1"
                  max="4"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a1a2e] text-white font-semibold py-3.5 rounded-full hover:bg-[#2d2d44] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <p className="text-sm text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
