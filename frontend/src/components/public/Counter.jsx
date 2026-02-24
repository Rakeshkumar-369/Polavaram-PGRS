import { useEffect, useState } from "react";

export default function Counter({ target, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="text-3xl font-bold text-blue-900">{count}</h3>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}
