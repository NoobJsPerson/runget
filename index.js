// initialise .env config. replit users don't need this
require('dotenv').config();
// import required libraries 
const fs = require('fs'),
  {Client, Collection} = require('discord.js'),
  {TOKEN, PREFIX} = process.env,
  Sequelize = require("sequelize"),
  // let sequelise access the database
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
  }),
  // define the client for our discord bot
  client = new Client({
    ws: {
      properties: {
        $browser: 'Discord Android'
      }
    }
  }),
  // define the schemas for our tables
  Guild = sequelize.define("guild",{
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
  Game = sequelize.define("game",{
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    url: Sequelize.STRING
  }, {
    timestamps: false
  }),
  GuildGames = sequelize.define("guildGame",{
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
  // makes the tables if they don't exist, does nothing otherwise.
  Guild.belongsToMany(Game, { through: GuildGames } );
  Game.belongsToMany(Guild, { through: GuildGames });
  sequelize.sync();
  ['cooldowns','events','commands','runs'].forEach(x => client[x] = new Collection());
fs.readdir('./events/', (err, files) => { // We use the method readdir to read what is in the events folder
  if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
  files.forEach(file => {
    const module = require(`./events/${file}`);
    // Try catch block to throw an error if the code in try{} doesn't work
    try {
      client[module.once ? "once" : "on"](file.split('.')[0], (...args) => module.run(...args, Guild, Game, PREFIX, client)); // Run the event using the client
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
},17e5);
server.listen(3000, () => console.log("Server is Ready!"));
*/
// connect to the bot using our token
client.login(TOKEN);