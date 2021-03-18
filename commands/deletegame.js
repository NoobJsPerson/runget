const fetch = require('node-fetch');
const fs = require ('fs');
module.exports = {
  name:'deletegame',
  aliases:['dg'],
  usage:'<website-name|id>',
  description:'delete the game you don\'t want to see its runs from the gamelist',
  async execute(message,args){
    if(message.guild&&!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
        const input = args.join("%20")
      const res = await fetch(`https://www.speedrun.com/api/v1/games/${input}`);
     let json = await res.json();
    if(!json.data){
          
      const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${input}`);
    let ajson = await ares.json();
    if(!ajson.data) return message.reply('please input a valid name, abbreviation or id');
    if(ajson.data[0]){
      json.data = ajson.data.find(x => x.names.international == argz[1])
      if(!json.data) return message.reply('please input a valid name, abbreviation or id');
    } else {
      json = ajson;
    }
        } 
const objtype = message.guild?message.guild.id:message.author.id;
const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);
const list = storageObject[objtype]

    if(!list) return message.reply('i can\'t delete a game from a list thats empty');
    if(!list.find(x => x.id == json.data.id)) return message.reply('i can\'t delete a game thats not in the list')
    storageObject[objtype] = list.filter(x => x.id != json.data.id)
      
await fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));

    
    
    message.channel.send(`the game ${json.data.names.international} got successfully deleted`);
  }
};
