const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const favicon = require("express-favicon");
const petfinder = require("@petfinder/petfinder-js");
const keys = require(__dirname + "/keys.js")
const getAnimalData = require(__dirname + "/function.js")

const apiKey = keys.apiKey()
const secretKey = keys.secretKey()
const client = new petfinder.Client({ apiKey: apiKey, secret: secretKey });

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/images/paw.png"));

let animalsForAdoption = [];

app.get("/", function (req, res) {
  async function getAnimal() {
    await client.animal
      .search({
        limit: 3,
      })
      .then((resp) => {
        getAnimalData.storeAnimalData(resp, animalsForAdoption)
      })
      .then(() => {
          console.log(animalsForAdoption)
        res.render("home", {animals: animalsForAdoption});
        animalsForAdoption = []
      });
  }
  getAnimal();
});

app.post("/findAPet", function (req, res) {
    console.log(req.body);
  const zipCode = req.body.location;
  async function getAnimal() {
    await client.animal
      .search({
        limit: 20,
        location: zipCode
      })
      .then((resp) => {
        getAnimalData.storeAnimalData(resp, animalsForAdoption)
      })
      .then(() => {
          console.log(animalsForAdoption)
        res.render("animal", {animals: animalsForAdoption});
        animalsForAdoption = []
      });
  }
  getAnimal();
});

app.listen(3000, function (req, res) {
  console.log("APP listening on PORT 3000");
});
