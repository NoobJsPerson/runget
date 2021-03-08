const fs = require ('fs');
const fetch = require('node-fetch');
module.exports = {
  name:'deletegames',
  aliases:['ags'],
  usage:'<website-name|id>',
  description:'deletes the games you don\'t want to see their runs to the gamelist',
  async execute(message,args){
    if(message.guild&&!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    let argz = args.join(' ').split('|');
    argz = argz.map(x => x.replace(' ','%20'));
    const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);
const objtype = message.guild?message.guild.id:message.author.id

    for(const x of argz){
    const errormsg = `are you sure https://www.speedrun.com/${x} exists
||if it didn't work try deleting unnecessary spaces||`;
      const res = await fetch(`https://www.speedrun.com/api/v1/games/${x}`);
     let json = await res.json();
    if(!json.data){
          
      const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${x}`);
    let ajson = await ares.json();
    if(!ajson.data){
message.reply(errormsg)
continue;
}
    if(ajson.data[0]){
      json.data = ajson.data.find(y => y.names.international == x.replace('%20',' '));
      if(!json.data){
message.reply(errormsg);
continue;
}
    } else {
      json = ajson;
    }
        } 
const list = storageObject[objtype];

    if(!list){
message.reply('i can\'t delete a game from a list thats empty');
continue;
}
    if(!list.find(y => y.id == json.data.id)){
message.reply('i can\'t delete a game thats not in the list');
continue;
}
    storageObject[objtype] = list.filter(y => y.id != json.data.id)
   
 message.channel.send(`the game ${json.data.names.international} got successfully deleted`);
    }
    await fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));

   }
};
