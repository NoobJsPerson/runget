const getgame = require('../getgame'),
	{ SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('deletegames')
		.setDescription('deletes the games (seperated by "|") you don\'t want to see their runs to the gamelist')
		.addStringOption(option =>
			option.setName('game_names')
				.setDescription('games name that you wanna delete (seperated by "|")')
				.setRequired(true)),
	async execute(interaction, Guild, Game) {
		await interaction.deferReply();
		if (interaction.guild && !interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.editReply('only staff can change game');
		let argz = interaction.options.getString('game_names').split('|').map(encodeURIComponent),
			games = [];
		const guild = await Guild.findOne({
			where: {
				id: interaction.guild ? interaction.guild.id : interaction.user.id
			}
		});
		if (!guild) return interaction.channel.send("i can't delete a game from a gamelist that's empty");

		for (let x of argz) {
			x = x.trim();
			const json = await getgame(x, interaction);
			if (!json) continue;
			const game = await Game.findOne({
				where: {
					id: json.data.id
				}
			});

			if (!game) {
				interaction.channel.send('i can\'t delete a game that never got added');
				continue;
			}
			const isGameInGuild = guild.hasGame(game);
			if (!isGameInGuild) {
				interaction.channel.send('i can\'t delete a game thats not in the list');
				continue;
			}
			const gameGuilds = await game.getGuilds();
			if (gameGuilds.length === 1) await game.destroy();
			else games.push(game)
			interaction.channel.send(`the game ${json.data.names.international} got successfully deleted`);
		}
		if (games.length) await guild.removeGames(games);
		await interaction.editReply('Done!')
	}
};
