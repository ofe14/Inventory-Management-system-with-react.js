import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../db/db_config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AppContext from "../../../context/AppContext";
import { success, error } from "../../../helpers/Alert";
import Spinner from "../../../components/widgets/spinner/Spinner";

const Register = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(AppContext);

  const [registerDetails, setRegisterDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    role: "system_user", // default role
  });

  const Registerhandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email, password, firstname, lastname, username, role } = registerDetails;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      await setDoc(doc(db, "Users", user.uid), {
        firstname,
        lastname,
        email,
        username,
        role,
      });

      setLoading(false);
      success("Registration Successful");
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      error("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const onchangeHandler = (e) => {
    setRegisterDetails({
      ...registerDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-teal-100">
      <div
        className="absolute top-1/4 left-[28%] w-[40%] h-[60%] rounded-[8px] bg-gradient-to-r from-green-600 to-green-800 shadow-xl"
        style={{
          transform: "rotate(-8deg)",
          transformOrigin: "top left",
        }}
      ></div>
      <div className="bg-white m-auto w-[40%] min-h-[50%] rounded-[8px] bg-cover bg-center shadow-xl p-4 flex flex-col items-center justify-start z-[1]">
        <div className="flex flex-col items-center justify-center text-teal-800 w-[50%] border-b-[2.5px] p-2 border-teal-600">
          <h4 className="text-teal-800 font-poppins text-xl font-semibold leading-36 tracking-normal">
            Register
          </h4>
          <span className="font-poppins text-sm font-normal leading-5 tracking-normal text-center">
            Input your details to get started
          </span>
        </div>
        <form
          onSubmit={Registerhandler}
          className="w-[80%] my-6 flex flex-col gap-[20px]"
        >
          <div className="flex flex-col items-start justify-center">
            <span className="font-inter text-sm leading-6 tracking-normal text-left text-gray-700">
              First Name
            </span>
            <input
              className="w-full h-[40px] text-sm px-2 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-teal-100 bg-gray-200/40"
              type="text"
              placeholder="John"
              name="firstname"
              onChange={onchangeHandler}
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-inter text-sm leading-6 tracking-normal text-left text-gray-700">
              Last Name
            </span>
            <input
              className="w-full h-[40px] text-sm px-2 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-teal-100 bg-gray-200/40"
              type="text"
              placeholder="Doe"
              name="lastname"
              onChange={onchangeHandler}
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-inter text-sm leading-6 tracking-normal text-left text-gray-700">
              Email
            </span>
            <input
              className="w-full h-[40px] text-sm px-2 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-teal-100 bg-gray-200/40"
              type="email"
              placeholder="johndoe@example.com"
              name="email"
              onChange={onchangeHandler}
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-inter text-sm leading-6 tracking-normal text-left text-gray-700">
              Username
            </span>
            <input
              className="w-full h-[40px] text-sm px-2 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-teal-100 bg-gray-200/40"
              type="text"
              placeholder="john_doe"
              name="username"
              onChange={onchangeHandler}
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-inter text-sm leading-6 tracking-normal text-left text-gray-700">
              Password
            </span>
            <input
              className="w-full h-[40px] text-sm px-2 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-teal-100 bg-gray-200/40"
              type="password"
              placeholder="********"
              name="password"
              onChange={onchangeHandler}
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-inter text-sm leading-6 tracking-normal text-left text-gray-700">
              Role
            </span>
            <select
              className="w-full h-[40px] text-sm px-2 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-teal-100 bg-gray-200/40"
              name="role"
              onChange={onchangeHandler}
              value={registerDetails.role}
            >
              <option value="system_user">System User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="w-full flex items-center justify-center my-4">
            {loading ? (
              <Spinner />
            ) : (
              <div className="w-full flex flex-col gap-3 items-center justify-center">
                <button
                  className="w-[70%] h-[45px] text-white px-21 py-19 rounded-md flex items-center justify-center gap-10 bg-gradient-to-r from-green-600 to-green-800 hover:bg-teal-700 hover:border-green-300 hover:border-2 shadow-lg"
                  type="submit"
                >
                  Register
                </button>
                <span
                  onClick={() => navigate("/login")}
                  className="mx-auto text-teal-700 text-sm cursor-pointer hover:text-teal-400"
                >
                  Login
                </span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
