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

let randomWord = function() {
  let i = Math.floor(Math.random() * words.length);
  return words[i];
};

app.get('/', (req, res) => {
  let gameMode = '.';
  res.render('index', { gameMode });
});

app.get('/easy', (req, res) => {
  counter = 8;
  guesses = [];
  play = '.';
  let easyWord = randomWord();
  while (easyWord.length < 1 || easyWord.length > 5) {
    easyWord = randomWord();
  }
  secretWord = easyWord.split('');
  underscores = secretWord.map((x, index) => {
    return (x = '_');
  });
  res.render('index', { underscores, guesses, counter, secretWord, play });
  console.log(easyWord);
});

app.get('/normal', (req, res) => {
  counter = 8;
  guesses = [];
  play = '.';
  let normalWord = randomWord();
  while (normalWord.length < 5 || normalWord.length > 8) {
    normalWord = randomWord();
  }
  secretWord = normalWord.split('');
  underscores = secretWord.map((x, index) => {
    return (x = '_');
  });
  res.render('index', { underscores, guesses, counter, secretWord, play });
  console.log(normalWord);
});

app.get('/hard', (req, res) => {
  counter = 8;
  guesses = [];
  play = '.';
  let hardWord = randomWord();
  while (hardWord.length < 8) {
    hardWord = randomWord();
  }
  secretWord = hardWord.split('');
  underscores = secretWord.map((x, index) => {
    return (x = '_');
  });
  res.render('index', { underscores, guesses, counter, secretWord, play });
  console.log(hardWord);
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
    //run this block to determine what game state (lose, still playing, win)
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

app.post('/easy', (req, res) => {
  res.redirect('/easy');
});

app.post('/normal', (req, res) => {
  res.redirect('/normal');
});

app.post('/hard', (req, res) => {
  res.redirect('/hard');
});

app.listen(3000, () => {
  console.log('Your app is running!');
});
