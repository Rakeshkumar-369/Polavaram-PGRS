import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function GrievanceList() {
  const [grievances, setGrievances] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await api.get("/grievances");
      setGrievances(response.data);
    } catch (err) {
      console.error("Error fetching grievances", err);
      setError("Failed to load grievances.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/grievances/${id}/status`, { status: newStatus });
      fetchGrievances();
    } catch (err) {
      console.error("Status update failed", err);
      alert(err.response?.data?.message || "Status update failed.");
    }
  };

  const forwardGrievance = async (id) => {
    const confirmForward = window.confirm(
      "Are you sure you want to forward this grievance to the next level?"
    );

    if (!confirmForward) return;

    try {
      await api.put(`/grievances/${id}/forward`);
      fetchGrievances();
    } catch (err) {
      console.error("Forward failed", err);
      alert(err.response?.data?.message || "Forwarding failed.");
    }
  };

  const filteredData = grievances.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Grievances</h2>

      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name..."
          className="border rounded px-3 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No grievances found.
                  </td>
                </tr>
              ) : (
                filteredData.map((g) => (
                  <tr key={g.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{g.id}</td>
                    <td className="p-4">{g.name}</td>
                    <td className="p-4">{g.category}</td>
                    <td className="p-4">{g.priority}</td>

                    <td className="p-4">
                      {(user.role === "OFFICER" ||
                        user.role === "COMMISSIONER") ? (
                        <select
                          value={g.status}
                          onChange={(e) =>
                            updateStatus(g.id, e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="Registered">Registered</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Redressed">Redressed</option>
                          <option value="Reopened">Reopened</option>
                        </select>
                      ) : (
                        <span>{g.status}</span>
                      )}
                    </td>

                    <td className="p-4 space-x-3">
                      <button
                        onClick={() => navigate(`/grievances/${g.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>

                      {user.role === "OFFICER" && (
                        <button
                          onClick={() => forwardGrievance(g.id)}
                          className="text-purple-600 hover:underline"
                        >
                          Forward
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
