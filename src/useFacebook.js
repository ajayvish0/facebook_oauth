// useFacebookSDK.js
import { useState, useEffect } from "react";

export function useFacebookSDK() {
  const [isFBInitialized, setIsFBInitialized] = useState(false);

  useEffect(() => {
    // Check if the SDK is already loaded
    if (window.FB) {
      setIsFBInitialized(true);
      return;
    }

    // Load the SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID.trim(),
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
      setIsFBInitialized(true);
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
  }, []);

  return isFBInitialized;
}
