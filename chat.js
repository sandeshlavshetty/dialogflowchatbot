'use strict';
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
const functions=require('firebase-functions');
const serviceAccount = {
// enter this from firebase generate service key the last one have no semicolon
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://namingbot-usiv-default-rtdb.firebaseio.com/',
});
const db=admin.database();
//data arrays
let name1 = new Array(100); //array to store names
name1[0] = 'Rahul';
name1[1] = 'Rohit';
name1[2] = 'Raj';
let from = new Array(100);
from[0] = 'Mumbai';
from[1] = 'Delhi';
from[2] = 'Nagpur';
let to = new Array(100);
to[0] = 'Delhi';
to[1] = 'Mumbai';
to[2] = 'Bengaluru';
let phone = new Array(100);
phone[0] = '1234567890';
phone[1] = '0987654321';
phone[2] = '9876543210';
let index=2; //index to store data in array
let phonenum;
let name; //variable to store name
let from1; //variable to store from
let to1; //variable to store to
let k;


exports.dialogflowFirebaseFulfillment = function(request, response) {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function GetName(agent)  //function to save name to an array
  {
    name=agent.parameters.name;
    agent.add("Could you share your phone number ?");
  }
  function phoneno(agent)  
  {
    phonenum=agent.parameters.name;
    agent.add("From where are you travelling  ?");
  }
  function fromplace(agent) 
  {
    from1 = agent.parameters.from;
    agent.add("Where are you travelling to?");
    
  }
  function toplace(agent) {
    to1 = agent.parameters.to;
    let flag=0;
    for (let i = 0; i < 3; i++) {
      if (from[i] == from1 && to[i] == to1) {
        agent.add("User " + name1[i] + "'s travel path is matched. Contact " +name1[i]+ " on this phone number:" + phone[i]);
        agent.add("Do you want to confirm the ride ?");
        ++flag;
      }
    }
      name1[index] = name;
      from[index] = from1;
      to[index] = to1;
    
       admin.database().ref().push({ Name : name, From : from1, To : to1 })
      .then(() => {
        agent.add('Saved the name ${name} to the database.');
      });

       agent.add("Database updated");
      ++index;
    }
  let intentMap = new Map();
  intentMap.set('GetName', GetName);
  intentMap.set('From', fromplace);
  intentMap.set('To',toplace);
  intentMap.set('ph_no',phoneno);
  agent.handleRequest(intentMap);
};