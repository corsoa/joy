const express = require('express');
const serve = require ('express-static');
const app = express();

app.use (use(serve(_dirname + '/public'));
//app.get('/', (req, res) => res.send('Hello World!'))

const server = app.listen(8080, function(){
  console.log('server is running at %s', server.address ().port)
});

app.listen(8080 , () => console.log('Example app listening on port 8080!'))
