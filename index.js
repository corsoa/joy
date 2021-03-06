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
    5: 'Automobiles and Vehicles', 
    6: 'Business Services', 
    7: 'Cleaning Preparations', 
    8: 'Clothing Stores', 
    9: 'Contracted Services', 
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
  res.render('index');
});

router.get('/authorized-users/:account_id', (req, res) => {
  controllers.authorizedUsers.getAuthorizedUsers(req, res); 
});

router.post('/budget', (req, res) => {
  controllers.budget.setBudget(req, res);
});

router.get('/budget', (req, res) => {
  controllers.budget.getBudget(req, res);
});

router.post('/objective/:customer_id', (req, res) => {
  controllers.objective.setObjective(req, res);
});

router.get('/merchant-categories', ((req, res) => {
  controllers.merchant.getMerchantCategories(req, res);
}));

router.get('/list-accounts', ((req, res) => {
  controllers.accounts.listAccounts(req, res);
}));

router.get('/choose-account', ((req, res) => {
  res.render('choose-account');
}));

router.get('/igoal', function(req, res) {
  res.render('goal');
});

router.get('/fgoal', ((req, res) => {
  res.render('family-goal');
}));

router.get('/homepersonal', ((req, res) => {
  res.render('homepersonal');
}));

router.get('/mygoal', ((req, res) => {
  res.render('mygoal');
}));

app.use('/', router);

app.listen(8080 , () => console.log('Example app listening on port 8080!'))
