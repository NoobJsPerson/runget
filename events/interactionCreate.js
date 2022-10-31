module.exports = {
	name: 'interactionCreate',
    async run(interaction, Guild, Game){
	if (!interaction.isCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction, Guild, Game);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).catch();
	}
}
}
