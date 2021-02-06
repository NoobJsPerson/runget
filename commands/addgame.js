const db = require('quick.db');
const fetch = require('node-fetch');
module.exports = {
  name:'addgame',
  aliases:['ag'],
  usage:'<website-name|id>',
  description:'adds the game you want to see its runs to the gamelist',
  async execute(message,args){
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    
      const res = await fetch(`https://www.speedrun.com/api/v1/games/${args[0]}`);
    const json = await res.json();
    if(!json.data) return message.reply('please input a valid game name or id');
    db.push(`${message.guild.id}.game`,json.data.id);
    db.push(`${message.guild.id}.gamenames`,json.data.names.international);
    message.channel.send(`the game ${json.data.names.international} has been successfully added to the runlist`);
  }
};
