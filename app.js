const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n');
let underscores = [];
let guesses = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

let normalWord = function() {
  let i = Math.floor(Math.random() * words.length);
  return words[i];
};

let newWord = normalWord();

for (let x = 0; x < newWord.length; x++) {
  underscores.push('_');
}

app.get('/', (req, res) => {
  res.render('index', { underscores: underscores, guesses: guesses });
});

app.post('/', (req, res) => {
  guesses.push(req.body.guess);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Your app is running!');
});
