const db = require('../DB/db');
exports.createOrder = async (req, res) => {
    const { cid, total_amount } = req.body;
    const order_id = 'ORD_' + new Date().getTime();  // Unique Order ID

    const query = 'INSERT INTO tbl_order (order_id, cid, total_amount) VALUES (?, ?, ?)';
    db.query(query, [order_id, cid, total_amount], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Order created successfully',
            order_id: order_id,
        });
    });
};