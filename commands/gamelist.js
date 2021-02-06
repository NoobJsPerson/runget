
const db = require('quick.db');
const fetch = require ('node-fetch');
const sortArray = require('sort-array');
module.exports = {
  name:'gamelist',
  description:'displays the list of games that its runs will be sent',
  execute(message){
    let total = [];
    
   function underify(array) {
     
     if(`•${array.join('\n•')}`.length <= 2048)return total.push(array);
     const secondarray = [];
     array.forEach(() => {
   if(`•${array.join('\n•')}`.length > 2048) secondarray.push(array.shift());
     });
     if('•'+secondarray.join('\n•').length <= 2048){
       total.push(secondarray);
     } else {
       underify(secondarray);
     }
     total.push(array);

   }
    const list = db.get(`${message.guild.id}.gamenames`);
    
 
    if(!list||!list.length) return message.reply('the gamelist is currently empty add games to it using .addgame');
    const sorted = sortArray(list);
    
    underify(sorted);
    console.log(total)
    
    total.forEach(x=>{
    message.channel.send({embed:{title:`${message.guild.name}'s gamelist`,
      color:'RANDOM',
      description: '•'+x.join('\n•')
    }});
    });
  }
};