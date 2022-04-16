const Razorpay = require("razorpay");
const router =  require("express").Router();
const crypto = require("crypto");



//request to create(fire) order (for front send)
router.post("/donate", async(req, res)=>{
    try{
        var instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET
          });   
          
        const options ={
            amount: req.body.amount*100,
            currency:"INR",
            receipt: crypto.randomBytes(10).toString("hex")
        };
        instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
          });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error!"});
    }
})

//Verifying authenticity and sending a corresponding response to the User (frontend send)
router.post("/verify", async(req, res)=>{
    try{
        const{
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const generated_signature= crypto.createHmac("sha256", process.env.KEY_SECRET).update(sign.toString()).digest("hex");

        if(razorpay_signature === generated_signature){
            return res.status(200).json({message: "Payment verified successfully!"});
        }
        else{
            return res.status(400).json({message: "Invavlid Signature Sent!"});
        }
    }
    catch(error){
        console.log(error);
         res.status(500).json({message: "Internal Server Error!"});
    }
})

module.exports = router;