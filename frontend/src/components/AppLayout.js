import Navbar from "./navbar/Navbar";

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="app-content">
        {children}
      </main>
    </>
  );
}