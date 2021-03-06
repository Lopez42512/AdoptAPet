const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const favicon = require("express-favicon");
const petfinder = require("@petfinder/petfinder-js");
const keys = require(__dirname + "/keys.js");
// Function that stores the searched animal data into the animalsForAdoption array
const getAnimalData = require(__dirname + "/function.js");

const apiKey = keys.apiKey();
const secretKey = keys.secretKey();
const client = new petfinder.Client({ apiKey: apiKey, secret: secretKey });

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/images/paw.png"));

let animalsForAdoption = [];
let pageNumber = 0;
let zipCode;

app.get("/", function (req, res) {
  res.render("home")
});

app.post("/findAPet", function (req, res) {
    if(req.body.previous === "") {
        pageNumber--;
    } else{
        pageNumber++;
    }
    if(req.body.location) {
        zipCode = req.body.location;
    }
    console.log(pageNumber);
  async function getAnimal() {
    await client.animal
      .search({
        page: pageNumber,
        limit: 20,
        location: zipCode,
      })
      .then((resp) => {
        getAnimalData.storeAnimalData(resp, animalsForAdoption);
      })
      .then(() => {
        res.render("animal", { animals: animalsForAdoption, pagenumber: pageNumber, pagePath: req.route.path });
        animalsForAdoption = [];
      });
  }
  getAnimal();
});

app.post("/findAPet/:Animal", function (req, res) {
    if(req.body.previous === "") {
        pageNumber--;
    } else{
        pageNumber++;
    }
    if(req.body.location) {
        zipCode = req.body.location;
    }
  const animalType = req.params.Animal;
  async function getAnimal() {
    await client.animal
      .search({
        type: animalType,
        page: pageNumber,
        limit: 20,
        location: zipCode,
      })
      .then((resp) => {
        getAnimalData.storeAnimalData(resp, animalsForAdoption);
      })
      .then(() => {
        res.render("animal", { animals: animalsForAdoption, pagenumber: pageNumber, pagePath: req.originalUrl });
        animalsForAdoption = [];
      });
  }
  getAnimal();
});

app.get("/adopt/:animalID", function(req,res) {
    const selectedAnimal = req.params.animalID;
    async function getAnimal() {
        await client.animal
          .show(selectedAnimal)
          .then((resp) => {
            const animalData = resp.data.animal
            res.render("adopt", { selectedAnimalData: animalData});
          })
      }
      getAnimal();
})

app.post("/adopt/:animalID", function(req,res) {
    const selectedAnimal = req.params.animalID;
    async function getAnimal() {
        await client.animal
          .show(selectedAnimal)
          .then((resp) => {
            const animalData = resp.data.animal
            res.render("adopt", { selectedAnimalData: animalData});
          })
      }
      getAnimal();
})

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("APP listening on PORT 3000");
});
