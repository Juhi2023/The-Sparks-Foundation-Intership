const buyButton = document.getElementById('pay-btn');
const donateAmount = document.getElementById('donate-amount');

async function handlePayment() {
    const response = await fetch('/donate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: donateAmount.value })
    });
    
    const responseJson = await response.json();
    const order  = responseJson;
    const razorPayOptions = {
        key: 'rzp_test_zqaXD05LXtljzh',
        amount: donateAmount.value*100,
        currency: 'INR',
        name: `Donate`,
        description: `Testing`,
        order_id: order.data.id,
        
        handler: async (response)=> { 
          try{
              console.log(response)
              const response_data = await fetch('/verify', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                },
                  body: JSON.stringify(response)
              });
          }
          catch(error){
              console.log(error);
          }
      },
      prefill: {
        email: "juhisahu0863@gmail.com",
     },
      theme: {
          "color": "#00203F"
      }
  };
        
    const razorpayInstance = new Razorpay(razorPayOptions);
    console.log(razorpayInstance)
    razorpayInstance.open();
};
