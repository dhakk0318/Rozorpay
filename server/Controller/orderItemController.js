const db = require('../DB/db');
exports.addOrderItem = async (req, res) => {
    const { order_id, pid, quantity, price } = req.body;
    const order_item_id = 'ITEM_' + new Date().getTime();  // Unique Order Item ID

    const query = `
        INSERT INTO tbl_order_items (order_item_id, order_id, pid, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [order_item_id, order_id, pid, quantity, price], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Order item added successfully',
            order_item_id: order_item_id,
        });
    });
};