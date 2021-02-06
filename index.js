const fs = require('fs');
const db = require('quick.db');
const prefix = '.';
const Discord = require('discord.js');
const express = require('express');
const server = express();
const path = require('path');
server.all('/', (req, res)=>{
    res.send(`hello`);
});



const client = new Discord.Client({ws:{properties: {$browser: 'Discord Android'}}});
const cooldowns = new Discord.Collection();

client.runs = new Discord.Collection();

client.commands = new Discord.Collection();


fs.readdir('./events/', (err, files) => { // We use the method readdir to read what is in the events folder
    if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`); // Here we require the event file of the events folder
        if (eventFunction.disabled) return; // Check if the eventFunction is disabled. If yes return without any error

        const event = eventFunction.event || file.split('.')[0]; // Get the exact name of the event from the eventFunction variable. If it's not given, the code just uses the name of the file as name of the event
        const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client; // Here we define our emitter. This is in our case the client (the bot)
        const once = eventFunction.once; // A simple variable which returns if the event should run once

        // Try catch block to throw an error if the code in try{} doesn't work
        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args,client,prefix)); // Run the event using the above defined emitter (client)
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
 walk(`./spaceCommands`,client.spaceCommands);

client.on('message', message => {
  
  
  
	
	if(message.content == '<@777944775448985683>'){
	  message.channel.send(`my prefix is \`${prefix}\`\nType \`${prefix}help\` for a list with all my commands\nType \`a?help [commandname]\` for info about that command`);
	}
	if(!message.content.toLowerCase().startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	
	
	 client.commands.array().forEach(cmds);

	function cmds(str) {
	  if(command == str.name || str.aliases && str.aliases.includes(command)){
if (!cooldowns.has(str.name)) {
	cooldowns.set(str.name, new Discord.Collection());
}
const now = Date.now();
const timestamps = cooldowns.get(str.name);
const cooldownAmount = (str.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${str.name}\` command.`).then(msg => msg.delete({timeout:5000}));
	}
}
	    client.commands.get(str.name).execute(message, args, client, prefix);
	    timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	  }
	}
	  
	});




server.listen(3000, ()=>{console.log("Server is Ready!")});
client.login(process.env.TOKEN);
