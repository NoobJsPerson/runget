const fs = require("fs");
module.exports ={
  name:"setchannel",
  async execute(message, args, Guild){
    if(!message.guild) return message.reply("there's no channels in dms idiot");
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
    const channel = (message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel).id;
    const [guild, created] = await Guild.findOrCreate({
        where: {
          id: message.guild ? message.guild.id : message.author.id
        },
        defaults: {
          channel,
          isUser: false
        }
    });
	if(!created) {
		guild.channel = channel;
		await guild.save();
	}
	message.channel.send(`Successfully set channel to ${channel}`);
  }
};