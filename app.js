const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  // res.sendFile(__dirname+"/contact.html");
  res.sendFile(path.join(__dirname, "contact.html"));
});

app.post("/", function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const subject = req.body.subject;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          MSG: message,
          SUB: subject,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  console.log(jsonData);

  const url = `https://us8.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`;

  const options = {
    method: "POST",
    auth: `aditya:${process.env.API_KEY}`,
  };

  const request = https.request(url, options, function (response) {
    // if (response.statusCode === 200){
    //     res.sendFile(__dirname+"/success.html")
    // }else{
    //     res.sendFile(__dirname+"/failure.html")
    // }
    if (response.statusCode === 200){
        res.send("Success")
    }else{
        res.send("Failure")
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

//   request.write(jsonData);
//   request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server is up and running at 3000");
});
