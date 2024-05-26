// initialise .env config. replit users don't need this
require('dotenv').config();
// import required libraries 
const fs = require('fs'),
  fetch = require("node-fetch"),
  { Client, Collection, Intents } = require('discord.js'),
  { TOKEN } = process.env,
  Sequelize = require("sequelize"),
  // let sequelise access the database
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
  }),
  // define the client for our discord bot
  client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES]
  }),
  // define the schemas for our tables
  Guild = sequelize.define("guild", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    channel: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isUser: Sequelize.BOOLEAN
  }, {
    timestamps: false
  }),
  Game = sequelize.define("game", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    url: Sequelize.STRING
  }, {
    timestamps: false
  }),
  GuildGames = sequelize.define("guildGame", {
    gameId: {
      type: Sequelize.STRING,
      references: {
        model: Game,
        key: 'id'
      }
    },
    guildId: {
      type: Sequelize.STRING,
      references: {
        model: Guild,
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });
// I don't know if this a best practice but I'm going to use it to make the fetch function available globally
global.fetch = fetch;
// define the relationships between the tables
Guild.belongsToMany(Game, { through: GuildGames });
Game.belongsToMany(Guild, { through: GuildGames });
// makes the tables if they don't exist, does nothing otherwise.
sequelize.sync();
// setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));
['cooldowns', 'events', 'commands', 'runs'].forEach(x => client[x] = new Collection());
fs.readdir('./events/', (err, files) => { // We use the method readdir to read what is in the events folder
  if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
  files.forEach(file => {
    const module = require(`./events/${file}`);
    // Try catch block to throw an error if the code in try{} doesn't work
    try {
      client[module.once ? "once" : "on"](file.split('.')[0], (...args) => {
        try {
          module.run(...args, Guild, Game); // Run the event using the client
        } catch (error) {
          console.error(error.stack); // handle error from within the run method itself
        }
      })
    } catch (error) {
      console.error(error.stack); // If there is an error, console log the error stack message
    }
  });
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if(!command.data) continue;
  client.commands.set(command.data.name, command);
}
// for replit users, uncomment this!
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
},16e5);
server.listen(3000, () => console.log("Server is Ready!"));
*/
// connect to the bot using our token
client.login(TOKEN);
