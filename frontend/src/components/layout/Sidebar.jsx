import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-8">Polavaram PGRS</h2>

      <nav className="space-y-3">
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/grievances"
          className="block px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          Grievances
        </Link>

        <Link
          to="/new-grievance"
          className="block px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          New Grievance
        </Link>

        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          Reports
        </Link>
      </nav>
    </div>
  );
}
