import { Chart } from "@/components/Chart";
import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <section>
        {/** TODO: Chart */}
        <Chart />

        {/** TODO: Summary List */}
        <ul className="dashboard-summary-list"></ul>
      </section>
    </div>
  );
};

export default Dashboard;
