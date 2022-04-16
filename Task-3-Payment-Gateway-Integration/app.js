const express = require("express");
const ejs = require('ejs');
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payment");
const bodyparser= require("body-parser")

//initialize app
const app= express();
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//environment variables
dotenv.config();

//port
const port = process.env.PORT || 4000;

//middlewares
app.set('view engine', 'ejs');
app.use(cors());

const static_path= path.join(__dirname, "public");
app.use(express.static(static_path));


//routing
app.get('/', function (req, res) {
    res.render('index');
})


app.use("/", paymentRoutes);

  
app.use((req, res) => {
  res.render('error');
});
  
app.listen(port, ()=>{
  console.log(`listening at port: ${port}`);
})