// components/PageStats.js
import { useState, useEffect } from "react";

function PageStats({ pageId, accessToken, since, until }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchPageStats();
  }, [pageId, since, until]);

  const fetchPageStats = () => {
    const metrics =
      "page_fans,page_engaged_users,page_impressions,page_reactions_total";
    const period = "total_over_range";

    window.FB.api(
      `/${pageId}/insights`,
      "GET",
      {
        access_token: accessToken,
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
          setStats(newStats);
        }
      }
    );
  };

  return (
    <div>
      <div className="card">
        <h3>Total Followers / Fans</h3>
        <p>{stats.page_fans || "N/A"}</p>
      </div>
      <div className="card">
        <h3>Total Engagement</h3>
        <p>{stats.page_engaged_users || "N/A"}</p>
      </div>
      <div className="card">
        <h3>Total Impressions</h3>
        <p>{stats.page_impressions || "N/A"}</p>
      </div>
      <div className="card">
        <h3>Total Reactions</h3>
        <p>{stats.page_reactions_total || "N/A"}</p>
      </div>
    </div>
  );
}

export default PageStats;
