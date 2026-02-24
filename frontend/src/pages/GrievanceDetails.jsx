import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import StatusDropdown from "../components/grievance/StatusDropdown";

export default function GrievanceDetails() {
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forwarding, setForwarding] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await api.get(`/grievances/${id}`);
      setGrievance(response.data.grievance);
      setAuditTrail(response.data.auditTrail);
    } catch (error) {
      console.error("Failed to fetch grievance details", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Status update handler
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);

      await api.put(`/grievances/${id}/status`, {
        status: newStatus,
      });

      fetchDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ✅ Forward handler
  const handleForward = async () => {
    if (!window.confirm("Forward this grievance to next level?")) return;

    try {
      setForwarding(true);
      await api.post(`/grievances/${id}/forward`);
      alert("Forwarded successfully");
      fetchDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Forward failed");
    } finally {
      setForwarding(false);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!grievance) return <Layout><p>No data found.</p></Layout>;

  // ✅ Permissions
  const isAssignee = Number(user?.id) === Number(grievance.assigned_to);
  const canForward = isAssignee && grievance.designation_level > 1;

  console.log("USER_ID:", user?.id);
  console.log("ASSIGNED_TO:", grievance.assigned_to);
  console.log("LEVEL:", grievance.designation_level);
  console.log("IS_ASSIGNEE:", isAssignee);
  console.log("CAN_FORWARD:", canForward);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Grievance Details (ID: {grievance.id})
      </h2>

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <p><strong>Name:</strong> {grievance.name}</p>
        <p><strong>Aadhaar:</strong> {grievance.aadhaar}</p>
        <p><strong>Father Name:</strong> {grievance.father_name}</p>
        <p><strong>Mobile:</strong> {grievance.mobile}</p>
        <p><strong>Category:</strong> {grievance.category}</p>
        <p><strong>Priority:</strong> {grievance.priority}</p>

        {/* ✅ Status with dropdown for assignee */}
        <p>
          <strong>Status:</strong>
          {isAssignee ? (
            <StatusDropdown
              value={grievance.status}
              onChange={handleStatusChange}
              disabled={updatingStatus}
            />
          ) : (
            <span className="ml-2">{grievance.status}</span>
          )}
        </p>

        <p><strong>Designation Level:</strong> {grievance.designation_level}</p>
        <p><strong>Created By:</strong> {grievance.created_by_name}</p>
        <p><strong>Assigned To:</strong> {grievance.assigned_to_name}</p>

        <p className="mt-4"><strong>Description:</strong></p>
        <p>{grievance.description}</p>

        {/* ✅ Forward button */}
        {canForward && (
          <div className="mt-6">
            <button
              onClick={handleForward}
              disabled={forwarding}
              className="bg-green-700 text-white px-5 py-2 rounded"
            >
              {forwarding ? "Forwarding..." : "Forward to Next Level"}
            </button>
          </div>
        )}

      </div>

      <h3 className="text-xl font-semibold mb-3">Audit Trail</h3>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Old Status</th>
              <th className="p-3">New Status</th>
              <th className="p-3">Changed At</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No history available
                </td>
              </tr>
            ) : (
              auditTrail.map((a, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{a.old_status}</td>
                  <td className="p-3">{a.new_status}</td>
                  <td className="p-3">
                    {new Date(a.changed_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}