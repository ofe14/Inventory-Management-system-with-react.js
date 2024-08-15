import React, { useState, useEffect } from "react";
import { db } from "../../db/db_config";
import { collection, getDocs ,where, query,Timestamp } from "firebase/firestore";
import Spinner from "../../components/widgets/spinner/Spinner";
import emailjs from "emailjs-com";

const SalesRecord = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
  
    useEffect(() => {
      const fetchSales = async () => {
        try {
          const salesCollection = collection(db, "sales");
          const endDate = Timestamp.now();
          const startDate = Timestamp.fromMillis(endDate.toMillis() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
          const q = query(salesCollection, where("saleDate", ">=", startDate), where("saleDate", "<=", endDate));
          const salesSnapshot = await getDocs(q);
          const salesList = salesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          const total = salesList.reduce((acc, sale) => acc + Number(sale.totalPrice), 0);
          setSales(salesList);
          setTotalAmount(total);
          setLoading(false);
  
          sendWeeklyReport(salesList); // Send weekly report
        } catch (err) {
          console.error("Error fetching sales: ", err);
          setLoading(false);
        }
      };
  
      fetchSales();
    }, []);
  
    const sendWeeklyReport = (salesList) => {
      // Prepare email content
      const emailContent = {
        sales: salesList.map((sale) => `${sale.productname} - ${sale.quantitySold}`).join("\n"),
        totalAmount,
      };
  
      // Send email using EmailJS
      emailjs.send("service_s36kp5w", "template_bdlpyur", emailContent, "AV9RvaDHgEsBXuwp1")
        .then((response) => {
          console.log("Email sent successfully!", response);
        })
        .catch((error) => {
          console.error("Email sending failed:", error);
        });
    };

  return (
    <div className="flex flex-col items-center bg-off-teal" style={{ color: "black", height: 600 }}>
      <div className="w-[90%] my-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Sales Records</h2>
        {loading ? (
          <Spinner />
        ) : (
          <table className="min-w-full bg-white border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Product Name</th>
                <th className="px-4 py-2 border border-gray-300">Batch Number</th>
                <th className="px-4 py-2 border border-gray-300">Quantity Sold</th>
                <th className="px-4 py-2 border border-gray-300">Sale Date</th>
                <th className="px-4 py-2 border border-gray-300">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-4 py-2 border border-gray-300">{sale.productname}</td>
                  <td className="px-4 py-2 border border-gray-300">{sale.batch_no}</td>
                  <td className="px-4 py-2 border border-gray-300">{sale.quantitySold}</td>
                  <td className="px-4 py-2 border border-gray-300">{new Date(sale.saleDate.seconds * 1000).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border border-gray-300">{sale.totalPrice}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="px-4 py-2 border border-gray-300 font-bold">Total Amount</td>
                <td className="px-4 py-2 border border-gray-300 font-bold">{totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesRecord;






