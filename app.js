const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n');
let underscores = [];
var secretWord = [];
let play = '';

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

app.get('/', (req, res) => {
  counter = 8;
  guesses = [];
  play = '.';
  let newWord = normalWord();
  secretWord = newWord.split('');
  underscores = secretWord.map((x, index) => {
    return (x = '_');
  });
  res.render('index', { underscores, guesses, counter, secretWord, play });
  console.log(newWord);
});

app.post('/', (req, res) => {
  //check for errors
  req
    .checkBody('guess', 'You must enter a single alpha character to make a guess.')
    .notEmpty()
    .isLength(0, 1)
    .isAlpha();
  var errors = req.validationErrors();

  if (errors) {
    var html = errors;
    console.log(errors);
    res.render('index', { underscores, guesses, counter, secretWord, play, errors });
  } else if (guesses.includes(req.body.guess)) {
    errors = { msg: 'You already guessed that character, pick again!' };
    res.render('index', { underscores, guesses, counter, secretWord, play, errors });
  } else {
    //no errors so run this block to do guess logic while counter != 0
    if (counter != 0) {
      if (secretWord.includes(req.body.guess)) {
        underscores = secretWord.map((letter, index) => {
          if (letter === req.body.guess) {
            return (letter = req.body.guess);
          } else if (underscores[index] === letter) {
            return letter;
          } else {
            return (letter = '_');
          }
        });
        guesses.push(req.body.guess);
      } else {
        counter -= 1;
        console.log(counter);
        guesses.push(req.body.guess);
      }
    }
    //run this block to determine game state (lose, still playing, win)
    if (counter === 0) {
      let youLose = 'l';
      res.render('index', { underscores, guesses, counter, secretWord, youLose });
    } else if (underscores.includes('_')) {
      res.render('index', { underscores, guesses, counter, play });
    } else if (underscores.includes('-') === false) {
      let youWin = 'w';
      res.render('index', { underscores, guesses, counter, youWin });
    }
  }
});

app.post('/playagain', (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Your app is running!');
});
