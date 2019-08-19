var express = require("express");
var app = express();
const mysql = require("mysql");
const AWS = require("aws-sdk");
var port = 8001;
var bodyParser = require("body-parser");
var fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
  host: "database-2.cizsguibvuyu.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "qwertyuiop",
  database: "pt2database"
});
var s3 = new AWS.S3({
  accessKeyId: "ASIAYELQKAFJBSAY427B",
  secretAccessKey: "qRJyMc5mFiQJIpU9cDA6TGZ9bpYIgHxtyA+Z/Url",
  /*if you are using educate account include this here*/
  sessionToken:
    "FQoGZXIvYXdzEP3//////////wEaDEXwRpDI+DQEo8a91yL8BMGNkjmRMK+OG1kCCweJGki1fRO8PQ/2g9Hjme/H1xgmpF5n9HX3T0BVHCJTcFS2aSY5MmXvbEhkkEIuCbT2imLvYfdAQXfVLofmp5ClcUxdQRVDgXfGDLdFUytnPgQAiU/3YqyGE/mfVgiKLkqShGMFHyj96Tu2WNu/LMAanOd8hmHGRT5Iv29ZgVpGh1BqlvUdSf2c+5vurJjhDX55VVk3u8w+ZV6FFDaxxXBYJg1VNj/k6dR4E2SzjDm9jYp2RQ/APjjUuud7E4Aw/1C7JWUtlEqrRWoY2OnyHHH3g1TwoHz8vVB1iKEEFySbpjIQ0eR/0PeVMvKxFfbcfdxF6mb1tQoaZfUM4Wqzl/UYAiIa0ZKxDypE7eoUjJuZtsdCgw2o9/CifU+9/FMgtOk6ujYGZ5l6mtg5K6xI/7rNPMvxIvHxVXpm2D9liB8stXq4BT2ekhdqxFLch1eBfAsVU6IqZBTZxTj4KjetW/FqZ3oQNppASf8zL0ukT0W2wfJxii2iUf14EOWR3IVQKbImSQqn5sLOEwUd5/QHIKGvbA0rgvq/WzfauJ4T+BxLter/o2zcnxARyHu1pw7ztukXUgv9lVA7NRzPTtyZg6muQbfC3r6mTLnjfq9a9RotpiMZBL3imQee9Gvg7+D656SqE33pnE7imJMG37NDnP8GTthtwpZSjQeo6ig5EVtjra7eXkQbrgnJ8KYqJFNOoW2lbgrBZWt6xTjiQesP+IGiaiw4dp83mAujwXdIA1LqKqFJeEri/DB8A/zEoWjoyOGFarqurIrEndRTJj8RS0wyfX0sGp+F2LHNzJiblbaG8IucDfBg8COZ0SalM+z+USjTvujqBQ=="
});
let fileName = "";
var uploadFile = () => {
  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    var params = {
      Bucket: "sriharihari1", // pass your bucket name
      Key: fileName, // file will be saved as testBucket/
      Body: data
    };
    s3.upload(params, function(s3Err, data) {
      if (s3Err) throw s3Err;
      console.log("File uploaded successfully at " + data.Location);
    });
  });
};

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
        fs.appendFile(
          "mynewfile3.txt",
          result[i].name + " " + result[i].password + " " + result[i].age,
          function(err) {
            if (err) throw err;
          }
        );
      }
      fileName = "mynewfile3.txt";
      uploadFile();

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
  var filename = req.body.document;
  fileName = filename;
  uploadFile();
  console.log(filename);
  mysqlConnection.query(
    "insert into login(name,password,age) values(?,?,?)",
    [name, password, age],
    function(err, result, fields) {
      if (err) throw err;
      console.log(name + " " + password + " " + age);
    }
  );

  res.send(
    "POST request to the homepage" + " " + name + " " + password + " " + age
  );

  /* new formidable.IncomingForm()
    .parse(req)
    .on("fileBegin", (name, file) => {
      file.path = __dirname + "/uploads/" + name;
      console.log(file.path);
    })
    .on("file", (name, file) => {
      console.log("Uploaded file", name, file);
    });*/
});

app.listen(port, () => console.log("Example app listening on port port!"));
