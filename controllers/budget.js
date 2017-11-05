'use strict';
const Joi = require('joi');
const request = require('request');
const Promise = require('bluebird');
let driver;
/**
 * POST request
 */

exports.setBudget = ((req, res) => {
  const body = req.body;
  const schema = Joi.object().keys({
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    max_consume: Joi.number().required(),
    mcc: Joi.number().integer().required(),
    customer_id: Joi.number().integer().required()
  });
  Joi.validate(req.body, schema, ((err, result) => {
    if (err) {
      res.status(500).send(`Failed validation: ${err.stack}`);
    }
    else {
      const query = 'INSERT INTO budget(start_date, end_date, max_consume, mcc, customer_id) VALUES(?, ?, ?, ?, ?)';
      req.driver.query({
        sql: query,
        values: [ body.start_date, body.end_date, body.max_consume, body.mcc, body.customer_id ]
      }, ((err, results, fields) => {
        if (!err) {
          res.sendStatus(200);
        }
        else {
          console.error(err);
          res.status(500).send(`Query error: ${err.stack}`);
        }
      }));
    }
  }));
});

exports.getSpentBudget = ((customer_id, date_from, date_to) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      url: `${process.env.BASE_URL}/transactions`,
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      json: true,
      body: {
        customer_id: parseInt(customer_id), //API hates string
        date_from: date_from.toString(),
        date_to: date_to.toString()
      }
    };
    console.log(requestOptions);
    request(requestOptions, ((err, res, body) => {
      if (err) {
        reject(err);
      }
      else {
        if (res.statusCode === 200) {
          console.log('body');
          console.log(body);
          resolve(body);
        }
        else {
          reject(new Error(`Invalid status code: ${res.statusCode}`));
        }
      }
    }));
  });
});

exports.getAllocatedBudget = ((customer_id, date_from, date_to) => {
  return new Promise((resolve, reject) => {
    //TODO: mix in the amount spent of this budget
    const query = `SELECT b.*,
      (SELECT mcc_segment_description FROM merchants WHERE mcc_segment = b.mcc  GROUP BY mcc_segment_description) AS mcc_segment_description
      FROM budget b 
      WHERE customer_id = ?`;
    driver.query({
      sql: query,
      values: [ customer_id ]
    }, ((err, result, fields) => {
      if (err) {
        reject(new Error(`Query error: ${err.stack}`));
      }
      else {
        console.log('query result');
       resolve(result); 
      }
    }));
  });
});

exports.getOnlyMerchantNames = ((rawResults) => {
  let merchantList = [];
  rawResults[0].customers[0].transactions.forEach((transactionDetail) => {
    merchantList.push(transactionDetail.merchant_name);
  });
  return merchantList;
});

/**
 * GET request that allows you to pass in the customer Id as a query string param.
 */
exports.getBudget = ((req, res) => {
  const schema = Joi.object().keys({
    customer_id: Joi.string().required(),
    date_from: Joi.string().required(),
    date_to: Joi.string().required()
  });

  Joi.validate(req.query, schema, ((err, result) => {
    if (err) {
      res.status(500).send(`Failed schema validation: ${err.stack}`);
    }
    else {
      driver = req.driver;
      const customer_id = req.query.customer_id;
      const date_from = req.query.date_from;
      const date_to = req.query.date_to;
      Promise.all([exports.getSpentBudget(customer_id, date_from, date_to), exports.getAllocatedBudget(customer_id, date_from, date_to)]).then((allResults) => {
        console.log('all results');
        const onlyMerchantNames = exports.getOnlyMerchantNames(allResults[0]);
        // make a query to determine the mapping between the merchant names and the merchant 
        // process the result of the spent budget
        console.log(JSON.stringify(allResults, null, 4));
        //temporary...
        res.send(allResults[1]);
      }).catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    }
  }));
});

module.exports = exports;
