const User = require("../models/User");

/**
 * @desc    Get user profile by email
 * @route   GET /api/user/profile?email=example@example.com
 * @access  Private (Authentication should be applied in real cases)
 */
const getUserProfile = async (req, res) => {
  // Extract email from query parameters
  const { email } = req.query;

  // Validate email presence
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    /**
     * 🔐 In real applications:
     * - Apply middleware to check if the user is authenticated (e.g., using JWT).
     * - Verify that the requester has permission to access this user's profile.
     *   (For example, the user must be accessing their own profile or be an admin.)
     */

    // Find user in the database by email
    const user = await User.findOne({ email });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /**
     * 🛡️ Optional (Real-world best practices):
     * - Never return sensitive information like passwords, tokens, etc.
     * - Use `.select()` to control fields returned
     *   e.g., User.findOne({ email }).select("name email createdAt")
     */

    // Return user data (you may sanitize or filter the fields here)
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
};
