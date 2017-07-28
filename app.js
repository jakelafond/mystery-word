const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.engine('mst', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mst');

app.get('/', (req, res) => {
  res.send('it works');
});

app.listen(3000, () => {
  console.log('Your app is running!');
});
