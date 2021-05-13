const fs = require("fs");
module.exports ={
  name:"setchannel",
  async execute(message,args){
    if(!message.guild) return message.reply("there's no channels in dms idot");
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    const channel = (message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel).id;
    const {id} = message.guild;
    const content = await fs.promises.readFile('./storage.json');
		const storageObject = JSON.parse(content);
		const firstel = storageObject[id][0];
		if(firstel && firstel.channel) storageObject[id][0].channel = channel.id;
		else storageObject[objtype].unshift({channel});
		await fs.promises.writeFile(
			'./storage.json',
			JSON.stringify(storageObject)
		);
		message.channel.send(`Successfully set channel to ${channel}`);
  }
};