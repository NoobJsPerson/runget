const fs = require('fs'),
  Discord = require('discord.js'),
  path = require('path'),
  {TOKEN, PREFIX} = require('config.json'),
  client = new Discord.Client({
    ws: {
      properties: {
        $browser: 'Discord Android'
      }
    }
  });
client.cooldowns = new Discord.Collection();
client.events = new Discord.Collection();
client.commands = new Discord.Collection();
fs.readdir('./events/', (err, files) => { // We use the method readdir to read what is in the events folder
  if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
  files.forEach(file => {
    const module = require(`./events/${file}`),
      { emitter } = module;
    // Try catch block to throw an error if the code in try{} doesn't work
    try {
      ((emitter instanceof String ? client[emitter] : emitter) || client)[module.once ? "once" : "on"](file.split('.')[0], (...args) => module.run(...args, client, PREFIX)); // Run the event using the above defined emitter (or client)
    } catch (error) {
      console.error(error.stack); // If there is an error, console log the error stack message
    }
  });
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
/*
  const https = require('https');
  require("express")().all('/', (req, res) => {
    res.json({ working: true });
  });
 	setInterval(function() {
  https.get("https://projectname.username.repl.co", (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      console.log("Ping the website and it responsed: " + JSON.parse(data).working);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
},17e5);
server.listen(3000, () => console.log("Server is Ready!"));
*/
client.login(TOKEN);