import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../db/db_config";
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { success, error } from "../../helpers/Alert";
import Spinner from "../../components/widgets/spinner/Spinner";
import _ from "lodash";

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      fetchProductSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const fetchProductSuggestions = useCallback(
    _.debounce(async (term) => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          where("name", ">=", term),
          where("name", "<=", term + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuggestions(productsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product suggestions: ", err);
        error("Error fetching product suggestions");
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleProductSelection = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      const existingProduct = prevSelectedProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevSelectedProducts;
      } else {
        return [...prevSelectedProducts, { ...product, quantity: 1, totalPrice: product.price_per_unit }];
      }
    });
  };

  const handleQuantityChange = (id, quantityValue) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: quantityValue, totalPrice: quantityValue * product.price_per_unit }
          : product
      )
    );
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.filter((product) => product.id !== id)
    );
  };

  const handleSale = async () => {
    if (selectedProducts.length === 0) {
      error("Please select at least one product and enter a valid quantity.");
      return;
    }

    setLoading(true);
    try {
      for (const product of selectedProducts) {
        if (product.quantity > product.Rquantity) {
          error(`Insufficient quantity available for ${product.name}.`);
          setLoading(false);
          return;
        }

        const productRef = doc(db, "products", product.id);
        const newRquantity = product.Rquantity - product.quantity;

        // Update the remaining quantity in the product document
        await updateDoc(productRef, {
          Rquantity: newRquantity,
        });

        // Add a sale record
        await addDoc(collection(db, "sales"), {
          productId: product.id,
          productname: product.name,
          batch_no: product.batch_no,
          quantitySold: product.quantity,
          saleDate: new Date(),
          totalPrice: product.totalPrice, // Record the total price for each product
        });
      }

      success("Sale recorded successfully");
      setSuggestions([]);
      setSelectedProducts([]);
      setLoading(false);
    } catch (err) {
      console.error("Error recording sale: ", err);
      error("Error recording sale");
      setLoading(false);
    }
  };

  const totalCombinedPrice = selectedProducts.reduce((acc, product) => acc + Number(product.totalPrice), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-off-teal text-black" style={{ height: 600 }}>
      <div className="bg-white m-auto w-[50%] min-h-[60%] rounded-[8px] bg-cover bg-center shadow-xl p-4 flex flex-col items-center justify-start z-[1]">
        <h4 className="text-primary-color font-poppins text-xl font-semibold leading-36 tracking-normal mb-2">
          Sales Check Point
        </h4>

        <div className="w-[80%] my-3 flex flex-col gap-[20px]">
          <div className="flex flex-col items-center w-full">
            <input
              className="w-full h-[40px] text-sm px-2 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-teal-100 bg-gray-200/40"
              type="text"
              placeholder="Search product by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <Spinner />}

          <div className="w-full mt-4">
            <h5 className="text-lg font-semibold text-gray-700 mb-2">Search Results</h5>
            {suggestions.map((product) => (
              <div
                key={product.id}
                className="p-2 border border-gray-300 rounded-sm cursor-pointer flex justify-between items-center text-black"
                onClick={() => handleProductSelection(product)}
              >
                <span>{product.name} - {product.batch_no} - {product.Rquantity} units remaining</span>
                <button className="text-sm text-blue-500 hover:text-blue-700">Select</button>
              </div>
            ))}
          </div>

          {selectedProducts.length > 0 && (
            <div className="w-full mt-4">
              <h5 className="text-lg font-semibold text-gray-700 mb-2">Selected Products</h5>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Product</th>
                    <th className="py-2 px-4 border-b border-gray-200">Batch No</th>
                    <th className="py-2 px-4 border-b border-gray-200">Quantity</th>
                    <th className="py-2 px-4 border-b border-gray-200">Total Price</th>
                    <th className="py-2 px-4 border-b border-gray-200">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="py-2 px-4 border-b border-gray-200">{product.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{product.batch_no}</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                          min="1"
                          max={product.Rquantity}
                          className="w-full text-center text-black"
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">${product.totalPrice}</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total Combined Price: ${totalCombinedPrice}</span>
                <button
                  className="w-[300px] h-[45px] text-white px-21 py-19 rounded-md flex items-center justify-center gap-10 bg-gradient-to-r from-primary-color to-primary-color/90 hover:bg-primary-color/60 hover:border-primary-color hover:border-2 shadow-lg"
                  onClick={handleSale}
                >
                  Record Sale
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
