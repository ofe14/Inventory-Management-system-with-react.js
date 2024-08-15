// routes
import UserRoutes from "../routes/UserRoutes";
import UserNavbar from "../widgets/UserNavbar";
import Navbar from "../widgets/Navbar";
import Topbar from "../widgets/Topbar";
import Userbar from "../widgets/userbar";

const UserLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-x-hidden bg-teal-100">
      <Topbar />
      <Userbar/>
      <div className="mx-auto w-[100%] min-h-[60%] flex flex-col justify-center">
        <UserRoutes />
      </div>
    </div>
  );
};

export default UserLayout;
