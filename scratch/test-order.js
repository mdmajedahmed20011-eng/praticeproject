async function testOrder() {
  const payload = {
    customerName: "Test User",
    customerEmail: "test@example.com",
    customerPhone: "01700000000",
    shippingAddress: "123 Test St, Dhaka, 1200",
    totalAmount: 1500,
    paymentMethod: "COD",
    items: [
      {
        id: "8339687e-5130-4d31-8a90-30bb388d215a", 
        quantity: 1,
        price: 1500,
        selectedSize: "M",
        selectedColor: "#000000"
      }
    ]
  };

  try {
    const res = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('Order simulation successful!');
      const data = await res.json();
      console.log('Order ID:', data.id);
    } else {
      console.error('Order simulation failed:', await res.text());
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testOrder();
