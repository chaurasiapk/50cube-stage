import { useState } from "react";
import { getUserProfile } from "../api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";

// Login Component
export const Login = () => {
  // State variables for input, error, and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useUser(); // Access updateUser function from UserContext

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Simple auth check (client-side only for testing purposes)

    // ⚠️ NOTE: This is mock logic ONLY for testing/demo purposes.
    // In a real-world application:
    // - This check would NOT happen on the client side.
    // - You would send credentials to a secure backend.
    // - The backend would verify credentials and return a secure token (e.g., JWT).
    const allowedEmails = ["admin@50cube.com", "maya@50cube.com"];
    if (!allowedEmails.includes(email.trim())) {
      setError("Unauthorized user email.");
      return;
    }

    if (password.trim() !== "user123") {
      setError("Invalid password");
      return;
    }

    setLoading(true);

    try {
      // Simulate login by fetching user profile from API
      const res = await getUserProfile(email);

      // Store user data in cookies
      Cookies.set("user", JSON.stringify({ email: res.data.email }), {
        expires: 7, // 7 days expiry
        secure: true, // Secure flag
        sameSite: "Lax", // Cross-site request protection
      });

      // Update user context
      updateUser({ ...res.data, isLoggedIn: true });

      setLoading(false);
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      setLoading(false);
      setError("Failed to login");
    }
  };

  // Handlers for controlled inputs
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  // Render login form
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {/* Display error message if any */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Test Credentials Info */}
          <div className="p-4 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700 mb-2">
            <p className="font-medium mb-2">Use these test credentials:</p>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-gray-800">
                  User 1: Admin
                </span>
                <br />
                Email: <span className="text-blue-600">admin@50cube.com</span>
                <br />
                Password: <span className="text-blue-600">user123</span>
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  User 2: Not Admin
                </span>
                <br />
                Email: <span className="text-blue-600">maya@50cube.com</span>
                <br />
                Password: <span className="text-blue-600">user123</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
