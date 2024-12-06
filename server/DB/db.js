const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',    
    password: '',  // Add your password here if you have one
    port: 3306,
    database: 'rozorpay'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

// Export the connection for other files to use
module.exports = connection;
