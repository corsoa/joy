
'use strict';

const dotenv = require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const path    = require("path");
const request = require('request');

const app = express();

const options = {};
const router = express.Router([options]);

const controllers = require('./controllers/');

app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');

//app.use(express.static('public'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));

app.use(bodyParser.json());
app.use((req, res, next) => {
  const driver = require('./drivers/mysql.js');
  req.driver = driver;
  next();
});

app.use((req, res, next) => {
  const mcc_cache = {
    1: 'Airlines',
    2: 'Amusement and Entertainment',
    3: 'Associations',
    4: 'Auto Rental',
<<<<<<< HEAD
    5: 'Automobiles and Vehicles',
    6: 'Business Services',
    7: 'Cleaning Preparations',
    8: 'Clothing Stores',
    9: 'Contracted Services',
=======
    5: 'Automobiles and Vehicles', 
    6: 'Business Services', 
    7: 'Cleaning Preparations', 
    8: 'Clothing Stores', 
    9: 'Contracted Services', 
>>>>>>> 110b69ab015fb9ee851eed1c68671ab1887aafe7
    10: 'Education',
    11: 'Gas Stations',
    12: 'Government Services',
    13: 'High Risk Personal Retail',
    14: 'High Risk Personal Services',
    15: 'Hotels and Motels',
    16: 'Mail Phone Order',
    17: 'Miscellaneous Stores',
    18: 'Personal Services',
    19: 'Professional Services',
    20: 'Publishing Services',
    21: 'Repair Services',
    22: 'Restaurants',
    23: 'Retail Stores',
    24: 'Service Providers',
    25: 'Telecom and Data Utilities',
    26: 'Transportation',
    27: 'Utilities',
    28: 'Wholesale Trade'
  };
  req.mcc_cache = mcc_cache;
  next();
});

router.get('/', (req, res) => {

    var options = { method: 'POST',
      url: 'https://3hkaob4gkc.execute-api.us-east-1.amazonaws.com/prod/au-hackathon/accounts',
<<<<<<< HEAD
      headers:
=======
      headers: 
>>>>>>> 110b69ab015fb9ee851eed1c68671ab1887aafe7
       { 'postman-token': '36e11e3b-52a1-f527-9a53-6f6446d40b85',
         'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body: { account_id: 100700000 },
      json: true };
<<<<<<< HEAD

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

=======
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
>>>>>>> 110b69ab015fb9ee851eed1c68671ab1887aafe7
      console.log(body);
    });
  const renderOpts = {
    root: 'public'
  };
  res.render('index', renderOpts);
})

app.get('/authorizedUsers', (req, res) => {
<<<<<<< HEAD
  controllers.authorizedUsers(req, res);
=======
  controllers.authorizedUsers(req, res); 
>>>>>>> 110b69ab015fb9ee851eed1c68671ab1887aafe7
});

app.post('/budget', (req, res) => {
  controllers.budget.setBudget(req, res);
});

app.get('/budget', (req, res) => {
  controllers.budget.getBudget(req, res);
});

app.use('/', router);

<<<<<<< HEAD
app.listen(8080 , () => console.log('Example app listening on port 8080!'))
=======
app.listen(8080 , () => console.log('Example app listening on port 8080!'))
>>>>>>> 110b69ab015fb9ee851eed1c68671ab1887aafe7
