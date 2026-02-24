import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">
        Officer Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="text-red-600 font-medium hover:underline"
      >
        Logout
      </button>
    </div>
  );
}
