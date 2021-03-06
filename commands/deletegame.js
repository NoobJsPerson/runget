const fetch = require('node-fetch');
const fs = require ('fs');
module.exports = {
  name:'deletegame',
  aliases:['dg'],
  usage:'<website-name|id>',
  description:'delete the game you don\'t want to see its runs from the gamelist',
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
    }
        } 
        const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);
const list = storageObject[message.guild.id]

    if(!list) return message.reply('i can\'t delete a game from a list thats empty');
    if(!list.includes(json.data.id)) return message.reply('i can\'t delete a game thats not in the list')
    storageObject[message.guild.id] = list.filter(x => x.id != json.data.id)
      
await fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));

    
    
    message.channel.send(`the game ${json.data.names.international} got successfully deleted`);
  }
};
