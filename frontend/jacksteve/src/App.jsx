import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// --- HELPERS ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- PAGES & COMPONENTS ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingSupport from "./components/FloatingSupport";
import Home from "./pages/Home";
import Services from "./pages/Services";
import  Contact from "./pages/Contact";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

// FARMER PORTAL PAGES
import FarmerDashboard from "./pages/FarmerDashboard";
import MyHarvests from "./pages/MyHarvests";
import PickupSchedule from "./pages/PickupSchedule";
import Payments from "./pages/Payments";

// MILLER PORTAL
import MillerDashboard from "./pages/MillerDashboard";
import BulkProcurement from "./pages/BulkProcurement";
import UnitHealth from "./pages/UnitHealth";
import BackhaulLoop from "./pages/BackhaulLoop";
import FinancialTerminal from "./pages/FinancialTerminal";

// ADMIN COMMAND CENTER PAGES
import AdminFleetDashboard from "./pages/AdminFleetDashboard";
import AdminDispatchControl from "./pages/AdminDispatchControl";
// Note: Employees, Maintenance, and AdminFinancials are handled as Tabs 
// inside AdminFleetDashboard, but if you want them as direct routes, you add them here.

function App() {
  const [user, setUser] = useState(() => {
    // This function only runs ONCE when the app first loads
    const savedRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    
    if (token && savedRole) {
      return { 
        role: savedRole.toLowerCase(), 
        authenticated: true, 
        token 
      };
    }
    return { role: "guest", authenticated: false };
  });

  // REMOVE the useEffect that was calling setUser!
  // It is no longer needed because the state initializes correctly above.

  const handleLogin = (userData) => {
    const cleanRole = userData.role.toLowerCase();
    
    // 1. Update Storage
    localStorage.setItem("userRole", cleanRole);
    localStorage.setItem("token", userData.token);

    // 2. Update State
    setUser({ 
      ...userData, 
      role: cleanRole, 
      authenticated: true 
    });
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setUser({ role: "guest", authenticated: false });
    window.location.href = "/login"; 
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-primary selection:text-white">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-grow">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />

            {/* FARMER CONTROL ROUTES (Strategic Access) */}
            <Route path="/farmer-portal" element={
              <ProtectedRoute user={user} allowedRoles={["farmer", "admin"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/harvests" element={
              <ProtectedRoute user={user} allowedRoles={["farmer", "admin"]}>
                <MyHarvests />
              </ProtectedRoute>
            } />

            <Route path="/schedule" element={
              <ProtectedRoute user={user} allowedRoles={["farmer", "admin"]}>
                <PickupSchedule />
              </ProtectedRoute>
            } />

            <Route path="/payments" element={
              <ProtectedRoute user={user} allowedRoles={["farmer", "admin"]}>
                <Payments />
              </ProtectedRoute>
            } />

            {/* MILLER PORTAL (Industrial Supply) */}
            <Route path="/miller-portal" element={
              <ProtectedRoute user={user} allowedRoles={["miller", "admin"]}>
                <MillerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/bulk-procurement" element={
              <ProtectedRoute user={user} allowedRoles={["miller", "admin"]}>
                <BulkProcurement />
              </ProtectedRoute>
            } />
            <Route path="/unit-health" element={
              <ProtectedRoute user={user} allowedRoles={["miller", "admin"]}>
                <UnitHealth />
              </ProtectedRoute>
            } />
            <Route path="/backhaul-loop" element={
              <ProtectedRoute user={user} allowedRoles={["miller", "admin"]}>
                <BackhaulLoop />
              </ProtectedRoute>
            } />
            <Route path="/financial-terminal" element={
              <ProtectedRoute user={user} allowedRoles={["miller", "admin"]}>
                <FinancialTerminal />
              </ProtectedRoute>
            } />

            {/* ADMIN COMMAND CENTER (Total Oversight) */}
            <Route path="/admin/fleet" element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminFleetDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dispatch" element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminDispatchControl />
              </ProtectedRoute>
            } />
            

            {/* 404 OFF-ROAD VIEW */}
            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </main>
        
        <FloatingSupport />
        <Footer />
      </div>
    </Router>
  );
}

const NotFoundView = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
    <h2 className="text-[12rem] font-black italic text-neutral/5 tracking-tighter leading-none select-none">404</h2>
    <div className="relative -mt-20">
      <p className="text-3xl font-black italic uppercase text-neutral tracking-tighter">Route <span className="text-primary">Off-Road</span></p>
      <p className="text-[10px] font-black uppercase text-neutral/40 tracking-widest mt-2 italic">Jacksteve Logistics Terminal: Signal Lost</p>
      <Link to="/" className="btn btn-primary rounded-xl px-12 mt-8 font-black italic uppercase shadow-xl shadow-primary/20 border-none">
        Return to Base
      </Link>
    </div>
  </div>
);

export default App;
