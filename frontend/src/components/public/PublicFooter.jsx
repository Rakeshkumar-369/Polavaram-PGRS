export default function PublicFooter() {
  return (
    <footer className="bg-[var(--gov-primary)] text-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm">

        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h4 className="font-bold mb-3">Polavaram PGRS</h4>
            <p>
              Rehabilitation & Resettlement Department  
              Government of Andhra Pradesh
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Contact</h4>
            <p>Email: rrdept@ap.gov.in</p>
            <p>Helpline: 1800-XXXX-XXX</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Disclaimer</h4>
            <p>
              This is an official internal grievance monitoring portal
              for Polavaram Project R&R administration.
            </p>
          </div>

        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Government of Andhra Pradesh
        </div>

      </div>
    </footer>
  );
}
