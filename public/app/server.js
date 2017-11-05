var express    = require('express');        // call express
var app        = express();                 // define our app using express
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
var db = require('./database');
var request = require("request");
var path    = require("path");

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/images", express.static(__dirname + '/images'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var router = express.Router();  

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {


    var options = { method: 'POST',
      url: 'https://3hkaob4gkc.execute-api.us-east-1.amazonaws.com/prod/au-hackathon/accounts',
      headers: 
       { 'postman-token': '36e11e3b-52a1-f527-9a53-6f6446d40b85',
         'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body: { account_id: 100700000 },
      json: true };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
      console.log(body);
    });
   
    res.render('index');
    //res.sendFile(path.join(__dirname+'/index.html'));
     
      
    //res.json({ message: 'hooray! welcome to our api!' });   


});



app.use('/api', router);


app.listen(port);
console.log('Magic happens on port ' + port);