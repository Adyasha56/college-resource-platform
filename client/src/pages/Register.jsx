// src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    branch: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Registration Successful");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primaryDark mb-6">
          Join CollegeHub 🎓
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-primaryDark font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-primaryDark font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-primaryDark font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-primaryDark font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1"
              max="4"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-primaryDark font-medium mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-2 rounded hover:bg-primaryDark transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
