import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useFacebookSDK } from "./useFacebookSDK";

const SignIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isFBInitialized = useFacebookSDK();

  useEffect(() => {
    if (isFBInitialized) {
      checkLoginStatus();
    }
  }, [isFBInitialized]);

  const checkLoginStatus = () => {
    window.FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        setIsLoggedIn(true);
        navigate("/");
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });
  };

  const handleLogin = () => {
    if (!isFBInitialized) {
      setError("Facebook SDK not initialized");
      return;
    }

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          setError("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email,pages_show_list,pages_read_engagement" }
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="font-bold text-xl text-green-400">Sign In</h2>
      <button
        onClick={handleLogin}
        className="bg-blue-800 text-white px-4 py-2 rounded-md m-2 shadow-lg"
        disabled={!isFBInitialized}
      >
        Login with Facebook
      </button>
    </div>
  );
};

export default SignIn;
