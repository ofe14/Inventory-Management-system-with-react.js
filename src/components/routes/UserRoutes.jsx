import { Route, Routes } from "react-router-dom";

// components
import Layed from "../Layed";
// import Login from "../../pages/auth/login/Login";
// import Login from "../../pages/auth/login/Login";
import Sales from "../../pages/user/Tracksales";
import ErrorPage from "../../pages/ErrorPage";
import SalesRecord from "../../pages/user/Sales_record";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layed />}>
        <Route index element={<Sales />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/user/Tracksales" element={<Sales/>} />
        <Route path="/user/Sales_record" element={<SalesRecord/>} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
