const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('source')
		.setDescription('sends a link to the github repo where the bot\'s code is from'),
	execute(interaction){
	  interaction.reply({embeds: [{description:'[GitHub repository](https://github.com/NoobJsPerson/runget/tree/sqlite-rewrite)'}]});
	}
  };