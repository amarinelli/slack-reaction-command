const axios = require('axios');

// Calls Slack API to return a user's reactions list
const reactionsList = (id, count=100) => {
  const resp = axios.get('https://slack.com/api/reactions.list', {
    params: {
      token: process.env.ACCESS_TOKEN,
      user: id,
      count: count
    }
  });
  return resp;
}

const uniqueReactions = (reaction_list) => {
  
  // Initial counter help from https://jsfiddle.net/yjvyjcau/4/
  let count = {};
  reaction_list.forEach(val => count[val] = (count[val] || 0) + 1);
  
  // Does not account for ties. The reaction emoji with the hightest occurrence
  // that was found first is what is returned by this function.
  let key_highest_count = [];
  for (let key in count) {
    if (key_highest_count[0]) {
      if (count[key] > key_highest_count[1]) {
        key_highest_count[0] = key;
        key_highest_count[1] = count[key];
      }
    } else {
      key_highest_count.push(key)
      key_highest_count.push(count[key])
    }
  }
  return key_highest_count[0];
}

const reactionUtility = (resp, id, stop=0) => {
  let reaction_list = [];
  for (let item of resp.data.items) {
    
    // The structure of the items array is different for files vs messages items
    // Need to adjust to find the proper reactions array
    let item_by_type;
    if("message" in item) {
      item_by_type = item.message.reactions;
    } else if ("file" in item) {
      item_by_type = item.file.reactions;
    }
    
    // Iterate over reactions until told to stop
    // Recent will stop after 5 reactions are gathered
    // Frequent will not stop and capture every reaction in the response data
    for (let reaction of item_by_type) {
      if (reaction.users.includes(id)) {
        reaction_list.push(':' + reaction.name + ':');
        
        // Send back the 5 most recent reactions
        if (stop && reaction_list.length == stop) {
          return reaction_list
        }
      }
    }
  }
  
  // Count the instances of each unique reaction  
  return uniqueReactions(reaction_list);
}

module.exports = {reactionsList, reactionUtility};