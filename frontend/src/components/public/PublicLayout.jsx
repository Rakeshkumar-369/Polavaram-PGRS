import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-grow">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}
