import PublicLayout from "../components/public/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-md">

        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
          About Polavaram PGRS
        </h2>

        <p className="mb-4 text-gray-700 leading-relaxed md:leading-loose">
          The Polavaram Project is one of the most significant multi-purpose
          irrigation initiatives undertaken by the Government of Andhra Pradesh.
          The Rehabilitation & Resettlement (R&R) Department plays a vital role
          in ensuring fair and transparent compensation and rehabilitation for
          affected families.
        </p>

        <p className="mb-4 text-gray-700 leading-relaxed md:leading-loose">
          The Polavaram Public Grievance Redressal System (PGRS) has been
          developed to strengthen internal monitoring, tracking, and resolution
          of grievances. The system ensures accountability through hierarchical
          processing and audit tracking.
        </p>

        <p className="mb-4 text-gray-700 leading-relaxed md:leading-loose">
          The department remains committed to transparency, responsiveness,
          and citizen welfare through structured digital governance.
        </p>

      </div>
    </PublicLayout>
  );
}
