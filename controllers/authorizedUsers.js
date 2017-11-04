const handler = ((req, res) => {
  req.driver.query('SELECT * FROM merchants;', (err, results, fields) => {
    res.send(results);
  });
});

module.exports = handler;
