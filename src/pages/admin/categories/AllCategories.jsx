import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { collection, onSnapshot, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../db/db_config";
import { error, success } from "../../../helpers/Alert";

const AllCategories = () => {
  const {
    showAddCategory,
    setShowAddCategory,
    setCategoryId,
    showEditCategory,
    getProductsByCategory,
  } = useContext(AppContext);

  const [allCategories, setAllCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      setAllCategories(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setFiltered(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);


  const gotoCategory = async (name) => {
    navigate(`/admin/categories/one/${encodeURIComponent(name)}`);
  };

  const editHandler = (e, id) => {
    e.stopPropagation();
    setCategoryId(id);
  };

  const deleteHandler = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "categories", id));
      success("Deleted category successfully");
    } catch (err) {
      console.log(err);
      error("Failed to delete category");
    }
  };

  const onSearchChangeHandler = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCategories = allCategories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm)
    );
    setFiltered(filteredCategories);
  };

  return (
    <>
      {showAddCategory && <AddCategory />}
      {showEditCategory && <EditCategory />}
      <div className="w-full flex justify-between items-center font-sans pb-2 border-b border-black-ish/20">
        <div className="flex flex-col items-start p-2 gap-2 justify-between">
          <div className="flex gap-4 items-center">
            <span className="font-semibold text-black-ish/70">All Categories</span>
            <span className="text-xs p-1 rounded-md bg-primary-color/10 text-primary-color/70">
              {allCategories.length} {allCategories.length === 1 ? "Category" : "Categories"} Registered
            </span>
          </div>
          <span className="text-xs text-black-ish/50">
            This shows a list of all categories available in the system
          </span>
        </div>
        <div className="flex item-center">
          <span className="border-l-2 border-t-2 border-b-2 border-gray-300/50 rounded-l-lg p-2 flex justify-center item-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5C10.2044 5 9.44129 5.31607 8.87868 5.87868C8.31607 6.44129 8 7.20435 8 8C8 8.79565 8.31607 9.55871 8.87868 10.1213C9.44129 10.6839 10.2044 11 11 11C11.7956 11 12.5587 10.6839 13.1213 10.1213C13.6839 9.55871 14 8.79565 14 8C14 7.20435 13.6839 6.44129 13.1213 5.87868C12.5587 5.31607 11.7956 5 11 5ZM11 13C9.67392 13 8.40215 12.4732 7.46447 11.5355C6.52678 10.5979 6 9.32608 6 8C6 6.67392 6.52678 5.40215 7.46447 4.46447C8.40215 3.52678 9.67392 3 11 3C12.3261 3 13.5979 3.52678 14.5355 4.46447C15.4732 5.40215 16 6.67392 16 8C16 9.32608 15.4732 10.5979 14.5355 11.5355C13.5979 12.4732 12.3261 13 11 13ZM11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5Z"
                fill="#4F46E5"
              />
            </svg>
          </span>
          <input
            type="search"
            name="search"
            id="search"
            placeholder="search category name..."
            className="border-r-2 border-t-2 border-b-2 border-gray-300/50 rounded-r-lg p-2 pl-4 font-light text-sm w-[450px] outline-primary-color/50"
            onChange={onSearchChangeHandler}
          />
        </div>
        <div
          className="p-2 bg-primary-color rounded-md text-white-ish flex gap-1 items-center font-semibold cursor-pointer hover:bg-primary-color/80"
          onClick={() => setShowAddCategory(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99996 4.16663V15.8333M4.16663 9.99996H15.8333"
              stroke="white"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add New Category
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
        {filtered.length ? (
          filtered.map((category) => (
            <div
              key={category.id}
              onClick={() => gotoCategory(category.name)}
              className="p-4 rounded-md shadow-md border border-gray-500/20 h-32 flex flex-col justify-between hover:shadow-lg hover:shadow-primary-color/40 cursor-pointer"
            >
              <div className="flex w-full items-center justify-between font-semibold text-black-ish/70">
                {category.name}
                <div className="flex items-center gap-2">
                  {/* view */}
                  <span
                    className="cursor-pointer text-green-500 hover:animate-bounce"
                    onClick={(e) => {
                      e.stopPropagation();
                      gotoCategory(category.name);
                    }}
                  >
                    <svg
                      width="22"
                      height="16"
                      viewBox="0 0 22 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 5C10.2044 5 9.44129 5.31607 8.87868 5.87868C8.31607 6.44129 8 7.20435 8 8C8 8.79565 8.31607 9.55871 8.87868 10.1213C9.44129 10.6839 10.2044 11 11 11C11.7956 11 12.5587 10.6839 13.1213 10.1213C13.6839 9.55871 14 8.79565 14 8C14 7.20435 13.6839 6.44129 13.1213 5.87868C12.5587 5.31607 11.7956 5 11 5ZM11 13C9.67392 13 8.40215 12.4732 7.46447 11.5355C6.52678 10.5979 6 9.32608 6 8C6 6.67392 6.52678 5.40215 7.46447 4.46447C8.40215 3.52678 9.67392 3 11 3C12.3261 3 13.5979 3.52678 14.5355 4.46447C15.4732 5.40215 16 6.67392 16 8C16 9.32608 15.4732 10.5979 14.5355 11.5355C13.5979 12.4732 12.3261 13 11 13ZM11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5Z"
                        fill="#4F46E5"
                      />
                    </svg>
                  </span>
                  {/* edit */}
                  <span
                    className="cursor-pointer text-yellow-500 hover:animate-bounce"
                    onClick={(e) => editHandler(e, category.id)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 9.99994C18.7348 9.99994 18.4804 10.1053 18.2929 10.2928C18.1054 10.4804 18 10.7347 18 10.9999V16.9999C18 17.2652 17.8946 17.5195 17.7071 17.707C17.5196 17.8946 17.2652 17.9999 17 17.9999H3C2.73478 17.9999 2.48043 17.8946 2.29289 17.707C2.10536 17.5195 2 17.2652 2 16.9999V2.99994C2 2.73472 2.10536 2.48037 2.29289 2.29283C2.48043 2.1053 2.73478 1.99994 3 1.99994H9C9.26522 1.99994 9.51957 1.89458 9.70711 1.70705C9.89464 1.51951 10 1.26516 10 0.999939C10 0.734722 9.89464 0.480377 9.70711 0.29283C9.51957 0.1053 9.26522 0 9 0.5H0.29L11.23 3.11994L4.29 10.0499C4.19732 10.1434 4.12399 10.2542 4.07423 10.376C4.02446 10.4979 3.99924 10.6283 4 10.7599ZM14.76 2.40994L17.59 5.23994L16.17 6.65994L13.34 3.82994L14.76 2.40994ZM6 11.1699L11.93 5.23994L14.76 8.06994L8.83 13.9999H6V11.1699Z"
                        fill="#F59E0B"
                      />
                    </svg>
                  </span>
                  {/* delete */}
                  <span
                    className="cursor-pointer text-red-500 hover:animate-bounce"
                    onClick={(e) => deleteHandler(e, category.id)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 5V15C4 16.1046 4.89543 17 6 17H14C15.1046 17 16 16.1046 16 15V5H4ZM2 4H18V5H2V4ZM7 7H9V13H7V7ZM11 7H13V13H11V7ZM14 2H6V1H14V2Z"
                        fill="#EF4444"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {category.description}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No categories found
          </div>
        )}
      </div>
    </>
  );
};

export default AllCategories;
