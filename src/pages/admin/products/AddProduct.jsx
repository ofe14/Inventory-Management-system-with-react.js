import React, { useEffect, useContext, useState } from "react";
import { getDocs, collection,addDoc } from "firebase/firestore";
import { db } from '../../../db/db_config';
import AppContext from "../../../context/AppContext";
import { success, error } from "../../../helpers/Alert";
import Spinner from "../../../components/widgets/spinner/Spinner";

const AddProduct = () => {
  const {
    loading,
    setLoading,
    setShowAddProducts,
  } = useContext(AppContext);

  const [categories, setCategories] = useState([]);
  const [shelves, setShelves] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndShelves = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const shelvesSnapshot = await getDocs(collection(db, "shelves"));

        const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().name);
        const shelvesList = shelvesSnapshot.docs.map(doc => doc.data().name);

        setCategories(categoriesList);
        setShelves(shelvesList);
      } catch (error) {
        console.error("Error fetching categories and shelves:", error);
      }
    };

    fetchCategoriesAndShelves();
  }, []);

  const generateBatchNumber = () => {
    return `BATCH-${Math.floor(Math.random() * 1000000)}`;
  };

  const [productDetails, setProductDetails] = useState({
    name: "",
    batch_no: generateBatchNumber(),
    expiry_date: "",
    expiry_threshold: 30,
    price_per_unit: "",
    Pquantity: 0,
    quantity_per_package: 0,
    Tquantity: 0,
    Rquantity: 0,
    unit: "",
    category: "",
    shelf: "",
    email_sent: false
  });

  useEffect(() => {
    const newTquantity = productDetails.Pquantity * productDetails.quantity_per_package;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      Tquantity: newTquantity,
      Rquantity: newTquantity
    }));
  }, [productDetails.Pquantity, productDetails.quantity_per_package]);

  const addProductHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // Add product document to Firestore collection
      await addDoc(collection(db, "products"), productDetails);
      setLoading(false);
      success("Product added successfully");
      setShowAddProducts(false);
    } catch (err) {
      console.error("Error adding product:", err);
      error("Error adding product");
      setLoading(false);
    }
  };

  const onchangeHandler = (e) => {
    e.persist();
    setProductDetails((productDetails) => ({
      ...productDetails,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <div className="absolute bg-primary-color/40 top-0 left-0 z-10 min-h-screen min-w-full flex items-center justify-center">
        <form
          onSubmit={addProductHandler}
          className="w-2/5 bg-white-ish rounded-lg shadow-lg p-4 flex flex-col gap-2"
        >
          {/* Form elements */}
          <div className="w-full flex items-center justify-between">
            <span className="font-bold text-black-ish">Add Product</span>
            <span
              className="font-bold text-error-color text-2xl font-sans cursor-pointer hover:text-primary-color"
              onClick={() => setShowAddProducts(false)}
            >
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.843 13.7827L13.7937 8.99951L18.8414 4.21687C18.8911 4.16977 18.9306 4.11384 18.9575 4.05229C18.9844 3.99074 18.9982 3.92477 18.9982 3.85815C18.9982 3.79153 18.9844 3.72556 18.9575 3.66401C18.9306 3.60246 18.8911 3.54653 18.8414 3.49943L15.3053 0.14862C15.2049 0.0534591 15.0686 0 14.9266 0C14.7845 0 14.6483 0.0534591 14.5478 0.14862L9.49936 4.93126L4.45173 0.14862C4.2509 -0.0419004 3.89528 -0.0419004 3.69418 0.14862L0.157345 3.49892C0.0570327 3.59416 0.000696524 3.72322 0.000696524 3.85777C0.000696524 3.99232 0.0570327 4.12137 0.157345 4.21662L5.20578 8.99951L0.156537 13.7829C0.0562907 13.8782 0 14.0072 0 14.1418C0 14.2763 0.0562907 14.4053 0.156537 14.5006L3.69284 17.8512C3.74255 17.8983 3.80159 17.9358 3.86658 17.9613C3.93158 17.9869 4.00125 18 4.07161 18C4.14198 18 4.21165 17.9869 4.27664 17.9613C4.34164 17.9358 4.40068 17.8983 4.45039 17.8512L9.49936 13.0678L14.5486 17.8509C14.6533 17.9499 14.7898 17.9996 14.9274 17.9996C15.0649 17.9996 15.2017 17.9499 15.3064 17.8509L18.8433 14.5004C18.9437 14.4052 19.0001 14.2761 19 14.1415C18.9999 14.0069 18.9435 13.8778 18.843 13.7827Z"
                  fill="#FF006E"
                />
              </svg>
            </span>
          </div>
          {/* Other form elements */}
          <div className="w-full h-[26rem] overflow-y-scroll bg-primary-color/5 rounded flex flex-col gap-3 p-2">
            {/* Pair */}
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Name</span>
              <input
                type="text"
                name="name"
                id="name"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black-ish/20"
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Expiry Date</span>
              <input
                type="date"
                name="expiry_date"
                id="expiry_date"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black-ish/20"
              />
            </div>
            {/* Pair */}
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Price per unit</span>
              <input
                type="number"
                name="price_per_unit"
                id="price_per_unit"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black-ish/20"
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Quantity per package</span>
              <input
                type="number"
                name="quantity_per_package"
                id="quantity_per_package"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black-ish/20"
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Package_Quantity</span>
              <input
                type="number"
                name="Pquantity"
                id="Pquantity"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black-ish/20"
              />
            </div>
            {/* Pair */}
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Packaging Type</span>
              <select
                name="unit"
                id="unit"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 bg-white-ish outline-primary-color/60 border-2 border-black-ish/20"
              >
                <option style={{ color: "black" }}>Crates</option>
                <option style={{ color: "black" }}>Cartons</option>
              </select>
            </div>
            {/* Pair */}
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Category</span>
              <select
                name="category"
                id="category"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 bg-white-ish outline-primary-color/60 border-2 border-black-ish/20"
              >
                {categories.map((category, index) => (
                  <option key={index} value={index}>{category}</option>
                ))}
              </select>
            </div>
            {/* Pair */}
            <div className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black-ish/50">Shelf</span>
              <select
                name="shelf"
                id="shelf"
                required
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 bg-white-ish outline-primary-color/60 border-2 border-black-ish/20"
              >
                {shelves.map((shelf, index) => (
                  <option key={index} value={index}>{shelf}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full flex items-center justify-center my-4">
            {loading ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="p-2 bg-primary-color rounded-md text-white-ish flex gap-1 items-center font-semibold cursor-pointer hover:bg-primary-color/80"
              >
                Add New Product
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
