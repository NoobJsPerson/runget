const fs = require('fs');
const prefix = 'a?';
const Discord = require('discord.js');
const express = require('express');
const server = express();
const path = require('path');
server.all('/', (req, res)=>{
    res.send("henlo");
});



const client = new Discord.Client({ws:{properties: {$browser: 'Discord Android'}}});
client.cooldowns = new Discord.Collection();


client.events = new Discord.Collection();


client.commands = new Discord.Collection();


client.editsnipes = new Discord.Collection();
fs.readdir('./events/', (err, files) => { // We use the method readdir to read what is in the events folder
    if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`); // Here we require the event file of the events folder
        if (eventFunction.disabled) return; // Check if the eventFunction is disabled. If yes return without any error

         if(!eventFunction.event)eventFunction.event = file.split('.')[0]; // Get the exact name of the event from the eventFunction variable. If it's not given, the code just uses the name of the file as name of the event
        const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client; // Here we define our emitter. This is in our case the client (the bot)
        const once = eventFunction.once; // A simple variable which returns if the event should run once
client.events.set(eventFunction.event,eventFunction);


        // Try catch block to throw an error if the code in try{} doesn't work
        try {
            emitter[once ? 'once' : 'on'](eventFunction.event, (...args) => client.events.get(eventFunction.event).run(...args,client,queue,prefix)); // Run the event using the above defined emitter (client)
        } catch (error) {
            console.error(error.stack); // If there is an error, console log the error stack message
        }
    });
});

 function walk(dir, collection, callback) {
    fs.readdir(dir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            console.log(`Loading a total of ${files.length} commands.`);
            var filepath = path.join(dir, file);
            fs.stat(filepath, function(err,stats) {
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile() && file.endsWith('.js')) {
                    let props = require(`./${filepath}`);
                    console.log(`Loading Command: ${props.name} ✔`);
                    collection.set(props.name, props);
             
                    
                  
                }
            });
        });
    });
}
 walk(`./commands/`,client.commands);
 





server.listen(3000, () => console.log("Server is Ready!"));
client.login(process.env.TOKEN);
