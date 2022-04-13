const express = require("express");
const ejs = require('ejs');
const app= express();

const bodyparser = require('body-parser');
const path = require("path");
const mysql= require('mysql2');


const port=3000||process.env.PORT;
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.set('view engine', 'ejs');


const static_path= path.join(__dirname, "public");
app.use(express.static(static_path));


const db = mysql.createConnection({
    host: 'sql4.freesqldatabase.com',
    user: 'sql4485407',
    database: 'sql4485407',
    password: "B6Hqtkpflf",
    port:3306
});

  
db.connect(function(err) {
    if (err) 
        throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE IF NOT EXISTS customers (bankID VARCHAR(30), name VARCHAR(255), email VARCHAR(30), balance INT); ";
    db.query(sql, function (err, result) {
      if (err) 
        throw err;
      console.log("Table 1 created");
    });

    var sql2 = "CREATE TABLE IF NOT EXISTS transactions (SNo INT NOT NULL AUTO_INCREMENT PRIMARY KEY, sender VARCHAR(225) NOT NULL, receiver VARCHAR(255) NOT NULL, amount INT, date_time DATETIME);";
    db.query(sql2, function (err, result) {
      if (err) 
        throw err;
      console.log("Table 2 created");
    });
  });





app.get('/', function (req, res) {
    res.render('index');
  })

app.get('/customers', function (req, res) {
  var sql = "SELECT * FROM customers";
    db.query(sql, function (err, result) {
      if (err) 
        throw err;
      res.render('customers', {customers: result});
  })
});
  
app.get('/customers/:id', function (req, res) {
  const id=req.params.id;
  var sql = `SELECT * FROM customers WHERE bankID= "${id}"`;
    db.query(sql, function (err, result) {
      if (err) 
        throw err;
        console.log(result)
      res.render('customer_detail', {customer: result});
  })
});

app.get('/transfer/:id', (req, res) => {
  const id=req.params.id;
  let sql = `SELECT * FROM customers;`;
    db.query(sql, function (err, result) {
      if (err) 
        throw err;
      res.render('transfer', {customers: result, id: id, msg:"undefined"});
  });
});


app.post('/transfer/:id', function (req, res) {
  const senderID=req.params.id;
  let senderName;
  const receiverName= req.body.receiver;
  const amount = req.body.amount;

  if(receiverName==null)
  {
    console.log("Please select the receiver!");
    let sql = `SELECT * FROM customers;`;
    db.query(sql, function (err, result) {
      if (err) 
        throw err;
        console.log(senderID)
      res.render('transfer', {customers: result, id: senderID, msg:"Please select the receiver!"});
    });
  }

  else if(amount<=0)
  {
      console.log("Enter a Valid Amount!");
      let sql = `SELECT * FROM customers;`;
      db.query(sql, function (err, result) {
        if (err) 
          throw err;
        res.render('transfer', {customers: result, id: senderID, msg:"Enter a Valid Amount!"});
      });
  }
  else
  {
    let sql = `SELECT * FROM customers WHERE bankID="${senderID}";`;
      db.query(sql, function (err, result) {
        if (err) 
          throw err;

        else if(amount>result[0].balance)
        {
          let sql = `SELECT * FROM customers;`;
          db.query(sql, function (err, result) {
            if (err) 
              throw err;
            res.render('transfer', {customers: result, id: senderID, msg:"Insufficient Balance!"});
          });
        }

        else
        {
          let sql = `UPDATE customers SET balance=balance-${amount} WHERE bankID="${senderID}";`;
          db.query(sql, function (err, result) {
            if (err) 
              throw err;
          });

          let sql2 = `UPDATE customers SET balance=balance+${amount} WHERE name="${receiverName}";`;
          db.query(sql2, function (err, result) {
            if (err) 
              throw err;
          });

          senderName=result[0].name;
          let sql3 = `INSERT INTO transactions (sender, receiver, amount, date_time) VALUES ("${senderName}", "${receiverName}", "${amount}", NOW())`;
          db.query(sql3, function (err, result) {
            if (err) 
              throw err;
          });
        }

        res.redirect('/customers');
    });
  }
});


app.get('/transactions', (req, res) => {
  let sql = `SELECT * FROM transactions;`;
  db.query(sql, function (err, result) {
    if (err) 
      throw err;
    for(let i=0; i<result.length; i++)
    {
      let dt=result[i].date_time.toString();
      let d=dt.slice(4,15);
      let t=dt.slice(16,24);
      let newdt=d+" "+t;
      result[i].date_time =newdt;
      console.log(result[i].date_time)
    }
      res.render('transactions', { transactions: result });
  });
});

app.use((req, res) => {
  res.render('error');
});


app.listen(3000, ()=>{
    console.log(`listening at port: ${port}`);
})