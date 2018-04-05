// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h2>Hi there</h2> <p>This is an integration that lists your reactions ✌️</p>');
});

app.post('/reactions', (req, res) => {
  const token = req.body.token;
  
  //intentionally left blank to suppress messaging and avoid operation_timeout errors
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

function recentReactions (resp, id) {
  let recent_reactions = [];
  for (var i=0; i<resp.data.items.length;i++) {
    for (var j=0; j<resp.data.items[i].message.reactions.length; j++) {
      if (resp.data.items[i].message.reactions[j].users.includes(id)) {
        recent_reactions.push(':' + resp.data.items[i].message.reactions[j].name + ':');
        if (recent_reactions.length == 5) {
          return recent_reactions 
        }
      }
    }
  }
  return recent_reactions
}

app.post('/interactive', (req, res) => {
  const body = JSON.parse(req.body.payload);
  
  if (body.actions[0].value == 'recent') {
    axios.get('https://slack.com/api/reactions.list', {
       params: {
         token: process.env.ACCESS_TOKEN,
         user: body.user.id
       }
    })
    .then(function (resp) {
      let recents = recentReactions(resp, body.user.id);
      console.log(recents);
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
  } else {
    
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
