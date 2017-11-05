const request = require('request');
exports.listAccounts = ((req, res) => {
  const requestOptions = {
    url: `${process.env.BASE_URL}/accounts`,
    json: true,
    body: {},
    method: 'POST'
  };
  request(requestOptions, (err, response, body) => {
    if (err || (response && response.statusCode !== 200)) {
      console.log(response.statusCode);
      console.log(err);
      res.status(500).send();
    }
    else {
      res.send(body);
    }
  });
});
module.exports = exports;
