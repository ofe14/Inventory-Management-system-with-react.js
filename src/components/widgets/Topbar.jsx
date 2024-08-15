import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import LogoText from "./LogoText";
import { auth } from '../../db/db_config';
import { signOut } from "firebase/auth";

const Topbar = () => {
  const { setLoading, activeUser, setActiveUser } = useContext(AppContext);

  const navigate = useNavigate();

  const logoutHandler = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setActiveUser(null);
      localStorage.setItem('activeUser', JSON.stringify(""));
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex justify-between px-4 text-black"style={{margin:10}}>
        <LogoText/>
        <div className="flex gap-4">
          <div className="flex justify-center items-center">
            <span className="font-semibold font-sans">
              {activeUser?.username}
            </span>
            <span className="mx-2 font-semibold">|</span>
            <span className="font-sans text-sm">{activeUser?.role}</span>
          </div>
          {/* logout */}
          <span
            className="bg-error-color font-semibold rounded-lg p-1 px-2 flex items-center justify-center outline-none text-white-ish cursor-pointer hover:bg-secondary-color"
            onClick={logoutHandler}
          >
            Logout
          </span>
        </div>
      </div>
    </>
  );
};

export default Topbar;
