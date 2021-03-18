const fs = require ('fs');
const fetch = require('node-fetch');
module.exports = {
  name:'addgame',
  aliases:['ag'],
  usage:'<website-name|id>',
  description:'adds the game you want to see its runs to the gamelist',
  async execute(message,args){
    if(message.guild&&!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    const input = args.join('%20')
    const errormsg = "please input a valid name, abbreviation or id";
      const res = await fetch(`https://www.speedrun.com/api/v1/games/${input}`);
    let json = await res.json();
    if(!json.data){
          
      const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${input}`);
    let ajson = await ares.json();
    if(!ajson.data) return message.reply(errormsg);
    if(ajson.data[0]){
      json.data = ajson.data.find(x => x.names.international == argz[1])
      if(!json.data) return message.reply(errormsg);
    } else {
      json = ajson;

     if(!json.data.id) return message.reply(errormsg);
    }
        } 
        const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);
let objtype = message.guild?message.guild.id:message.author.id;

const obj = { id : json.data.id, name : json.data.names.international, url:json.data.assets['cover-large'].uri};
const serverObject = storageObject[objtype];

        if(serverObject && serverObject.find(x => x.id == json.data.id)) return message.reply('i can\'t add a game thats already in the list');

    if (storageObject[objtype] instanceof Array) {
  storageObject[objtype].push(obj);
} else {
  storageObject[objtype] = [ obj ];
}
await fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));
    message.channel.send(`the game ${json.data.names.international} has been successfully added to the runlist`);
  }
};