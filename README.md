# Alexa Lab Manager
This repo contains the files necessary to set up a local copy of an Alexa-based laboratory inventory/management system. The Alexa skill processes voice queries from a user, and can repsond with answers about the quantity of a certain lab material, as well as provide information about the location of such a material. The user's voice queries also can manipulate the values in the inventory, as well as update the state of plates/wells and their contents/labels.

**Files**     
The lambda.js and skillBuilder.json files are used for setup. CSVtoJSON.py is used if you have a CSV file with strings that represents values you would like to store as possible values for a slot. You can run the file on the CSV and it will output a JSON that you can concatenate to the existing JSON to add the slot. You may wish to do this during set up if you have an excel file that contains all the possible reagents or items in your lab.

**Set Up**   
There are a few steps required to get a project like this set up. You must set up the following things:
* Lambda Function (in your traditional AWS developer console)
* Interaction Model (in the Alexa developer dashboard)
* Identity and Access Management (in your tradition AWS developer console)

The above is meant to serve as a reminder for people with experience developing Alexa skills. For details, check the wiki.    

**Usage**   
The following detail all of the actions of the Alexa skill, and what to say to trigger them. The database representing the inventory/plate management/reminder system will be updated accordingly.

* You can say that you have x mL or x L of a certain reagent.
    * "Tell my lab manager, add x {unit} of {reagent} to my inventory"
* You can also say you have x of a certain item. 
    * "Tell my lab manager, add x of {item} to my inventory"
* You can say you have used x mL or x L of a certain reagent. 
    * "Tell my lab manager, I have used x {unit} of {reagent}"
* You can say you have used x of a certain item. 
    * "Tell my lab manager, I have used x {item}"
* You can say you have placed x mL or x L of a certain reagent in plate Y.
    * "Tell my lab manager, I placed x {unit} of {reagent} in {plate/well} {label}"
* You can label plate Y with a color.
    * "Tell my lab manager, label {plate/well} {label} as {color}"

* You can ask how much of a reagent you have.
    * "Ask my lab manager, how much {reagent} do I have"
* You can ask how many of an item you have.
    * "Ask my lab manager, how many {item} do I have"
* You can ask what is in a plate Y.
    * "Ask my lab manager, what is in {plate/well} {label}"
* You can ask what is the color of a plate Y.
    * "Ask my lab manager, what is the label of {plate/well} {label}"
* You can ask what plates are labeled with a certain color.
    * "Ask my lab manager, what plates are labeled {color}"
* You can ask what plates have a certain reagent in them.
    * "Ask my lab manager, what plates have {reagent}"
* You can ask for a text reminder to order more of a reagent/item when you have reached a certain amount.
    * "Ask my lab manager, remind me to order more {reagent} when I have less than x {units}"
    * "Ask my lab manager, remind me to order more {item} when I have less than x"
