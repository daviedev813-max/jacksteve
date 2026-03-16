import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, user, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("userRole")?.toLowerCase();

  // 1. TERMINAL LOCKED: No token found
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. IDENTIFY OPERATOR: Priority to App State, fallback to Storage
  const currentRole = user?.role && user.role !== "guest" 
    ? user.role.toLowerCase() 
    : storedRole;

  // 3. NORMALIZE PERMISSIONS
  const normalizedAllowed = allowedRoles.map(role => role.toLowerCase());

  // 4. VERIFY ACCESS
  const hasAccess = normalizedAllowed.includes(currentRole);
  
  if (!hasAccess) {
    console.warn(`[ACCESS DENIED]: ${currentRole} attempted to enter ${location.pathname}`);
    
    // SMART REDIRECT: Send them to their specific authorized portal instead of Home
    if (currentRole === "farmer") return <Navigate to="/farmer/dashboard" replace />;
    if (currentRole === "miller") return <Navigate to="/miller-portal" replace />;
    if (currentRole === "admin") return <Navigate to="/admin/fleet" replace />;
    
    return <Navigate to="/" replace />;
  }
  
  // 5. CLEARANCE GRANTED
  return children;
};

export default ProtectedRoute;
