const fs = require ('fs');
const fetch = require ('node-fetch');
module.exports = {
  name:'gamelist',
  description:'displays the list of games that its runs will be sent',
  async execute(message){
    const objtype = message.guild?message.guild.id:message.author.id;
    
   function underify(array) {
     if(`•${array.join('\n•')}`.length <= 2048)return [array];
     let total = [], secondarray = [];
   while(`•${array.join('\n•')}`.length > 2048) secondarray.push(array.shift());
     
     if('•'+secondarray.join('\n•').length <= 2048){
       total.push(secondarray);
     } else {
       total.push(...underify(secondarray));
     }
     total.push(array);
     return total;

   }
    const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);
const list = storageObject[objtype];
    
 
    if(!list||!list.length) return message.reply('the gamelist is currently empty add games to it using .addgame');
    const sorted = list.map(x => x.name).sort();
    
   let lists = underify(sorted);
    
    lists.forEach(x=>{
    message.channel.send({embed:{title:`${message.guild?message.guild.name:message.author.username}'s gamelist`,
      color:'RANDOM',
      description: '•'+x.join('\n•')
    }});
    });
  }
};
