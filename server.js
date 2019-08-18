var express = require("express");
var app = express();
const mysql = require("mysql");
const AWS = require("aws-sdk");
var port = 8001;
var bodyParser = require("body-parser");
var fs = require("fs");
var formidable = require("formidable");
var upload = require("express-fileupload");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload());
var mysqlConnection = mysql.createConnection({
  host: "database-2.cizsguibvuyu.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "qwertyuiop",
  database: "pt2database"
});
var s3 = new AWS.S3({
  accessKeyId: "ASIAYELQKAFJIW4XFK4F",
  secretAccessKey: "BJBk1eMqQwuWf7wX5SLQ9osdqs9lHwPo1zfTcORv",
  /*if you are using educate account include this here*/
  sessionToken:
    "FQoGZXIvYXdzEO3//////////wEaDApAZ5hHkAfktX85vyL8BERvsu3uo8aTXi2O7tgjD0zM5sul67BBOrlQGgYttVYeArTztmI40hdJPoxqoub0nVPRoR8xNpSuVLn7DuhBOqmFcvpoTu7IzZkhp3maxBDQRioNGLW+Gb4mlTKGjA2P1eqkPR8tMwJyFKeYJMy0WpKeqFzN8l31OheXHoY3ZQ6GgKnG0/FZWmI5QPvIRqHV8G2ISbHSwYdIm0ZL4o+OKvOXrIvoO5rrg9G+FZVhz2eHVFOUj0+7d/avx5LQyKj61U5BJJzQtylw3ldD9hgAh046w1IghpHG5xDo1+gxKlsnh4HS8sLWhKWpOdCWjchtOV0ubEXtsYHtdfFb/OqDR4lbrd5h7YobL9++UiHrk4cbCgffLkON4IYorXXW6en2HrYP7ceMi2lEbwR+qXIW9JdUpbfGZ1XSydgeixnjPf7wJ+3qFe8WDhSEfzA5jxCKxOrsVTC+ykAj+LQ7jhoRt3aOQx3iC/Nc6FagepMtnHdvpNKYwztdbfh/KdkK7UOJKhOUuva4djHcIkYxF+/jXkFg459GXrAWiV5iPe42uM0mET9uvZcBnQDmxIDtlutxlSxXIVuFwn244NiRra9gK3rJBeBaxpHddEi02guAVHY3gnvOegi2pmWGQsFavjFfuLrJMgwT2ccNX/++qoDcaVCp5BOfgZYLkWbU1mP3POpHDaI2oNK0ycTdoE0F9Me2G+q08xAWim8OpGg4N0JP9zykSxmjigD5bKG0u5ytEignKIl+PDgcE6FmQGXo2Vebznh9L/2s6u404XHK9w66AqwRYtSmTXNYHG/iH4ebBa6NCeFuDhkA3HGof+DNmQTTohye5plvC4RuK2Cg3iiq+eTqBQ=="
});
var fileName = "mynewfile3.txt";
var uploadFile = () => {
  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    var params = {
      Bucket: "sriharihari1", // pass your bucket name
      Key: "SH", // file will be saved as testBucket/
      Body: data
    };
    s3.upload(params, function(s3Err, data) {
      if (s3Err) throw s3Err;
      console.log("File uploaded successfully at ${data.Location}");
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
