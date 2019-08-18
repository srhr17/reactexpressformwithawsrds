var express = require("express");
var app = express();
const mysql = require("mysql");
const AWS = require("aws-sdk");
var port = 8001;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
  host: "database-2.cizsguibvuyu.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "qwertyuiop",
  database: "pt2database"
});

mysqlConnection.connect(err => {
  if (!err) console.log("Connection succeeded.");
  else
    console.log("Unsuccessful \n Error : " + JSON.stringify(err, undefined, 2));
});

app.get("/login", function(req, res) {
  mysqlConnection.query("select * from login", function(err, result, fields) {
    if (!err) {
      for (let i = 0; i < result.length; i++) {
        console.log(
          result[i].name + " " + result[i].password + " " + result[i].age
        );
        res.write(
          "<!DOCTYPE html> <head></head> <body> <h1> Entry No : " +
            (i + 1) +
            " </h1> <h1> Name : </h1> <h4>" +
            result[i].name +
            "</h4> <h1>  Password : </h1> <h4>" +
            result[i].password +
            "</h4><h1>    Age : </h1><h4>" +
            result[i].age +
            "</h4> <hr> </body>"
        );
      }

      res.end();
    } else {
      console.log(err);
      res.end();
    }
  });
});

app.post("/login", function(req, res) {
  console.log("Inside post /login method");

  var name = req.body.name;
  var password = req.body.password;
  var age = req.body.age;

  mysqlConnection.query(
    "insert into login(name,password,age) values(?,?,?)",
    [name, password, age],
    function(err, result1, fields) {
      if (err) throw err;
      console.log(result1 + bloodgroup);
      res.write("Submitted Succesfully");
    }
  );

  console.log(name + " " + password + " " + age);
  res.send(
    "POST request to the homepage" + " " + name + " " + password + " " + age
  );
});

app.listen(port, () => console.log(`Example app listening on port port!`));
