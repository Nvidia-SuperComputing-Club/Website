import { Outlet } from "react-router-dom";
import AnimatedNavFramer from "../components/AnimatedNavFramer.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AnimatedNavFramer />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
