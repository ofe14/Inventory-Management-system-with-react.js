import { useNavigate } from "react-router-dom";
import { info } from "../../helpers/Alert";
import { auth } from '../../db/db_config';
import { signOut } from "firebase/auth";
import inventory from "../../assets/images/inventory.png";
import AppContext from "../../context/AppContext";
import { useContext } from "react";

const UserNavbar = () => {
  const navigate = useNavigate();
  const { setLoading, activeUser, setActiveUser } = useContext(AppContext);


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
    <div className="bg-white shadow-md w-full flex justify-between items-center p-2 px-8 mb-24">
      {/* left */}
      <img
        src={inventory}
        alt="Logo"
        className="w-16 h-16" // Adjust the width and height as needed
      />
      {/* Middle */}
      <span className="font-inter text-[35px] ont-medium font-semibold leading-29 tracking-normal text-left z-10" style={{color:"black"}}>
        ENNY'S STOCK_APP
      </span>
      {/* right */}
      <div className="flex gap-4">
        <div className="flex flex-col justify-center items-center" style={{color:"black"}}>
          { <span className="font-semibold font-sans">
            {activeUser.firstname}{"  "}{activeUser.lastname}
          </span> }
          { <span className="font-sans text-sm">{activeUser.role}</span> }
        </div>
        {/* logout */}
        <span
          className="bg-red-500 rounded-lg p-2 px-4 flex items-center justify-center outline-none text-white cursor-pointer hover:bg-red-700"
          onClick={logoutHandler}
        >
          Logout
        </span>
      </div>
    </div>
  );
};

export default UserNavbar;
