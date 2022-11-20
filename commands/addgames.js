const getgame = require('../getgame'),
	{ SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('addgames')
		.setDescription('adds the games (seperated by "|") you want to see their runs to the gamelist')
		.addStringOption(option =>
			option.setName('game_names')
				.setDescription('game names that you wanna add (seperated by "|")')
				.setRequired(true)),
	async execute(interaction, Guild, Game) {
		await interaction.deferReply()
		if (interaction.guild && !interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.editReply('only staff can change game');
		let argz = interaction.options.getString('game_names', true).split('|').map(encodeURIComponent);
		const channel = interaction.guild?.channels.cache.find(x => x.name == "new-runs") || interaction.user;
		const [guild, created] = await Guild.findOrCreate({
			where: {
				id: interaction.guild ? interaction.guild.id : interaction.user.id
			},
			defaults: {
				channel: channel && channel.id || null,
				isUser: !interaction.guild
			}
		});
		let games = [];
		for (let x of argz) {
			x = x.trim();
			let json = await getgame(x, interaction);
			if (!json) continue;
			const [game,] = await Game.findOrCreate({
				where: {
					id: json.data.id
				},
				defaults: {
					name: json.data.names.international,
					url: json.data.assets['cover-large'].uri
				}
			}),
				isGameInGuild = !created && await guild.hasGame(game);
			if (isGameInGuild) {
				interaction.channel.send('i can\'t add a game thats already in the list');
				continue;
			}
			games.push(game)
			interaction.channel.send(`the game ${json.data.names.international} has been successfully added to the runlist`);

		}
		await guild.addGames(games);
		await interaction.editReply('Done!')


	}
};
