import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFBInitialized, setIsFBInitialized] = useState(false);
  const navigate = useNavigate();
  const apiKey = `"${import.meta.env.VITE_FACEBOOK_APP_ID.trim()}"`;
  useEffect(() => {
    const initFacebook = async () => {
      try {
        await loadFacebookSDK();
        setIsFBInitialized(true);
        checkLoginStatus();
      } catch (error) {
        setError("Failed to initialize Facebook SDK");
        setIsLoading(false);
      }
    };

    initFacebook();
  }, []);
  const loadFacebookSDK = () => {
    return new Promise((resolve) => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: apiKey,
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
        resolve();
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    });
  };
  const checkLoginStatus = () => {
    if (window.FB) {
      window.FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          setIsLoggedIn(false);
        }
        setIsLoading(false);
      });
    } else {
      setError("Facebook SDK not loaded");
      setIsLoading(false);
    }
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
