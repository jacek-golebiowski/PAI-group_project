import { useAuth } from '../AuthContext';
import {Navigate} from "react-router-dom";

export default function PrivateRoute({ children, roles = [] }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (roles.length && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }
    return children;
}
