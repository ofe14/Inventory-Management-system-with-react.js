import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../db/db_config";
import { error } from "../helpers/Alert";
// import axios from "axios";

const AppContext = createContext();

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
  /*
        ********
        *********
        ***********
        STATES
      */

  // MISC
  const [topbarTitle, setTopbarTitle] = useState("Dashboard");
  const [navbarActive, setNavbarActive] = useState("products");
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState({});
  const [token, setToken] = useState();
  const [switchAuthLayout, setSwitchAuthLayout] = useState("user");

  // PRODUCTS
  const [allProducts, setAllProducts] = useState();
  const [oneProduct, setOneProduct] = useState();
  const [productId, setProductId] = useState();
  const [showAddProducts, setShowAddProducts] = useState();
  const [showEditProducts, setShowEditProducts] = useState();

  // USERS
  const [allUsers, setAllUsers] = useState();
  const [oneUser, setOneUser] = useState();
  const [userId, setUserId] = useState();
  const [showAddUsers, setShowAddUsers] = useState();
  const [showEditUsers, setShowEditUsers] = useState();

  // CATEGORIES
  const [allCategories, setAllCategories] = useState();
  const [oneCategory, setOneCategory] = useState();
  const [categoryId, setCategoryId] = useState();
  const [showAddCategory, setShowAddCategory] = useState();
  const [showEditCategory, setShowEditCategory] = useState(false);

  // SHELVES
  const [allShelves, setAllShelves] = useState();
  const [oneShelf, setOneShelf] = useState();
  const [shelfId, setShelfId] = useState();
  const [showAddShelf, setShowAddShelf] = useState();
  const [showEditShelf, setShowEditShelf] = useState(false);

  // NOTIFICATIONS
  const [allNotifications, setAllNotifications] = useState();
  const [unreadNotifications, setUnreadNotifications] = useState(false);

  // **************** //
  //*** FUNCTIONS ***//
  // **************** //

  // USERS
  // Get active user
  const getActiveUser = async () => {
    try {
      const userId = getAuth().currentUser.uid;
  
      const userDoc = await getDoc(doc(db, "Users", userId));
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setActiveUser(userData);
      } else {
        error("User not found.");
      }
    } catch (err) {
      error("Something went wrong.");
      console.log("Error:", err);
    }
  };

  // Get One User
  const getOneUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        // `https://peams-api.onrender.com/api/products`,
        `https://peams-api.onrender.com/api/users/one?id=${userId}`,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      // console.log(
      //   "🚀 ~ file: AppContext.jsx:139 ~ getOneUser ~ response:",
      //   response
      // );
      setLoading(false);
      setOneUser(response.data.data);
    } catch (err) {
      console.log("🚀 ~ file: AppContext.jsx:143 ~ getOneUser ~ err:", err);
      setLoading(false);
      error("Couldn't fetch product");
      // error(err.response.data?.error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        // `https://peams-api.onrender.com/api/products`,
        `https://peams-api.onrender.com/api/products`,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      // console.log(
      //   "🚀 ~ file: AppContext.jsx:91 ~ getAllProducts ~ response:",
      //   response
      // );
      setAllProducts(response.data.data);
    } catch (err) {
      console.log(
        "🚀 ~ file: AppContext.jsx:94 ~ getAllProducts ~ error:",
        err
      );
      error("Couldn't fetch products");
      error(err.response.data?.error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        /*
          ********
          *********
          ***********
          MISC
        */
        token,
        loading,
        activeUser,
        topbarTitle,
        navbarActive,
        switchAuthLayout,
        
        setToken,
        setLoading,
        setActiveUser,
        setTopbarTitle,
        setNavbarActive,
        setSwitchAuthLayout,

        // Products
        productId,
        oneProduct,
        allProducts,
        showAddProducts,
        showEditProducts,

        setProductId,
        setOneProduct,
        setAllProducts,
        getAllProducts,
        setShowAddProducts,
        setShowEditProducts,

        // Users
        userId,
        oneUser,
        allUsers,
        showAddUsers,
        showEditUsers,

        setUserId,
        setOneUser,
        setAllUsers,
        setShowAddUsers,
        setShowEditUsers,

        // Categories
        categoryId,
        oneCategory,
        allCategories,
        showAddCategory,
        showEditCategory,

        setCategoryId,
        setOneCategory,
        setAllCategories,
        setShowAddCategory,
        setShowEditCategory,

        // Shelves
        shelfId,
        oneShelf,
        allShelves,
        showAddShelf,
        showEditShelf,

        setShelfId,
        setOneShelf,
        setAllShelves,
        setShowAddShelf,
        setShowEditShelf,

        // Notifications
        allNotifications,
        unreadNotifications,

        setAllNotifications,
        setUnreadNotifications,

        /* ***********
         *********
         ********
         */
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
