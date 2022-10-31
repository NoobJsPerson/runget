const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('invite')
		.setDescription('sends the invite link of the bot'),
	execute(interaction) {
		interaction.reply({ embeds: [{ description: `[Invite](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.id}&permissions=52224&scope=bot)` }] });
	}
};