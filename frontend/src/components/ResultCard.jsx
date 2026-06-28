import RiskChart from "./RiskChart";
import HighlightedText from "./HighlightedText";

function ResultCard({ result }) {
  if (!result) return null;

  const risk = result.riskScore ?? 0;

  const getRiskLabel = (score) => {
    if (score <= 30) return "Safe";
    if (score <= 50) return "Low Risk";
    if (score <= 70) return "Moderate Risk";
    if (score <= 85) return "High Risk";
    return "Very High Risk";
  };

  const getRiskClass = (score) => {
    if (score <= 30) return "low";
    if (score <= 60) return "medium";
    if (score <= 80) return "high";
    return "very-high";
  };

  return (
    <div className="result-card">

      {/* HEADER */}
      <div className="result-header">
        <h2>📊 Analysis Report</h2>

        <span className={`risk-pill ${getRiskClass(risk)}`}>
          {getRiskLabel(risk)}
        </span>
      </div>

      {/* METRICS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Risk Score</h3>
          <p>{risk}%</p>
        </div>

        <div className="stat-card">
          <h3>Key Points</h3>
          <p>{result.keyPoints?.length ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Summary Words</h3>
          <p>{result.summary?.split(" ").length ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Status</h3>
          <p>{risk > 60 ? "Unsafe" : "Safe"}</p>
        </div>
      </div>

      {/* VISUAL RISK */}
      <div className="chart-section">
        <RiskChart riskScore={risk} />
      </div>

      {/* SUMMARY SECTION */}
      <div className="section">
        <h3>🧾 Summary</h3>
        <p className="text-box">{result.summary}</p>
      </div>

      {/* KEY POINTS (ONLY UPDATED PART) */}
      <div className="section">
        <h3>📌 Key Findings</h3>

        <ul className="key-list">
          {result.keyPoints?.map((point, i) => (
            <li key={i}>
              <HighlightedText
                text={point}
                keywords={result.riskSignals}
                riskLevel={
                  risk > 70
                    ? "high"
                    : risk > 40
                    ? "medium"
                    : "low"
                }
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Permissions */}

      <div className="section">
        <h3>🔐 Permission Detection</h3>
        <div className="permission-grid">
        {result.permissions?.map((permission,index)=>(
        <div
        className="permission-card"
        key={index}
        >

        <div className="permission-header">
        <h4>{permission.name}</h4>
        <span
        className={`permission-status ${
        permission.status
        .toLowerCase()
        .replace(/\s/g,"-")
        }`}
        >
        {permission.status}
        </span>
        </div>
        <p>{permission.reason}</p>
        </div>
        ))}
        </div>
      </div>

    </div>
  );
}

export default ResultCard;