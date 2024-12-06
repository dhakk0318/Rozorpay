const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const razorpayRoutes = require('./Routes/razorpayRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'  // Allow only your frontend domain
  }));
  
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/razorpay', razorpayRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
