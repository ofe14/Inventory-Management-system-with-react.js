import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppContext";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../db/db_config";

const AllUsers = () => {
  const {
    setUserId,
    showAddUsers,
    showEditUsers,
    setShowAddUsers,
    setShowEditUsers,
  } = useContext(AppContext);
  const [allUsers, setAllUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  let sn = 1;

  const editHandler = (id) => {
    setUserId(id);
    setShowEditUsers(true);
  };

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), _id: doc.id });
      });
      setAllUsers(users);
      setFiltered(users);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // SearchBar Handler
  const onSearchChangeHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredUser = allUsers.filter((item) =>
      item.firstname.toLowerCase().includes(searchValue)
    );
    setFiltered(filteredUser);
  };

  return (
    <>
      {showAddUsers && <AddUser />}
      {showEditUsers && <EditUser />}
      {/* TOP */}
      <div className="w-full flex justify-between items-center font-sans pb-2 border-b border-black-ish/20">
        {/* left */}
        <div className="flex flex-col items-start p-2 gap-2 justify-between">
          {/* left top */}
          <div className="flex gap-4 items-center">
            <span className="font-semibold text-black-ish/70">All Users</span>
            <span className="text-xs p-1 rounded-md bg-primary-color/10 text-primary-color/70">
              {allUsers.length} Users Registered
            </span>
          </div>
          {/* left bottom */}
          <span className="text-xs text-black-ish/50">
            This shows a list of all users available in the system
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
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="#ABB1BB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="search"
            name="search"
            id="search"
            placeholder="search user first name..."
            className="border-r-2 border-t-2 border-b-2 border-gray-300/50 rounded-r-lg p-2 pl-4 font-light text-sm w-[450px] outline-primary-color/50"
            onChange={onSearchChangeHandler}
          />
        </div>
        <div
          onClick={() => setShowAddUsers(true)}
          className="p-2 bg-primary-color rounded-md text-white-ish flex gap-1 items-center font-semibold cursor-pointer hover:bg-primary-color/80"
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
          Add New User
        </div>
      </div>
      <div className="min -w-full flex flex-col items-start">
        {/* <div className="bg-green-400 p-4 h-12 w-full">Top</div> */}
        <div className="h-[26rem] overflow-y-scroll">
          <table className="w-full text-center table-fixed">
            <thead className="text-gray-700/60 font-light h-12 bg-off-teal/40">
              <tr>
                <th className="w-[4rem]">S/N</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered ? (
                <>
                  {filtered.map((item, i) => (
                    <tr
                      key={item._id}
                      className="h-10 cursor-pointer text-gray-500 hover:bg-off-teal py-2 border-b-2 border-gray-300/40"
                      onClick={() => editHandler(item._id)}
                    >
                      <td>{sn++}</td>
                      <td>{item.firstname}</td>
                      <td>{item.lastname}</td>
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr className="h-12 bg-teal-400/20">
                  <td></td>
                  <td colSpan={5} className="font-semibold">
                    No Users yet, add some.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllUsers;

