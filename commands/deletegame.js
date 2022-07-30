const fetch = require('node-fetch');
const fs = require('fs');
module.exports = {
  name: 'deletegame',
  aliases: ['dg'],
  usage: '<website-name|id>',
  description: 'delete the game you don\'t want to see its runs from the gamelist',
  async execute(message, args, Guild, Game) {
    if (message.guild && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    const [guild,] = await Guild.findOrCreate({
      where: {
        id: message.guild ? message.guild.id : message.author.id
      },
      defaults: {
        channel: message.guild && message.guild.channels.cache.find(x => x.name == "new-runs")?.id || null,
        isUser: !message.guild
      }
    });
    const input = args.join("%20")
    const res = await fetch(`https://www.speedrun.com/api/v1/games/${input}`);
    let json = await res.json();
    if (!json.data) {
      const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${input}`);
      let ajson = await ares.json();
      if (!ajson.data) return message.reply('please input a valid name, abbreviation or id');
      if (ajson.data[0]) {
        json.data = ajson.data.find(x => x.names.international == args.join(" "))
        if (!json.data) return message.reply('please input a valid name, abbreviation or id');
      } else {
        json = ajson;
      }
    }
    const game = await Game.findOne({
      where: {
        id: json.data.id
      }
    });
    if(!game) return message.reply('i can\'t delete a game that never got added');
    const isGameInGuild = guild.hasGame(game);
    if (!isGameInGuild) return message.reply('i can\'t delete a game thats not in the list');
    guild.removeGame(game)
    const gameGuilds = await game.getGuilds();
    if(!gameGuilds.length) await game.destroy();
    message.channel.send(`the game ${json.data.names.international} got successfully deleted`);
  }
};
