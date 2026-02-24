import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p>Loading dashboard...</p>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <p>No dashboard data available.</p>
      </Layout>
    );
  }

  const getStatusCount = (status) =>
    data.statusCounts.find((s) => s.status === status)?.count || 0;

  const getPriorityCount = (priority) =>
    data.priorityCounts.find((p) => p.priority === priority)?.count || 0;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Grievances</p>
          <h3 className="text-2xl font-bold">{data.total}</h3>
        </div>

        <div className="bg-yellow-100 p-5 rounded-xl shadow">
          <p className="text-gray-600">In Progress</p>
          <h3 className="text-2xl font-bold">
            {getStatusCount("In Progress")}
          </h3>
        </div>

        <div className="bg-green-100 p-5 rounded-xl shadow">
          <p className="text-gray-600">Redressed</p>
          <h3 className="text-2xl font-bold">
            {getStatusCount("Redressed")}
          </h3>
        </div>

        <div className="bg-red-100 p-5 rounded-xl shadow">
          <p className="text-gray-600">High Priority</p>
          <h3 className="text-2xl font-bold">
            {getPriorityCount("High")}
          </h3>
        </div>

      </div>
    </Layout>
  );
}
