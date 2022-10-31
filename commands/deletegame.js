const getgame = require('../getgame'),
	{ SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('deletegame')
		.setDescription('delete the game you don\'t want to see its runs from the gamelist')
		.addStringOption(option =>
			option.setName('game_name')
				.setDescription('game name that you wanna delete')
				.setRequired(true)),
	async execute(interaction, Guild, Game) {
		if (interaction.guild && !interaction.member.permissions.has("MANAGE_interactionS")) return interaction.reply('only staff can change game');
		const guild = await Guild.findOne({
			where: {
				id: interaction.guild ? interaction.guild.id : interaction.user.id
			}
		});
		if (!guild) return interaction.reply("i can't delete a game from a gamelist that's empty");
		const input = decodeURIComponent(interaction.options.getString('game_name'));
		const json = await getgame(input, interaction);
		if (!json) return;
		const game = await Game.findOne({
			where: {
				id: json.data.id
			}
		});
		if (!game) return interaction.reply('i can\'t delete a game that never got added');
		const isGameInGuild = guild.hasGame(game);
		if (!isGameInGuild) return interaction.reply('i can\'t delete a game thats not in the list');
		guild.removeGame(game)
		const gameGuilds = await game.getGuilds();
		if (!gameGuilds.length) await game.destroy();
		interaction.reply(`the game ${json.data.names.international} got successfully deleted`);
	}
};
