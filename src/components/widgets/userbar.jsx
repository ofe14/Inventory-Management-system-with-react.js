import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

const Userbar = () => {
  const { navbarActive, setNavbarActive, getAllProducts, unreadNotifications } =
    useContext(AppContext);

  const setProducts = () => {
    getAllProducts();
    setNavbarActive("products");
  };

  return (
    <div className="bg-white shadow-md rounded-lg flex gap-3  items-center p-2 min-w-32" style={{marginBottom:10}}>
      <NavLink
        className={
          navbarActive === "Tracksales"
            ? "flex gap-2 items-center font-bold text-[16px] text-primary-color bg-off-teal p-2 rounded-md cursor-pointer hover:bg-off-teal"
            : "flex gap-2 items-center font-bold text-[16px] text-primary-color bg-off-teal/20 p-2 rounded-md cursor-pointer hover:bg-off-teal"
        }
        onClick={() => setProducts()}
        exact
        to="/user/Tracksales"
      >
        <svg
          width="25"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.3 1.5C13.3 0.5 12 0 10.8 0C9.6 0 8.2 0.5 7.3 1.5L1.5 7.1C-0.5 9.1 -0.5 12.2 1.5 14.2C3.5 16.2 6.6 16.2 8.6 14.2L14.3 8.5C16.2 6.6 16.2 3.4 14.3 1.5ZM12.9 7.1L10.1 9.9L6.5 6.4L2.1 10.8C2.1 10 2.3 9.1 3 8.5L8.7 2.8C9.2 2.3 10 2 10.7 2C11.4 2 12.2 2.3 12.8 2.8C14 4.1 14 5.9 12.9 7.1ZM17.7 5.1C17.7 5.9 17.5 6.6 17.3 7.4C18.3 8.6 18.3 10.4 17.2 11.5L14.4 14.3L12.9 12.8L10.1 15.6C8.8 16.9 7 17.6 5.3 17.6C5.5 17.9 5.7 18.2 6 18.5C8 20.5 11.1 20.5 13.1 18.5L18.8 12.8C20.8 10.8 20.8 7.7 18.8 5.7C18.3 5.5 18 5.3 17.7 5.1Z"
            fill="#645AFF"
          />
        </svg>
        All Products
      </NavLink>
      <NavLink
        className={
          navbarActive === "SalesRecord"
            ? "flex gap-2 items-center font-bold text-[16px] text-primary-color bg-off-teal p-2 rounded-md cursor-pointer hover:bg-off-teal"
            : "flex gap-2 items-center font-bold text-[16px] text-primary-color bg-off-teal/20 p-2 rounded-md cursor-pointer hover:bg-off-teal"
        }
        onClick={() => setNavbarActive("SalesRecord")}
        exact
        to="/user/Sales_record"
      >
        <svg
          width="19"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3 2C18.3 0.897 17.403 0 16.3 0H2.30005C1.19705 0 0.300049 0.897 0.300049 2V9H18.3V2ZM13.3 6H5.30005V3H7.30005V4H11.3V3H13.3V6ZM2.30005 20H16.3C17.403 20 18.3 19.103 18.3 18V11H0.300049V18C0.300049 19.103 1.19705 20 2.30005 20ZM5.30005 14H7.30005V15H11.3V14H13.3V17H5.30005V14Z"
            fill="#4842AC"
            fill-opacity="0.68"
          />
        </svg>
        Sales Record
      </NavLink>
    </div>
  );
};

export default Userbar;
