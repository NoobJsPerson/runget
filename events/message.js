const Discord = require ('discord.js');
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const duration = require('../timeshower.js');
module.exports ={
  name:'message',
  run:(message,client,prefix) => {
 
  
	client.spaceCommands.array().forEach(cmd => {
    if(cmd.guildOnly && !message.guild)  return;
    cmd.execute(message);
  });
	
const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix.toLowerCase())})\\s*`);
	if (!prefixRegex.test(message.content.toLowerCase())) return;

	const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();


	 const cmd = client.commands.get(command) || client.commands.find(x => x.aliases && x.aliases.includes(command))
    if (!cmd) return;
      if (!client.cooldowns.has(cmd.name)) {
	client.cooldowns.set(cmd.name, new Discord.Collection());
}
const now = Date.now();
const timestamps = client.cooldowns.get(cmd.name);
const cooldownAmount = (cmd.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		return message.reply(`please wait ${duration(expirationTime,now)} before reusing the \`${cmd.name}\` command.`).then(msg => msg.delete({timeout:5000}));
	}
}
if(client.commands.get(cmd.name).guildOnly && !message.guild)  return;
      cmd.execute(message, args, client, prefix, queue); 
      timestamps.set(message.author.id, now);

	      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } 
    
	

	    

	};