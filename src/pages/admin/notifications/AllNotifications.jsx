import React, { useEffect, useContext, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import AppContext from "../../../context/AppContext";
import { success, error } from "../../../helpers/Alert";
import Spinner from "../../../components/widgets/spinner/Spinner";
import { db } from '../../../db/db_config';
import emailjs from 'emailjs-com';

const AllProducts = () => {
  const { getAllNotifications } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminEmail = "favour.amiteye@sttu.cu.edu.ng"; // Default admin email

  const calculateDaysUntilExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const timeDiff = expiry - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const sendEmail = async (to_email, subject, message, productId) => {
    try {
      await emailjs.send(
        'service_s36kp5w', 
        'template_bdlpyur',
        {
          subject: subject,
          message: message,
          to_email: to_email
        },
        'AV9RvaDHgEsBXuwp1' // Replace with your EmailJS user ID
      );
      console.log('Email sent successfully!');
      await updateDoc(doc(db, "products", productId), { email_sent: true });
    } catch (err) {
      console.error('Failed to send email', err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Ensure the email_sent field exists
          if (!("email_sent" in data)) {
            updateDoc(doc.ref, { email_sent: false });
          }

          return {
            id: doc.id,
            ...data,
            days_until_expiry: calculateDaysUntilExpiry(data.expiry_date),
          };
        });

        // Filter products to include only expired and nearly expired products
        const filteredProducts = productsData.filter(
          (product) => product.days_until_expiry <= product.expiry_threshold || product.days_until_expiry < 0
        );

        // Send email notifications
        for (const product of filteredProducts) {
          if (!product.email_sent) {
            if (product.days_until_expiry <= product.expiry_threshold && product.days_until_expiry > 0) {
              await sendEmail(
                adminEmail,
                "Product About to Expire",
                `The product ${product.name} (Batch No: ${product.batch_no}) is about to expire in ${product.days_until_expiry} days.`,
                product.id
              );
            } else if (product.days_until_expiry < 0) {
              await sendEmail(
                adminEmail,
              "Product Expired",
              `The product ${product.name} (Batch No: ${product.batch_no}) has expired. Total loss from expired product =$${calculateLoss()}`,
                product.id
              );
            }
          }
        }

        success("Successfully fetched");
        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateLoss = () => {
    let totalLoss = 0;
    products.forEach((product) => {
      if (product.days_until_expiry < 0) {
        totalLoss += product.Rquantity * product.price_per_unit;
      }
    });
    return totalLoss;
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {/* TOP */}
      <div className="w-full px-2 flex justify-between items-center font-sans pb-2 border-b border-black-ish/20">

        {/* left */}
        <div className="flex flex-col items-start p-2 gap-2 justify-between">
          {/* left top */}
          <div className="flex gap-4 items-center">
            <span className="font-semibold text-black-ish/70">
              Notifications
            </span>
          </div>
        </div>
        <div className="text-red-500 mt-4" style={{fontWeight
          :"bold"
        }}>
        Total loss from expired products: ${calculateLoss()}
      </div>
      </div>
      <div className="min-w-full flex flex-col items-start">
        <div className="h-[26rem] overflow-y-scroll">
          <table className="w-full text-center table-fixed">
            <thead className="text-gray-700/60 font-light h-12 bg-off-teal/20">
              <tr className="h-10 cursor-pointer text-gray-500 hover:bg-off-teal py-2 border-b-2 border-gray-300/40" >
                <th className="w-[4rem]">S/N</th>
                <th>Name</th>
                <th>Batch No.</th>
                <th>Expiry Date</th>
                <th>Expiry Threshold</th>
                <th>Quantity</th>
                <th>Days Until Expiry</th> {/* Added Days Until Expiry */}
                <th className="w-[4rem]">Shelf</th>
                <th>Category</th>
                <th className="w-[8rem]">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                <>
                  {products.map((product, index) => (
                    <tr key={product.id} style={{borderBottomColor:"black"}}>
                      <td style={{color:"black",marginBottom:20}}>{index + 1}</td>
                      <td style={{color:"black",marginBottom:20}}>{product.name}</td>
                      <td style={{color:"black",marginBottom:20}}>{product.batch_no}</td>
                      <td style={{color:"black",marginBottom:20}}>{product.expiry_date}</td>
                      <td style={{color:"black",marginBottom:20}}>{product.expiry_threshold}</td>
                      <td style={{color:"black",marginBottom:20}}>{product.Rquantity}</td>
                      <td style={{color:"black",marginBottom:20}}>{product.days_until_expiry}</td> {/* Display Days Until Expiry */}
                      <td style={{color:"black",marginBottom:20}}>{product.shelf}</td>
                      <td style={{color:"black",marginBottom:20}}>{product.category}</td>
                      {product.days_until_expiry <= product.expiry_threshold &&
                      product.days_until_expiry >= 0 && (
                        <td className="">
                          <span className="text-yellow-500 p-1 bg-yellow-300/40 rounded-md text-sm">
                            Near Expiry
                          </span>
                        </td>
                      )}
                    {product.days_until_expiry < 0 && (
                      <td className="">
                        <span className="text-red-500 p-1 bg-red-300/40 rounded-md text-sm">
                          Expired
                        </span>
                      </td>
                    )}
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="11">No products found</td> {/* Adjusted colspan */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
};

export default AllProducts;



