import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="bg-[var(--gov-primary)] text-white shadow-md">
      
      {/* Top Government Strip */}
      <div className="bg-[var(--gov-primary-light)] text-xs text-center py-1 tracking-wide">
        Government of Andhra Pradesh
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          <img
            src="/images/ap-logo.png"
            alt="AP Emblem"
            className="h-12 w-auto"
          />

          <div>
            <h1 className="text-lg md:text-2xl font-bold leading-tight">
              Polavaram Public Grievance Redressal System
            </h1>
            <p className="text-xs md:text-sm text-gray-200 tracking-wide">
              Rehabilitation & Resettlement Department
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 font-medium tracking-wide">
          <Link to="/home" className="hover:text-[var(--gov-accent)] transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-[var(--gov-accent)] transition">
            About Us
          </Link>
          <Link to="/login" className="hover:text-[var(--gov-accent)] transition">
            Login
          </Link>
        </nav>

      </div>
    </header>
  );
}
