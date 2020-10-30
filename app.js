const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const favicon = require("express-favicon");
const petfinder = require("@petfinder/petfinder-js");
const keys = require(__dirname + "/keys.js");
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
  pageNumber = 0;
  async function getAnimal() {
    await client.animal
      .search({
        limit: 3,
      })
      .then((resp) => {
        getAnimalData.storeAnimalData(resp, animalsForAdoption);
      })
      .then(() => {
        // console.log(animalsForAdoption);
        // console.log(animalsForAdoption.length);
        res.render("home", { animals: animalsForAdoption });
        animalsForAdoption = [];
      });
  }
  getAnimal();
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
  console.log(zipCode);
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
        //   console.log(animalsForAdoption[0]);
        res.render("animal", { animals: animalsForAdoption, pagenumber: pageNumber });
        animalsForAdoption = [];
      });
  }
  getAnimal();
});

app.post("/adopt/id=:animalID", function(req,res) {
    console.log(req.params)
    const selectedAnimal = req.params.animalID;
    async function getAnimal() {
        await client.animal
          .show(selectedAnimal)
          .then((resp) => {
            //   console.log(resp.data.animal);
            const animalData = resp.data.animal
            res.render("adopt", { selectedAnimalData: animalData});
          })
      }
      getAnimal();
})

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("APP listening on PORT 3000");
});
