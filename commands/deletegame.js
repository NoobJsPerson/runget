const fetch = require('node-fetch'),
  handlePromise = require('../handlePromise.js'),
module.exports = {
  name: 'deletegame',
  aliases: ['dg'],
  usage: '<website-name|id>',
  description: 'delete the game you don\'t want to see its runs from the gamelist',
  async execute(message, args, Guild, Game) {
    if (message.guild && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    const guild = await Guild.findOne({
      where: {
        id: message.guild ? message.guild.id : message.author.id
      }
    });
    if(!guild) return message.reply("i can't delete a game from a gamelist that's empty");
    const input = decodeURIComponent(args.join(" "));
    const [res] = await handlePromise(fetch(`https://www.speedrun.com/api/v1/games/${input}`));
    if(!res) return;
    let [json] = await handlePromise(res.json());
    if(!json) return;
    if (!json.data) {
      const [ares] = await handlePromise(fetch(`https://www.speedrun.com/api/v1/games?name=${input}`));
      if(!ares) return;
      let [ajson] = await handlePromise(ares.json());
      if(!ajson) return;
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
