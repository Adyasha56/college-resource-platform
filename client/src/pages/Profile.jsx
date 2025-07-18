// pages/Profile.jsx
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) {
    return <div className="text-center p-8 text-xl">Please login to view your profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Branch:</strong> {user.branch}</p>
      <p><strong>Year:</strong> {user.year}</p>
    </div>
  );
};

export default Profile;