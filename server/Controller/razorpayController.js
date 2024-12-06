const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../DB/db');   

 const razorpay = new Razorpay({
    key_id: 'rzp_test_qN2ZW9ayQgETQV',   
    key_secret: 'nhQio9PLfZfm0Ulfp7sTujcx'  
});

 exports.createOrder = async (req, res) => {
    const { cid, total_amount } = req.body;

     if (typeof total_amount !== 'number' || total_amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

     const options = {
        amount: total_amount * 100,  
        currency: 'INR',
        receipt: 'receipt_' + new Date().getTime(),
        notes: {
            customer_id: cid
        }
    };

    razorpay.orders.create(options, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const order_id = order.id;
        const query = 'INSERT INTO tbl_order (order_id, cid, total_amount) VALUES (?, ?, ?)';
        db.query(query, [order_id, cid, total_amount], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Order created successfully',
                order_id: order_id,
                order_data: order
            });
        });
    });
};

exports.verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;

     console.log('Payment Verification Request:', req.body);

    if (!order_id || !payment_id || !signature) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

     const razorpaySecret = 'nhQio9PLfZfm0Ulfp7sTujcx';  
    console.log('Razorpay Secret:', razorpaySecret);  

     const body = order_id + "|" + payment_id;
    const generated_signature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(body.toString())
        .digest('hex');

    console.log('Generated Signature:', generated_signature);
    console.log('Received Signature:', signature);

    if (generated_signature === signature) {
         const query = 'UPDATE tbl_order SET payment_status = "SUCCESS" WHERE order_id = ?';
        db.query(query, [order_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const amountQuery = 'SELECT total_amount FROM tbl_order WHERE order_id = ?';
            db.query(amountQuery, [order_id], (err, result) => {
                if (err || result.length === 0) {
                    return res.status(500).json({ error: 'Failed to fetch order amount' });
                }
                const total_amount = result[0].total_amount;

                const paymentQuery = `
                    INSERT INTO tbl_payment (
                        transaction_id, order_id, payment_method, transaction_date, transaction_amount,
                        payment_status, razorpay_payment_id, razorpay_order_id, payment_signature
                    ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)
                `;
                db.query(paymentQuery, [
                    payment_id, order_id, 'Razorpay', total_amount, 'SUCCESS', payment_id, order_id, signature
                ], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(200).json({ message: 'Payment verified and saved successfully' });
                });
            });
        });
    } else {
        return res.status(400).json({ message: 'Payment verification failed', error: 'Invalid signature' });
    }
};
