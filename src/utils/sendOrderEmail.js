const transporter = require("../config/nodemailer");

const sendOrderEmail = async (email, order) => {

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: email,

        subject: "SmartMall Order Confirmation",

        html: `
            <h2>Thank You For Shopping</h2>

            <p>Your Order has been placed successfully.</p>

            <h3>Order Number : ${order.orderNumber}</h3>

            <h3>Invoice : ${order.invoiceNumber}</h3>

            <h3>Total : ₹${order.totalAmount}</h3>

            <h3>Status : ${order.paymentStatus}</h3>
        `

    });

};

module.exports = sendOrderEmail;