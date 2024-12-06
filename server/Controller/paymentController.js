const db = require('../DB/db');
exports.processPayment = async (req, res) => {
    const { order_id, payment_method, transaction_amount, payment_status, razorpay_payment_id, razorpay_order_id, payment_signature } = req.body;
    const transaction_id = 'TXN_' + new Date().getTime();  // Unique Transaction ID

    const query = `
        INSERT INTO tbl_payment (transaction_id, order_id, payment_method, transaction_amount, payment_status, razorpay_payment_id, razorpay_order_id, payment_signature)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [transaction_id, order_id, payment_method, transaction_amount, payment_status, razorpay_payment_id, razorpay_order_id, payment_signature], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Payment processed successfully',
            transaction_id: transaction_id,
        });
    });
};
