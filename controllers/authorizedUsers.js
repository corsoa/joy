const Joi = require('joi');
const request = require('request');

exports.getAuthorizedUsers = ((req, res) => {
  const schema = Joi.object().keys({
    account_id: Joi.number().integer().required()
  });
  Joi.validate(req.params, schema, ((err, val) => {
    if (err) {
      res.status(500).send(`Schema validation: ${err.stack}`);
    }
    else {
      //retrieve the authorized users for this customer ID.
      const requestOptions = {
        method: 'POST',
        url: `${process.env.BASE_URL}/customers`,
        json: true,
        body: {
          account_id: parseInt(req.params.account_id) //WHY
        }
      };
      request(requestOptions, ((err, response, body) => {
        if (err || (res && res.statusCode !== 200)) {
          res.send(`Request error: ${err} or bad status`);
        }
        else {
          console.log(JSON.stringify(body, null, 4));
          res.send(body);
        }
      }));
    }
  }));
});

module.exports = exports;
