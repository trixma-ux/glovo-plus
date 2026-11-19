import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ApiStatusBanner from "./components/ApiStatusBanner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Deliveries from "./pages/Deliveries";
import Users from "./pages/Users";
import Prediction from "./pages/Prediction";
import NotFound from "./pages/NotFound";

/** Route connectée ; si `roles` est donné, un utilisateur sans ce rôle est renvoyé vers /restaurants. */
function PrivateRoute({ children, roles }) {
  if (!localStorage.getItem("access_token")) return <Navigate to="/login" replace />;
  if (roles) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!roles.includes(user.role)) return <Navigate to="/restaurants" replace />;
  }
  return children;
}

const privatePages = [
  ["/dashboard", Dashboard],
  ["/restaurants", Restaurants],
  ["/products", Products],
  ["/orders", Orders],
  ["/deliveries", Deliveries],
  ["/users", Users, ["ADMIN"]],
  ["/prediction", Prediction],
];

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ApiStatusBanner />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {privatePages.map(([path, Page, roles]) => (
          <Route key={path} path={path} element={<PrivateRoute roles={roles}><Page /></PrivateRoute>} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
