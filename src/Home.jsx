import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [pageStats, setPageStats] = useState({});

  const apiKey = `"${import.meta.env.VITE_FACEBOOK_APP_ID.trim()}"`;
  console.log(apiKey);
  const fetchUserData = useCallback(() => {
    window.FB.api("/me", { fields: "name,email,picture" }, function (response) {
      if (response && !response.error) {
        setUserData(response);
        setIsAuthenticated(true);
        fetchPages(response.id);
      } else {
        setError("Failed to fetch user data");
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
  }, [setIsAuthenticated]);

  const fetchPages = (userId) => {
    window.FB.api(
      `/${userId}/accounts`,
      "GET",
      { fields: "name,access_token" },
      function (response) {
        if (response && !response.error) {
          setPages(response.data);
        } else {
          setError("Failed to fetch pages");
        }
      }
    );
  };

  const fetchPageStats = useCallback(() => {
    if (!selectedPageId || !since || !until) return;

    const metrics =
      "page_fans,page_engaged_users,page_impressions,page_reactions_total";
    const period = "total_over_range";

    window.FB.api(
      `/${selectedPageId}/insights`,
      "GET",
      {
        metric: metrics,
        period: period,
        since: since,
        until: until,
      },
      function (response) {
        if (response && !response.error) {
          const newStats = {};
          response.data.forEach((item) => {
            newStats[item.name] = item.values[0].value;
          });
          setPageStats(newStats);
        } else {
          setError("Failed to fetch page stats");
        }
      }
    );
  }, [selectedPageId, since, until]);

  useEffect(() => {
    fetchPageStats();
  }, [fetchPageStats]);
  const handlePageSelect = (e) => {
    setSelectedPageId(e.target.value);
  };

  const checkLoginState = useCallback(() => {
    if (window.FB) {
      window.FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          fetchUserData();
        } else {
          setLoading(false);
          setIsAuthenticated(false);
          navigate("/signin");
        }
      });
    } else {
      setError("Facebook SDK not loaded");
      setLoading(false);
    }
  }, [fetchUserData, navigate, setIsAuthenticated]);

  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: apiKey,
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
        checkLoginState();
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

    if (window.FB) {
      checkLoginState();
    } else {
      loadFacebookSDK();
    }

    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Loading timed out. Please refresh the page.");
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [checkLoginState, loading]);

  const handleLogout = () => {
    setLoading(true);
    window.FB.logout(function (response) {
      setLoading(false);
      if (response.status !== "connected") {
        setIsAuthenticated(false);
        localStorage.removeItem("fblst_1056001626113009");
        navigate("/signin");
      } else {
        setError("Logout failed");
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen ">
      <div className="bg-blue-900 text-white">
        {userData && (
          <div>
            <h2 className="text-center font-semibold text-lg py-2 ">
              Welcome, {userData.name}!
            </h2>
            <div className="flex justify-between items-center px-5 py-2">
              <img
                src={userData.picture.data.url}
                className="rounded-full shadow-xl  "
                alt="Profile"
              />
              <p>Email: {userData.email}</p>
              <button
                onClick={handleLogout}
                className="bg-green-500 px-5 py-1 rounded-lg shadow-md "
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="p-16 text-center">
        <h3 className="font-semibold p-2">Select a Page:</h3>
        <select
          className="my-2 shadow-md px-5 py-2 bg-zinc-500 rounded-lg"
          value={selectedPageId}
          onChange={handlePageSelect}
        >
          <option value="">Select a page</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>

        <h3 className="py-2 ">Select Date Range:</h3>
        <input
          type="date"
          value={since}
          onChange={(e) => setSince(e.target.value)}
          className="mx-5    px-4"
        />
        <input
          type="date"
          value={until}
          onChange={(e) => setUntil(e.target.value)}
        />
      </div>
      {selectedPageId && (
        <div className="flex gap-4 p-8 max-md:flex-col items-center ">
          <h3 className="font-bold text-lg text-center">Page Stats:</h3>
          <div className="p-8 bg-yellow-100 rounded-xl shadow-lg ">
            <h4 className="font-semibold ">Total Followers / Fans</h4>
            <p>{pageStats.page_fans || "N/A"}</p>
          </div>
          <div className="p-8 bg-yellow-100 rounded-xl shadow-lg">
            <h4 className="font-semibold ">Total Engagement</h4>
            <p>{pageStats.page_engaged_users || "N/A"}</p>
          </div>
          <div className="p-8 bg-yellow-100 rounded-xl shadow-lg">
            <h4 className="font-semibold ">Total Impressions</h4>
            <p>{pageStats.page_impressions || "N/A"}</p>
          </div>
          <div className="p-8 bg-yellow-100 rounded-xl shadow-lg">
            <h4 className="font-semibold ">Total Reactions</h4>
            <p>{pageStats.page_reactions_total || "N/A"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
