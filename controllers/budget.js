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

exports.getBudget = ((req, res) => {

});

module.exports = exports;
