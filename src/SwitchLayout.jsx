// SwitchLayout.jsx
import React, { useContext } from "react";
import AppContext from "./context/AppContext";
import AdminLayout from "./components/layouts/AdminLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import UserLayout from "./components/layouts/UserLayout";

const SwitchLayout = () => {
  const { activeUser } = useContext(AppContext);

  if (!activeUser) {
    return <AuthLayout />;
  } else if (activeUser.role === "admin") {
    return <AdminLayout />;
  } else {
    return <UserLayout />;
  }
};

export default SwitchLayout;
