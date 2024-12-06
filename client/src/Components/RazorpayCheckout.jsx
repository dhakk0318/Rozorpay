 import React, { useState } from 'react';
import axios from 'axios';

const RazorpayCheckout = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to create order
  const createOrder = async () => {
    try {
      setLoading(true); 
      const { data } = await axios.post('http://localhost:5000/api/razorpay/createOrder', {
        cid: 'customer1',    
        total_amount: 500    
      });

      setOrderData(data.order_data);
      setLoading(false);
      startPayment(data.order_data);
    } catch (error) {
      console.error("Error creating order:", error);
      setLoading(false);
    }
  };

 const startPayment = (orderData) => {
  const options = {
    key: 'rzp_test_qN2ZW9ayQgETQV',   
    amount: orderData.amount,   
    currency: 'INR',
    name: 'My Store',
    description: 'Payment for order ' + orderData.receipt,
    order_id: orderData.id,
    handler: function (response) {
      console.log("Payment response:", response);  
      verifyPayment(response);
    },
    prefill: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      contact: '9999999999'
    },
    theme: {
      color: '#F37254'
    }
  };

  const rzp1 = new window.Razorpay(options);
  rzp1.open();
};

 const verifyPayment = async (paymentData) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/razorpay/verifyPayment', {
      order_id: paymentData.razorpay_order_id,
      payment_id: paymentData.razorpay_payment_id,
      signature: paymentData.razorpay_signature
    });
    alert('Payment Verified: ' + data.message);
  } catch (error) {
    console.error('Error verifying payment:', error);
    alert('Payment verification failed!');
  }
};

 
  return (
    <div>
      <h2>Razorpay Payment Integration</h2>
      <button onClick={createOrder} disabled={loading}>
        {loading ? 'Creating Order...' : 'Pay with Razorpay'}
      </button>
    </div>
  );
};

export default RazorpayCheckout;
