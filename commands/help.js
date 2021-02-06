const Discord = require("discord.js");

module.exports = {
  name: "help",

  
  description: "a general command that opens this message",
  category: 'info',

  aliases: ['h'],

  execute: async (message, args, client, prefix) => {

    if (!args.length) {
      const cmds = client.commands.map(x => `• ${x.name} ${x.usage?`\`${x.usage}\``:''}: ${x.description}`).join('\n\n')

      


      const Embed = new Discord.MessageEmbed()

        .setTitle("**Help Page**")

        .setDescription(cmds)
        
        .setFooter('Made by AmineCrafter101#5531')
        
        .setTimestamp()

        .setColor("RANDOM");

      await message.channel.send(Embed);
    } else {
      const data = [];
      const { commands } = client;

      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) {
        return message.reply('that\'s not a valid command!');
      }

      data.push(`**Name:** ${command.name}`);

      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
      if (command.category) data.push(`**Category:** ${command.category}`);
      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

      message.channel.send(data, { split: true });

    }
  }
}
