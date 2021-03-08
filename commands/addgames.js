const fs = require ('fs');
const fetch = require('node-fetch');
module.exports = {
  name:'addgames',
  aliases:['ags'],
  usage:'<website-name|id>',
  description:'adds the games you want to see their runs to the gamelist',
  async execute(message,args){
    if(message.guild&&!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    let argz = args.join(' ').split('|');
    argz = argz.map(x => x.replace(' ','%20'))
    const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);
const objtype = message.guild?message.guild.id:message.author.id
const serverObject = storageObject[objtype];

    for(const x of argz){
    const errormsg = `are you sure https://www.speedrun.com/${x} exists
||if the name has spaces put it in ""||`;
      const res = await fetch(`https://www.speedrun.com/api/v1/games/${x}`);
    let json = await res.json();
    if(!json.data){
          
      const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${x}`);
    let ajson = await ares.json();
    if(!ajson.data) return message.reply(errormsg);
    if(ajson.data[0]){
      json.data = ajson.data.find(y => y.names.international == x.replace('%20',' '))
      if(!json.data) return message.reply(errormsg);
    } else {
      json = ajson;
      console.log(json.data);

     if(!json.data.id) return message.reply(errormsg);
    }
        } 
        const obj = { id : json.data.id, name : json.data.names.international };

        if(serverObject && serverObject.find(x => x.id == json.data.id)) return message.reply('i can\'t add a game thats already in the list')

    if (storageObject[objtype] instanceof Array) {
  storageObject[objtype].push(obj);
} else {
  storageObject[objtype] = [ obj ];
}
    message.channel.send(`the game ${json.data.names.international} has been successfully added to the runlist`);
    
    };
    await fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));

   }
};
