const fs = require('fs');
const csv = require('fast-csv');
const stream = fs.createReadStream('merchant_list.csv');
require('dotenv').config({ path: '../.env'});
const driver = require('../drivers/mysql');
var csvStream = csv()
    .on("data", function(data){
      console.log(typeof(data));
      const sql = 'INSERT INTO merchants(mcc_description, mcc_segment) VALUES(?, ?)';
       driver.query({
          sql: sql,
          values: [ data[0], data[1] ]
       }, ((err, results) => {
          console.error(err);
         console.log(results);
       }));
    })
    .on("end", function(){
         console.log("done");
    });

stream.pipe(csvStream);
