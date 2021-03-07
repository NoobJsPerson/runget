const fs = require ('fs');
const fetch = require ('node-fetch');
const sortArray = require('sort-array');
module.exports = {
  name:'gamelist',
  description:'displays the list of games that its runs will be sent',
  async execute(message){
    let total = [];
    const objtype = message.guild?message.guild.id:message.author.id;
    
   function underify(array) {
     
     if(`•${array.join('\n•')}`.length <= 2048)return total.push(array);
     const secondarray = [];
   while(`•${array.join('\n•')}`.length > 2048) secondarray.push(array.shift());
     
     if('•'+secondarray.join('\n•').length <= 2048){
       total.push(secondarray);
     } else {
       underify(secondarray);
     }
     total.push(array);

   }
    const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);
const list = storageObject[objtype];
    
 
    if(!list||!list.length) return message.reply('the gamelist is currently empty add games to it using .addgame');
    const sorted = sortArray(list.map(x => x.name));
    
    underify(sorted);
    
    total.forEach(x=>{
    message.channel.send({embed:{title:`${message.guild?message.guild.name:message.author.username}'s gamelist`,
      color:'RANDOM',
      description: '•'+x.join('\n•')
    }});
    });
  }
};
