const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
  name: 'deletegames',
  aliases: ['ags'],
  usage: '<website-name|id>',
  description: 'deletes the games (seperated by "|") you don\'t want to see their runs to the gamelist',
  async execute(message, args, Guild, Game) {
    if (message.guild && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    let argz = args.join(' ').split('|'),
      games = [];
    argz = argz.map(x => encodeURIComponent(x));
    const guild = await Guild.findOne({
      where: {
        id: message.guild ? message.guild.id : message.author.id
      }
    });
    if(!guild) return message.reply("i can't delete a game from a gamelist that's empty");

    for (let x of argz) {
      x = x.trim();
      const errormsg = `are you sure https://www.speedrun.com/${x} exists\n||if it didn't work try deleting unnecessary spaces||`;
      const res = await fetch(`https://www.speedrun.com/api/v1/games/${x}`);
      let json = await res.json();
      if (!json.data) {

        const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${x}`);
        let ajson = await ares.json();
        if (!ajson.data) {
          message.reply(errormsg)
          continue;
        }
        if (ajson.data[0]) {
          json.data = ajson.data.find(y => y.names.international == x.replace('%20', ' '));
          if (!json.data) {
            message.reply(errormsg);
            continue;
          }
        } else {
          json = ajson;
        }
      }
      const game = await Game.findOne({
        where: {
          id: json.data.id
        }
      });

      if (!game) {
        message.reply('i can\'t delete a game that never got added');
        continue;
      }
      const isGameInGuild = guild.hasGame(game);
      if (!isGameInGuild) {
        message.reply('i can\'t delete a game thats not in the list');
        continue;
      }
      const gameGuilds = await game.getGuilds();
      if(gameGuilds.length === 1) await game.destroy();
      else games.push(game)
      message.channel.send(`the game ${json.data.names.international} got successfully deleted`);
    }
    if(games.length) await guild.removeGames(games);
  }
};
