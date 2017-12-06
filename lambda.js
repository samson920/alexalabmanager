"use strict";
var Alexa = require("alexa-sdk");

var handlers = {
  "HelloIntent": function () {
    this.response.speak("Hello, Professor. What would you like to do?").listen("What did you want to do?"); 
    this.emit(':responseReady');
  },
    "ClearIntent": function() {
      this.attributes.items = {};
      this.attributes.reagents = {};
      this.attributes.plates = {};
      this.attributes.reminders = {}
      this.response.speak("I have cleared your lab inventory.");
      this.emit(':responseReady');
  },
  "IHaveIntent": function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes.items = {};
            this.attributes.reagents = {};
            this.attributes.plates = {};
            this.attributes.reminders = {}
        }
      var amount = parseFloat(this.event.request.intent.slots.quantity.value);
      var units = this.event.request.intent.slots.units.value;
      var reagent = this.event.request.intent.slots.reagent.value;
      //check to see if user has material, if so, add, if not, create and add
      if(!(reagent in this.attributes.reagents)) {
          if (units.toUpperCase() === "LITERS" || units.toUpperCase() === "LITER" || units.toUpperCase() === "LITRE" || units.toUpperCase() === "LITRES") {
            this.attributes.reagents[reagent] = amount*1000;
          }
          else {
            this.attributes.reagents[reagent] = amount;
          }
      }
      else {
          if (units.toUpperCase() === "LITERS" || units.toUpperCase() === "LITER") {
              this.attributes.reagents[reagent] += amount*1000;
          }
          this.attributes.reagents[reagent] += amount;
      }
      this.response.speak("I have added " + amount + " " + units + " of " + reagent + " to your inventory. You have " + this.attributes.reagents[reagent] + "mL total. ");
      this.emit(':responseReady');
  },
    "IHaveUsedIntent": function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes.items = {};
            this.attributes.reagents = {};
            this.attributes.plates = {};
            this.attributes.reminders = {}
        }
        var out = false;
      var amount = parseFloat(this.event.request.intent.slots.quantity.value);
      var units = this.event.request.intent.slots.units.value;
      var reagent = this.event.request.intent.slots.reagent.value;
      var response = "";
      //check to see if user has material, if so, substract, if not, give an error
      if(reagent in this.attributes.reagents) {
          if (units.toUpperCase() === "LITERS") {
              if(this.attributes.reagents[reagent] < amount*1000) {
                  response = "You don't have enough!";
              }
              else {
                  this.attributes.reagents[reagent] -= amount*1000;
                  response = "You have used " + amount + units + " of " + reagent;
                  if(this.attributes.reminders[reagent] && this.attributes.reminders[reagent] >= this.attributes.reagents[reagent]) {
                   out = true;
                  }
              }
          }
          else {
            if(this.attributes.reagents[reagent] < amount) {
                  response = "You don't have enough!";
              }
              else {
                  this.attributes.reagents[reagent] -= amount;
                  response = "You have used " + amount + units + " of " + reagent;
                  if(this.attributes.reminders[reagent] && this.attributes.reminders[reagent] >= this.attributes.reagents[reagent]) {
                   out = true;
                  }
              }
          }
      }
      else {
          response = "You don't have any " + reagent;
      }
      if(out) {
       var params = {
                  PhoneNumber: '+19258224948',
                  Message: 'You are low on ' + reagent + '.'
                 };
       sendTxtMessage(params, reagent, myResult=>{
                   var say = myResult;
                   response = response + myResult;
                   this.response.speak(response);
                   this.emit(':responseReady');
       });
      }
      else {
         this.response.speak(response);
         this.emit(':responseReady');
      }
  },
  "IHavePlacedIntent": function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes.items = {};
            this.attributes.reagents = {};
            this.attributes.plates = {};
            this.attributes.reminders = {}
        }
      var amount = parseFloat(this.event.request.intent.slots.quantity.value);
      var units = this.event.request.intent.slots.units.value;
      var reagent = this.event.request.intent.slots.reagent.value;
      var label = "";
      var out = false;
      if(this.event.request.intent.slots.letter.value) {
          label = this.event.request.intent.slots.letter.value + this.event.request.intent.slots.plate.value;
      }
      if(this.event.request.intent.slots.plate.value) {
          label += this.event.request.intent.slots.plate.value;
      }
      var response = "";
      //check to see if user has material, if so, substract, if not, give an error
      if(reagent in this.attributes.reagents) {
          if (units.toUpperCase() === "LITERS" || units.toUpperCase() === "LITER") {
              if(this.attributes.reagents[reagent] < amount*1000) {
                  response = "You don't have enough!";
              }
              else {
                  this.attributes.reagents[reagent] -= amount*1000;
                  response = "You have added " + amount + units + " of " + reagent + " to plate " + label + ". ";
                  if(this.attributes.reminders[reagent] && this.attributes.reminders[reagent] >= this.attributes.reagents[reagent]) {
                     out = true;
                  }
              }
          }
          else {
            if(this.attributes.reagents[reagent] < amount) {
                  response = "You don't have enough!";
              }
              else {
                  this.attributes.reagents[reagent] -= amount;
                  if(this.attributes.reminders[reagent] && this.attributes.reminders[reagent] >= this.attributes.reagents[reagent]) {
                     out = true;
                  }
                  response = "You have added " + amount + units + " of " + reagent + " to plate " + label + ". ";
              }
          }
      }
      else {
          response = "You don't have any " + reagent;
      }
      //stores in mL
      if(!this.attributes.plates[label]) {
          this.attributes.plates[label] = {"contents":[{"reagent": reagent, "amount": amount}]};
      }
      else {
          this.attributes.plates[label].contents.push({"reagent": reagent, "amount": amount});
      }
     if(out) {
       var params = {
                  PhoneNumber: '+19258224948',
                  Message: 'You are low on ' + reagent + '.'
                 };
       sendTxtMessage(params, reagent, myResult=>{
                   var say = myResult;
                   response = response + myResult;
                   this.response.speak(response);
                   this.emit(':responseReady');
       });
      }
      else {
         this.response.speak(response);
         this.emit(':responseReady');
      }
  },
  "IHaveSuppliesIntent": function() {
      if(Object.keys(this.attributes).length === 0) {
            this.attributes.items = {};
            this.attributes.reagents = {};
            this.attributes.plates = {};
            this.attributes.reminders = {}
        }
      var amount = parseFloat(this.event.request.intent.slots.quantity.value);
      var item = this.event.request.intent.slots.item.value;
      if(!(item in this.attributes.items)) {
          this.attributes.items[item] = amount;
      }
      else {
          this.attributes.items[item] += amount; 
      }
     this.response.speak("I have added " + amount + " of " + item + " to your inventory. You have " + this.attributes.items[item] + " total.");
     this.emit(':responseReady');
  },
    "IHaveUsedSuppliesIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }
      var amount = parseFloat(this.event.request.intent.slots.quantity.value);
      var item = this.event.request.intent.slots.items.value;
      var response = "";
      var out = false;
      if(!(item in this.attributes.items)) {
          response = "You don't have any " + item;
      }
      else {
          if(this.attributes.items[item] < amount) {
              response = "You don't have enough " + item + "s";
          }
          else {
              this.attributes.items[item] -= amount;
              response = "You have used " + amount + " of " + item + ". You have " + this.attributes.items[item] + " remaining. ";
               if(this.attributes.reminders[item] && this.attributes.reminders[item] >= this.attributes.items[item]) {
                out = true;
               }
          }
      }
      if(out) {
       var params = {
                  PhoneNumber: '+19258224948',
                  Message: 'You are low on ' + item + '.'
                 };
       sendTxtMessage(params, item, myResult=>{
                   var say = myResult;
                   response = response + myResult;
                   this.response.speak(response);
                   this.emit(':responseReady');
       });
      }
      else {
         this.response.speak(response);
         this.emit(':responseReady');
      }
  },
  "HowManyIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }
    let item = this.event.request.intent.slots.item.value;
    let quantity = this.attributes.items[item]
    if(!quantity) {
        quantity = "no";
    }
    this.response.speak("You have " + quantity + item + " in your inventory.");
    this.emit(':responseReady');
  },
    "HowMuchIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }
    let reagent = this.event.request.intent.slots.reagent.value;
    let quantity = this.attributes.reagents[reagent]
    if(!quantity) {
      quantity = "no";
    }
    this.response.speak("You have " + quantity + " mL of " + reagent + " in your inventory.");
    this.emit(':responseReady');
  },
  "LabelIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }
    var label = "";
    var response = "";
    if(this.event.request.intent.slots.letter.value) {
      label = this.event.request.intent.slots.letter.value;
    }
    if(this.event.request.intent.slots.plate.value) {
        label += this.event.request.intent.slots.plate.value;
    }
    var nickname = this.event.request.intent.slots.nickname.value;
    if(!this.attributes.plates[label]) {
        response = "Plate " + label + " does not exist.";
    }
    else {
        this.attributes.plates[label].name = nickname;
        response = "I have labeled plate " + label + " as " + nickname;
    }
    this.response.speak(response);
    this.emit(':responseReady');
  },
    "DetailsIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }
    var label = "";
    var response;
    if(this.event.request.intent.slots.letter.value) {
       label = this.event.request.intent.slots.letter.value;
    }
    if(this.event.request.intent.slots.number.value) {
        label += this.event.request.intent.slots.number.value;
    }
    if(!this.attributes.plates[label]) {
        response = "Plate " + label + " does not exist.";
    }
    else {
        response = "Here are the details on plate " + label;
        if(this.attributes.plates[label].name) {
            response += ". It is labeled " + this.attributes.plates[label].name;
        }
        for(let i = 0; i < this.attributes.plates[label].contents.length; i++) {
            let curr = this.attributes.plates[label].contents[i];
            response += ". It contains " + curr['amount'] + " milliliters of " + curr['reagent'];
        }
    }
    this.response.speak(response);
    this.emit(':responseReady');
  },
  "WhatPlatesAreIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }   
    var color = this.event.request.intent.slots.label.value;
    var response = "";
    for(let plate in this.attributes.plates) {
        if(this.attributes.plates.hasOwnProperty(plate)) {
            if(this.attributes.plates[plate].name === color) {
                response += "Plate " + plate + ". ";
            }
        }
    }
    if(response === "") {
        response = "There are no plates with the label " + color;
    }
    else {
        response = "The following plates are labeled " + color + ". " + response;
    }
    this.response.speak(response);
    this.emit(':responseReady');
  },
  "LabelOfIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }
    var label = "";
    var response;
    if(this.event.request.intent.slots.letter.value) {
       label = this.event.request.intent.slots.letter.value;
    }
    if(this.event.request.intent.slots.number.value) {
        label += this.event.request.intent.slots.number.value;
    }
    if(this.attributes.plates[label].name) {
        response = "The label of plate " + label + " is " + this.attributes.plates[label].name;
    }
    else if(this.attributes.plates[label]) {
        response = "Plate " + label + " does not have a label."
    }
    else {
        response = "Plate " + label + " does not exist.";
    }
    this.response.speak(response);
    this.emit(':responseReady');
  },
    "WhatPlatesHaveIntent": function() {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }   
    var reagent = this.event.request.intent.slots.reagent.value.toUpperCase();
    var response = "";
    for(let plate in this.attributes.plates) {
        if(this.attributes.plates.hasOwnProperty(plate)) {
            for(let i = 0; i < this.attributes.plates[plate].contents.length; i++) {
                if(this.attributes.plates[plate].contents[i].reagent.toUpperCase() === reagent) {
                    response += "Plate " + plate + ". ";
                    break;
                }
            }
        }
    }
    if(response === "") {
        response = "There are no plates that contain " + reagent;
    }
    else {
        response = "The following plates contain " + reagent + ". " + response;
    }
    this.response.speak(response);
    this.emit(':responseReady');
   },
   "GiveMeABreakIntent": function() {
     this.response.speak("I'm sorry, Samson. I cannot do that.");
     this.emit(':responseReady');
   },
   "RemindMeIntent": function() {
    let response = "";
    let number = parseFloat(this.event.request.intent.slots.number.value)
    if(this.event.request.intent.slots.reagent.value) {
     var name = this.event.request.intent.slots.reagent.value;
     var units = this.event.request.intent.slots.units.value;
     if(units.toUpperCase() === "LITERS") {
      number = number*1000;
     }
    }
    else {
     var name = this.event.request.intent.slots.item.value;
     var units = "";
    }
    if(!(this.attributes.items[name] || this.attributes.reagents[name])) {
     response = "You don't have any " + name + "!";
    }
    else {
     response = "Ok, I will remind you to order more " + name + " when you have less than " + number + " " + units;
     this.attributes.reminders[name] = number
    }
    this.response.speak(response);
    this.emit(':responseReady');
   },
   "IAmLowIntent": function() {  
    
    let params = {
     PhoneNumber: '+19258224948',
     Message: 'You are low.'
    };
    sendTxtMessage(params, "test", myResult=>{
        var say = myResult;
        this.response.speak(say);
        this.emit(':responseReady');
    });

    },
  "LaunchRequest": function () {
    if(Object.keys(this.attributes).length === 0) {
        this.attributes.items = {};
        this.attributes.reagents = {};
        this.attributes.plates = {};
        this.attributes.reminders = {}
    }
    this.response.speak("Hey bioengineers, welcome to your lab!"); 
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.emit(':saveState', true);
  }
};

function sendTxtMessage(params, item, callback) {
    var AWS = require('aws-sdk');  
    AWS.config.region = 'us-east-1';
    var SNS = new AWS.SNS();

    SNS.publish(params, function(err, data){

        if (err) console.log(err, err.stack);

        callback('You are low on ' + item + ', I have texted you a reminder to order more.');

    });
}

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'LabInventory';
    alexa.registerHandlers(handlers);
    alexa.execute();
};