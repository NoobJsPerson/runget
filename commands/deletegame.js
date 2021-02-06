const db = require('quick.db');
const fetch = require('node-fetch');
module.exports = {
  name:'deletegame',
  aliases:['dg'],
  usage:'<website-name|id>',
  description:'delete the game you don\'t want to see its runs from the gamelist',
  async execute(message,args){
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');

      const res = await fetch(`https://www.speedrun.com/api/v1/games/${args[0]}`);
    const json = await res.json();
    if(!json.data) return message.reply('please input a valid game name or id');
   const list = db.get(`${message.guild.id}.game`);
   const nameslist = db.get(`${message.guild.id}.gamenames`);
    if(!list) return message.reply('i can\'t delete a game from a list thats empty');
    if(!list.includes(json.data.id)) return message.reply('i can\'t delete a game thats not in the list')
    list.forEach((x,index)=>{
      if(x == json.data.id){
        list.splice(index,1);
        console.log(json.data.id)
        nameslist.splice(index,1);
        console.log(index)
      }
    })
      db.set(`${message.guild.id}.game`,list);
      db.set(`${message.guild.id}.gamenames`,nameslist);
    
    
    message.channel.send(`the game ${json.data.names.international} got successfully deleted`);
  }
};
