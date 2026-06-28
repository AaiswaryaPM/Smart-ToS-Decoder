import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function RiskChart({ riskScore }) {
  const safe = Math.max(100 - riskScore, 0);

  const getColor = () => {
    if (riskScore <= 30) return "#16a34a"; // green
    if (riskScore <= 60) return "#facc15"; // yellow
    if (riskScore <= 80) return "#f97316"; // orange
    return "#dc2626"; // red
  };

  const data = {
    datasets: [
      {
        data: [riskScore, safe],
        backgroundColor: [getColor(), "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="risk-chart">
      <Doughnut data={data} options={options} />

      <div className="chart-center">
        {riskScore}%
      </div>
    </div>
  );
}

export default RiskChart;