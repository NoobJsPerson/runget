const Discord = require("discord.js"),
	{ SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('help')
		.setDescription('a general command that replies with this message')
		.addStringOption(option =>
			option.setName('command_name')
				.setDescription('the command you want to learn about')
				.setRequired(false)),
	execute: async (interaction, _Guild, _Game) => {
		console.log(interaction.options.getString('command_name'))
		if (!interaction.options.getString('command_name')) {
			const cmds = interaction.client.commands.map(x => `• ${x.data.name} ${x.data.options.map(y => y.name) || ''}: ${x.data.description}`).join('\n\n')
			const embed = new Discord.MessageEmbed()
				.setTitle("**Help Page**")
				.setDescription(cmds)
				.setFooter({ text: 'Made by AmineCrafter101#5531' })
				.setTimestamp()
				.setColor("RANDOM");
			await interaction.reply({ embeds: [embed] });
		} else {
			const data = [];
			const { commands } = interaction.client;
			const name = interaction.options.getString('command_name').toLowerCase();
			const command = commands.get(name);
			if (!command) {
				return interaction.reply('that\'s not a valid command!');
			}
			data.push(`**Name:** ${command.data.name}`);
			console.log(command)
			if (command.data.description) data.push(`**Description:** ${command.data.description}`);
			if (command.data.options.length) data.push(`**Usage:** ${command.data.name} ${command.data.options.map(y => y.name)}`);
			interaction.reply(data.join('\n'));

		}
	}
}
