import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MonthlySalesLineChart = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [chartDimensions, setChartDimensions] = useState({
    width: 800, // Initial width
    height: 300, // Initial height
  });

  useEffect(() => {
    // Make a GET request to your backend endpoint to fetch the monthly sales data
    axios
      .get("http://localhost:7000/calculateTotalSalesByMonth")
      .then((response) => {
        setMonthlySales(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Handle window resize and update chart dimensions
  const handleResize = useCallback(() => {
    const chartContainer = document.getElementById("chart-container");
    if (chartContainer) {
      const { clientWidth, clientHeight } = chartContainer;
      setChartDimensions({
        width: clientWidth,
        height: clientHeight,
      });
    }
  }, []);

  // Attach window resize event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size calculation
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="container">
      <h3 className="text-center mt-3 text-primary ">Monthly Sales Stats</h3>
      <div className="d-flex justify-content-center">
        <div
          className="col-lg-12 col-md-12 col-sm-12"
          id="chart-container"
          style={{ maxWidth: "100%", overflowX: "" }}
        >
          <LineChart
            width={chartDimensions.width}
            height={chartDimensions.height}
            data={monthlySales}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="month"
              // label={{
              //   value: "MONTH OF THE YEAR",
              //   position: "insideBottom",
              //   style: { fill: "blue" },
              // }}
              angle={-90} // Rotate the label text by -90 degrees
              textAnchor="end" // Set the text anchor to 'end' to properly position the rotated text
            />

            <YAxis
              label={{
                value: "SALES (Kshs)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "blue" },
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesLineChart;
