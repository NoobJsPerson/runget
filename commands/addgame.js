const db = require('quick.db');
const fetch = require('node-fetch');
module.exports = {
  name:'addgame',
  aliases:['ag'],
  usage:'<website-name|id>',
  description:'adds the game you want to see its runs to the gamelist',
  async execute(message,args){
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    const argz = args.join(' ').split('"');
    if(argz[2]) args[0] = argz[0].replace(' ','%20');
      const res = await fetch(`https://www.speedrun.com/api/v1/games/${args[0]}`);
    let json = await res.json();
    if(!json.data){
          
      const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${args[0]}`);
    let ajson = await ares.json();
    if(!ajson.data) return message.reply('please input a valid name, website name or id ||if the name has spaces put it in ""||');
    if(ajson.data[0]){
      json.data = ajson.data.find(x => x.names.international == argz[1])
      if(!json.data) return message.reply('please input a valid name, website name or id ||if the name has spaces put it in ""||');
    } else {
      json = ajson;
      console.log(json.data);

     if(!json.data.id) return message.reply('please input a valid name, website name or id ||if the name has spaces put it in ""||');
    }
        } 
        if(db.get(`${message.guild.id}.game`) && db.get(`${message.guild.id}.game`).includes(json.data.id)) return message.reply('i can\'t add a game thats already in the list')

    db.push(`${message.guild.id}.game`,json.data.id);
    db.push(`${message.guild.id}.gamenames`,json.data.names.international);
    message.channel.send(`the game ${json.data.names.international} has been successfully added to the runlist`);
  }
};