import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const SendEmail = () => {
  const [emailDetails, setEmailDetails] = useState({
    name: '',
    email: '',
    message: ''
  });

  const calculateDaysUntilExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const timeDiff = expiry - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const sendE = (subject, message) => {
    emailjs.send(
      'service_s36kp5w', // Replace with your EmailJS service ID
      'template_bdlpyur', // Replace with your EmailJS template ID
      {
        subject: subject,
        message: message,
        to_email: adminEmail
      },
      'AV9RvaDHgEsBXuwp1' // Replace with your EmailJS user ID
    ).then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
    }).catch((err) => {
      console.error('Failed to send email', err);
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            days_until_expiry: calculateDaysUntilExpiry(data.expiry_date),
          };
        });

        // Filter products to include only expired and nearly expired products
        const filteredProducts = productsData.filter(
          (product) => product.days_until_expiry <= product.expiry_threshhold || product.days_until_expiry < 0
        );

        // Send email notifications
        filteredProducts.forEach(product => {
          if (product.days_until_expiry <= product.expiry_threshhold && product.days_until_expiry > 0) {
            sendEmail(
              "Product About to Expire",
              `The product ${product.name} (Batch No: ${product.batch_no}) is about to expire in ${product.days_until_expiry} days.`
            );
          } else if (product.days_until_expiry < 0) {
            sendEmail(
              "Product Expired",
              `The product ${product.name} (Batch No: ${product.batch_no}) has expired. Total loss from expired product =$${calculateLoss()}`
            );
          }
        });

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
  return (
    <form onSubmit={sendEmail}>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={emailDetails.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={emailDetails.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Message</label>
        <textarea
          name="message"
          value={emailDetails.message}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Send Email</button>
    </form>
  );
};

export default SendEmail;
