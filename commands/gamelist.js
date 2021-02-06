const db = require('quick.db');
const fetch = require ('node-fetch');
module.exports = {
  name:'gamelist',
  description:'displays the list of games that its runs will be sent',
  execute(message){
   
    const list = db.get(`${message.guild.id}.gamenames`);

 
    if(!list||!list.length) return message.reply('the gamelist is currently empty add games to it using .addgame');
    message.channel.send({embed:{title:`${message.guild.name}'s gamelist`,
      color:'RANDOM',
      description: '•'+list.join('\n•')
    }});
  }
};= 
