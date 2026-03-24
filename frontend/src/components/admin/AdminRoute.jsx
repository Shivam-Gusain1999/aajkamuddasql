import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useUser();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Checking authorization...</div>;
  }

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin (or editor/reporter if you want to allow them, but docs say manage categories/users is ADMIN only)
  // Let's allow ADMIN, EDITOR, and REPORTER to view dashboard, or just ADMIN depending on your needs.
  // The API docs state ADMIN can "manage users, categories, all content".
  // Let's assume ADMIN for now, or check for specific roles.
  if (currentUser.role !== "ADMIN" && currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Is admin
  return children;
};

export default AdminRoute;
