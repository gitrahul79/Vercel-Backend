// Components/CircleChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CircleChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "ATS Score",
        data: data.values,
        backgroundColor: [
          "rgba(34, 211, 238, 0.9)", // Score
          "rgba(255,255,255,0.1)",   // Remaining
        ],
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    animation: {
      animateRotate: true,
      duration: 1200,
    },
  };

  return (
    <div
      className="chart-container"
      style={{
        width: "100%",
        maxWidth: "200px",
        height: "200px",
        margin: "auto",
        position: "relative",
      }}
    >
      <Doughnut data={chartData} options={options} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: "700",
          fontSize: "clamp(1.2rem, 4vw, 1.4rem)",
          color: "#22d3ee",
        }}
      >
        {data.values[0]}%
      </div>
    </div>
  );
};

export default CircleChart;
