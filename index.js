'use strict';

const dotenv = require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const options = {};
const router = express.Router([options]);

const controllers = require('./controllers/');

app.use(express.static('public'));
app.use(bodyParser.json());

app.use((req, res, next) => {
  const driver = require('./drivers/mysql.js');
  req.driver = driver;
  next();
});

console.log('controllers');
console.log(controllers);

router.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/authorizedUsers', (req, res) => {
  controllers.authorizedUsers(req, res); 
});

app.post('/budget', (req, res) => {
  controllers.budget.setBudget(req, res);
});

app.get('/budget', (req, res) => {
  controllers.budget.getBudget(req, res);
});

app.use('/', router);

app.listen(8080 , () => console.log('Example app listening on port 8080!'))
