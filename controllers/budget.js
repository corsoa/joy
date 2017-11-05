'use strict';
const Joi = require('joi');
const request = require('request');
const Promise = require('bluebird');
let driver;

exports.setBudgetStandalone = ((body, driver) => {
  return new Promise((resolve, reject) => {

      const query = 'INSERT INTO budget(start_date, end_date, max_consume, mcc, customer_id) VALUES(?, ?, ?, ?, ?)';
      driver.query({
        sql: query,
        values: [ body.start_date, body.end_date, body.max_consume, body.mcc, body.customer_id ]
      }, ((err, results, fields) => {
        if (!err) {
          resolve(results);
        }
        else {
          console.error(err.stack);
          reject(err);
        }
      }));
  });
});


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
      exports.setBudgetStandalone(body, req.driver).then(() => {
        res.sendStatus(200);
      }).catch((err) => {
        console.error(err);
        res.status(500).send(`Query error: ${err.stack}`);
      });
    }
  }));
});

exports.getTransactions = ((customer_id, date_from, date_to) => {
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
    request(requestOptions, ((err, res, body) => {
      if (err) {
        reject(err);
      }
      else {
        if (res.statusCode === 200) {
          resolve(body);
        }
        else {
          reject(new Error(`Invalid status code: ${res.statusCode}`));
        }
      }
    }));
  });
});

exports.getAllocatedBudget = ((customer_id, date_from, date_to, mcc_cache) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT b.*
      FROM budget b 
      WHERE customer_id = ?`;
    driver.query({
      sql: query,
      values: [ customer_id ]
    }, ((err, results, fields) => {
      if (err) {
        reject(new Error(`Query error: ${err.stack}`));
      }
      else {
        console.log('query result');
        //mix in the mcc "human readable" names from the middleware
       results.forEach((row) => {
         if (mcc_cache[row.mcc]) {
           row.mcc_segment_description = mcc_cache[row.mcc];
         }
       });
       resolve(results); 
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
 * This gets a hash of the passed in list of merchants
 * and returns their corresponding MCC segment description
 */
exports.getMCCSegmentsFromNames = ((nameList, mcc_cache) => {
  return new Promise((resolve, reject) => {
    // this is dumb but it works.
    let inClause = '';
    for (let i = 0; i < nameList.length; i += 1) {
      if (i !== nameList.length -1) {
        inClause += '?, '; 
      }
      else {
        inClause += '?';
      }
    }
    const sqlQuery = `SELECT mcc_description, mcc_segment FROM merchants WHERE mcc_description IN (${inClause})`;
    driver.query({
      sql: sqlQuery,
      values: nameList
    }, ((err, results) => {
      if (err) {
        reject(new Error(`QueryError: ${err.stack}`));
      }
      else {
        let merchantHash = {};
        results.forEach((row) => {
          merchantHash[row.mcc_description] = {};
          if (mcc_cache[row.mcc_segment]) {
            merchantHash[row.mcc_description].mcc_segment_description = mcc_cache[row.mcc_segment];
          }
        });
        resolve(merchantHash);
      }
    }));
  });
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
      Promise.all([exports.getTransactions(customer_id, date_from, date_to), exports.getAllocatedBudget(customer_id, date_from, date_to, req.mcc_cache)]).then((allResults) => {
        const onlyMerchantNames = exports.getOnlyMerchantNames(allResults[0]);
        // make a query to determine the mapping between the merchant names and the merchant 
        exports.getMCCSegmentsFromNames(onlyMerchantNames, req.mcc_cache).then((mccInfo) => {
          let spendingByMccSegment = {};
          // process the result of the spent budget
          allResults[0][0].customers[0].transactions.forEach((transaction) => {
            let mccSegmentDescription = '';
            if (mccInfo[transaction.merchant_name]) {
              mccSegmentDescription = mccInfo[transaction.merchant_name].mcc_segment_description;
            }
            else {
              mccSegmentDescription = 'Uncategorized';
            }
            if (!spendingByMccSegment[mccSegmentDescription]) {
              spendingByMccSegment[mccSegmentDescription] = 0;
            }
            spendingByMccSegment[mccSegmentDescription] += transaction.amount;
          });
          //finally, iterate over the "budget" data and from the mapping, figure out how much they spent against their budget for this mcc.
          allResults[1].forEach((budgetRecord) => {
            if (spendingByMccSegment[budgetRecord.mcc_segment_description]) {
              budgetRecord.spentAmount = spendingByMccSegment[budgetRecord.mcc_segment_description];
            }
            else {
              budgetRecord.spentAmount = 0;
            }
          });
          res.send(allResults[1]);
        }).catch((err) => {
          res.status(500).send(err.stack);  
        });
      }).catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    }
  }));
});

module.exports = exports;
