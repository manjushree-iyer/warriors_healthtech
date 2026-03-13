import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-dm text-navy-900 bg-warm-white">
      <Navbar />
      <main className="flex-grow pt-16 relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
