import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initFacebookSDK = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "1056001626113009", // Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });

        checkLoginStatus();
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
    };

    initFacebookSDK();
  }, []);

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
    if (window.FB) {
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
    } else {
      setError("Facebook SDK not loaded");
    }
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
      >
        Login with Facebook{" "}
      </button>
    </div>
  );
};

export default SignIn;
