import React, { useContext, useState, useEffect } from "react";
import { db } from "../../../db/db_config";
import { doc, updateDoc, deleteDoc, collection, getDoc, getDocs } from "firebase/firestore";
import AppContext from "../../../context/AppContext";
import { success, error } from "../../../helpers/Alert";
import Spinner from "../../../components/widgets/spinner/Spinner";

const EditProduct = () => {
  const {
    loading,
    productId,
    setLoading,
    setShowEditProducts,
  } = useContext(AppContext);

  const [productDetails, setProductDetails] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [allShelves, setAllShelves] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDocRef = doc(db, "products", productId);
        const productSnapshot = await getDoc(productDocRef);
        if (productSnapshot.exists()) {
          setProductDetails(productSnapshot.data());
        } else {
          error("Product not found");
        }
      } catch (err) {
        error("Error fetching product data");
      }
    };

    const fetchCategoriesAndShelves = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const shelvesSnapshot = await getDocs(collection(db, "shelves"));
        setAllCategories(
          categoriesSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        setAllShelves(
          shelvesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      } catch (err) {
        error("Error fetching categories and shelves");
      }
    };

    fetchProduct();
    fetchCategoriesAndShelves();
  }, [productId]);

  const EditProductHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productDocRef = doc(db, "products", productId);
      await updateDoc(productDocRef, productDetails);
      success("Updated product successfully");
      setShowEditProducts(false);
    } catch (err) {
      error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    setLoading(true);
    try {
      const productDocRef = doc(db, "products", productId);
      await deleteDoc(productDocRef);
      success("Deleted product successfully");
      setShowEditProducts(false);
    } catch (err) {
      error("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const onchangeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="absolute bg-primary-color/40 top-0 left-0 z-10 min-h-screen min-w-full flex items-center justify-center">
      <form
        onSubmit={EditProductHandler}
        className="w-2/5 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2"
      >
        <div className="w-full flex items-center justify-between">
          <span className="font-bold text-black">Edit Product</span>
          <span
            className="font-bold text-red-500 text-2xl font-sans cursor-pointer hover:text-primary-color"
            onClick={() => setShowEditProducts(false)}
          >
            Close
          </span>
        </div>
        <div className="w-full h-[26rem] overflow-y-scroll bg-primary-color/5 rounded flex flex-col gap-3 p-2">
          {/* Product Details Inputs */}
          {["name", "expiry_date", "expiry_threshold", "price_per_unit", "unit"].map((key) => (
            <div key={key} className="flex flex-col items-start justify-center">
              <span className="font-semibold text-black/50">{key.replace('_', ' ')}</span>
              <input
                type="text"
                name={key}
                id={key}
                value={productDetails[key] || ''}
                onChange={onchangeHandler}
                className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black/20"
              />
            </div>
          ))}
          <div className="flex flex-col items-start justify-center">
            <span className="font-semibold text-black/50">Category</span>
            <select
              name="category"
              value={productDetails.category || ''}
              onChange={onchangeHandler}
              className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black/20"
            >
              <option value="" disabled>Select Category</option>
              {allCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-semibold text-black/50">Shelf</span>
            <select
              name="shelf"
              value={productDetails.shelf || ''}
              onChange={onchangeHandler}
              className="w-full p-2 rounded-md outline-1 outline-primary-color/60 border-2 border-black/20"
            >
              <option value="" disabled>Select Shelf</option>
              {allShelves.map((shelf) => (
                <option key={shelf.id} value={shelf.name}>
                  {shelf.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full flex items-center justify-center my-4">
          {loading ? (
            <Spinner />
          ) : (
            <div className="w-full flex justify-between items-center px-4">
              <span
                onClick={deleteHandler}
                className="p-2 bg-red-500 rounded-md text-white flex gap-1 items-center font-semibold cursor-pointer hover:animate-bounce"
              >
                Delete Product
              </span>
              <button
                type="submit"
                className="p-2 bg-primary-color rounded-md text-white flex gap-1 items-center font-semibold cursor-pointer hover:bg-primary-color/80"
              >
                Update Product
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
