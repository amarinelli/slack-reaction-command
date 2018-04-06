const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const reacji = require('./reacji');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h2>Hi there</h2> <p>This is an integration that lists your reactions ✌️</p>');
});

// Slash command endpoint

app.post('/reactions', (req, res) => {
  const token = req.body.token;
  
  // Intentionally left blank to suppress messaging and avoid operation_timeout errors
  res.send("");
  
  if (token === process.env.SLACK_VERIFICATION_TOKEN) {
    console.log('success');
    axios.post(req.body.response_url, {
      "text": "What would you like to know about your reactions?",
      "attachments": [
        {
          "text": "_Most recent or most frequent?_",
          "fallback": "You are unable to choose a type",
          "callback_id": "reaction_type",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "mrkdwn_in": ["text"],
          "actions": [
            {
              "name": "recent",
              "text": "Recent",
              "type": "button",
              "value": "recent"
            },
            {
              "name": "frequent",
              "text": "Frequent",
              "type": "button",
              "value": "frequent"
            }
          ]
        }
      ]
    })
    .catch(function (error) {
      console.log(error);
    });    
  }  
})

// Interactive message buttons endpoint
// Two options: RECENT button click or FREQUENT button click
app.post('/interactive', (req, res) => {
  const body = JSON.parse(req.body.payload);
  
  // RECENT button
  if (body.actions[0].value == 'recent') {
    
    reacji.reactionsList(body.user.id, 5)
      .then(function (resp) {
        let recents = reacji.reactionUtility(resp, body.user.id, 5);

          axios.post(body.response_url, {
            text: '*Here are your last five used reactions*:',
            attachments: [
              {
                text: recents.join(" ")
              }
            ]
          })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  // FREQUENT button
  else if (body.actions[0].value == 'frequent') {
    reacji.reactionsList(body.user.id)
      .then(function (resp) {
        let frequent = reacji.reactionUtility(resp, body.user.id);

          axios.post(body.response_url, {
            text: '*Here are your most frequently used reaction*:',
            attachments: [
              {
                text: frequent
              }
            ]
          })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  // Intentionally left blank to suppress messaging and avoid operation_timeout errors
  res.send("");
})

// Listen for requests
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
