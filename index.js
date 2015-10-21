var express = require('express');
var app = module.exports = express();
//app.use(app.router);
app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  res.send('<h1>kukka</h1>');
});


app.listen(app.get('port'),function(){
  console.log('up and running...');
});
