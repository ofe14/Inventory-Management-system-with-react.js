/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const db = admin.firestore();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:functions.config().email.user,
    pass:functions.config().email.pass
  }
});

const sendEmail = (subject, text) => {
  const mailOptions = {
    from:functions.config().email.user,
    to: 'favour.amiteye@stu.cu.edu.ng',
    subject: subject,
    text: text,
  };

  return transporter.sendMail(mailOptions);
};

exports.checkProductExpiry = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const productsSnapshot = await db.collection('products').get();
  const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const today = new Date();

  products.forEach(async (product) => {
    const expiryDate = new Date(product.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 3600 * 24));
    console.log("it got here")
    
    if (daysUntilExpiry <= product.expiry_threshhold && daysUntilExpiry > 0) {
      await sendEmail(
        'Product Near Expiry',
        `The product ${product.name} with batch number ${product.batch_no} is near its expiry date.`
      );
    } else if (daysUntilExpiry <= 0) {
      await sendEmail(
        'Product Expired',
        `The product ${product.name} with batch number ${product.batch_no} has expired. Please remove it from the shelves.`
      );
    }
  });
});
