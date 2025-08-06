import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserProfile } from "../api";
import { useNavigate } from "react-router-dom";

// Create a context for user data
const UserContext = createContext();

/**
 * UserProvider wraps your app and provides user-related state and functions
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    credits: "",        // Default credits (could be number or string)
    isLoggedIn: false,  // User login state
    name: "",           // User name
    email: "",          // User email
    isAdmin: false,     // Admin flag
  });

  const navigate = useNavigate();

  /**
   * Fetch user profile from API using cookie-stored email
   * In real applications, authentication would be done using tokens (e.g., JWT)
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Read user info (e.g. email) from cookie
        const cookieUser = JSON.parse(Cookies.get("user") ?? "{}");

        // If no email is found, redirect to login
        if (!cookieUser.email) {
          navigate("/login");
          return;
        }

        // Fetch user profile from API
        const response = await getUserProfile(cookieUser.email);

        // Update user state
        setUser({
          ...response.data,
          isLoggedIn: true,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect to login on error
      }
    };

    fetchUserData();
  }, []);

  /**
   * Update user's credits
   * @param {number} newCredits
   */
  const updateCredits = (newCredits) => {
    setUser((prevUser) => ({
      ...prevUser,
      credits: newCredits,
    }));
  };

  /**
   * Update entire user object or specific fields
   * @param {Object} newUser - Partial or full user object
   */
  const updateUser = (newUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUser,
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateCredits, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to access user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
