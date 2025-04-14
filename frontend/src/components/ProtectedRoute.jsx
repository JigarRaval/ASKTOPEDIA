import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component: Component }) => {
  const { user } = useAuth();

  return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
