import PublicLayout from "../components/public/PublicLayout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Counter from "../components/public/Counter";

export default function Home() {
  const images = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      (prev + 1) % images.length
    );
  };

  return (
    <PublicLayout>

      {/* -------------------- CAROUSEL -------------------- */}
      <div className="w-full mt-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl shadow-xl">

            <img
              src={images[current]}
              alt="Polavaram"
              className="w-full h-full object-cover transition-all duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-6">
            <h2 className="text-white text-xl md:text-4xl font-bold text-center leading-snug">
                Rehabilitation & Resettlement Monitoring Portal
              </h2>
            </div>

            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow"
            >
              ‹
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow"
            >
              ›
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-4 space-x-3">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition ${
                  index === current ? "bg-blue-900" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto mt-16 px-4">
        <div className="h-1 w-24 bg-[var(--gov-accent)]"></div>
      </div>

      {/* -------------------- STATISTICS -------------------- */}
      <div className="max-w-7xl mx-auto mt-16 px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        <Counter target={1250} label="Total Grievances" />
        <Counter target={980} label="Resolved Cases" />
        <Counter target={210} label="In Progress" />
        <Counter target={15} label="Districts Covered" />
      </div>

      <div className="max-w-7xl mx-auto mt-16 px-4">
        <div className="h-1 w-24 bg-[var(--gov-accent)]"></div>
      </div>

      {/* -------------------- FOREWORD SECTION -------------------- */}
      <div className="max-w-7xl mx-auto mt-20 px-4 grid md:grid-cols-2 gap-12">

        {/* CM Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[var(--gov-accent)] hover:shadow-xl transition">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 text-center sm:text-left">
            <img
              src="/images/cm.jpg"
              alt="Chief Minister"
              className="w-28 h-28 object-cover rounded-full border-4 border-blue-900 mb-4 sm:mb-0"
            />
            <h3 className="text-xl md:text-2xl font-bold leading-snug">
              Foreword by Hon'ble Chief Minister
            </h3>
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed md:leading-loose text-sm md:text-base">
            The Polavaram Project represents a transformative initiative for
            the development of Andhra Pradesh. Ensuring effective rehabilitation
            and grievance resolution remains a top priority of the Government.
            This digital platform strengthens transparency and accountability
            across all administrative levels.
          </p>
        </div>

        {/* Commissioner Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[var(--gov-accent)] hover:shadow-xl transition">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 text-center sm:text-left">
            <img
              src="/images/commissioner.jpg"
              alt="Commissioner"
              className="w-28 h-28 object-cover rounded-full border-4 border-blue-900 mb-4 sm:mb-0"
            />
            <h3 className="text-xl md:text-2xl font-bold leading-snug">
              Foreword by Commissioner, R&R Department
            </h3>
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed md:leading-loose text-sm md:text-base">
            The R&R Department is committed to structured monitoring and
            systematic redressal of grievances. This system ensures proper
            hierarchical tracking, audit transparency, and timely resolution
            of issues related to the Polavaram Project.
          </p>
        </div>

      </div>

      {/* -------------------- LOGIN CTA -------------------- */}
      <div className="max-w-7xl mx-auto mt-24 px-4">
        <div className="bg-blue-900 text-white text-center py-14 px-6 rounded-xl shadow-lg">
         <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide">
            Submit and Track Grievances
          </h3>

          <p className="mb-6 text-sm md:text-base">
            For adding the issues of citizens and monitoring grievance status,
            please access the internal grievance redressal portal.
          </p>

          <Link
            to="/login"
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>

    </PublicLayout>
  );
}
