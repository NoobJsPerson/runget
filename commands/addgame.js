const getgame = require("../getgame.js"),
	{ SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('addgame')
		.setDescription("adds the game you want to see its runs to the gamelist")
		.addStringOption(option =>
			option.setName('game_name')
				.setDescription('The game you want to add')
				.setRequired(true)),
	async execute(interaction, Guild, Game) {
		if (interaction.guild && !interaction.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only	staff can change game');
		const input = encodeURIComponent(interaction.options.getString('game_name', true));
		const json = await getgame(input, interaction);
		if (!json) return interaction.reply('\u200B');
		const [game,] = await Game.findOrCreate({
			where: {
				id: json.data.id
			},
			defaults: {
				name: json.data.names.international,
				url: json.data.assets['cover-large'].uri
			}
		}),
			channel = interaction.guild?.channels.cache.find(x => x.name == "new-runs") || interaction.user,
			[guild, created] = await Guild.findOrCreate({
				where: {
					id: interaction.guild ? interaction.guild.id : interaction.user.id
				},
				defaults: {
					channel: channel && channel.id || null,
					isUser: !interaction.guild
				}
			}),
			isGameInGuild = !created && await guild.hasGame(game);
		if (isGameInGuild) return interaction.reply('i can\'t add a game thats already in the list');
		await guild.addGame(game);
		interaction.reply(`the game ${json.data.names.international} has been successfully added to the runlist`);
	}
};
