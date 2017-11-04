'use strict';
const Joi = require('joi');
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

/**
 * GET request that allows you to pass in the customer Id as a query string param.
 */
exports.getBudget = ((req, res) => {
  const schema = Joi.object().keys({
    customer_id: Joi.string().required()
  });

  Joi.validate(req.query, schema, ((err, result) => {
    if (err) {
      res.status(500).send(`Failed schema validation: ${err.stack}`);
    }
    else {
      //TODO: mix in the amount spent of this budget
      //TODO: mix in the merchant code rather than the mcc
      const query = 'SELECT * FROM budget WHERE customer_id = ?';
      req.driver.query({
        sql: query,
        values: [ req.query.customer_id ]
      }, ((err, result, fields) => {
        if (err) {
          res.status(500).send(`Query error: ${err.stack}`);
        }
        else {
          //console.log('Results = ' + JSON.stringify(result, null, 4));
          let friendlyResult = result;
          res.json(friendlyResult);
        }
      }));
    }
  }));
});

module.exports = exports;
