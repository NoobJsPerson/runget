const getgame = require('../getgame');
module.exports = {
	name: 'addgames',
	aliases: ['ags'],
	usage: '<website-name|id>',
	description: 'adds the games (seperated by "|") you want to see their runs to the gamelist',
	async execute(message, args, Guild, Game) {
		if (message.guild && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
		let argz = args.join(' ').split('|');
		argz = argz.map(x => encodeURIComponent(x));
		const channel = message.guild && message.guild.channels.cache.find(x => x.name == "new-runs");
		const [guild, created] = await Guild.findOrCreate({
			where: {
			  id: message.guild ? message.guild.id : message.author.id
			},
			defaults: {
			  channel: channel && channel.id || null,
			  isUser: !message.guild
			}
		});
		let games = [];
		for (let x of argz) {
			x = x.trim();
			let json = await getgame(x, message);
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
				message.reply('i can\'t add a game thats already in the list');
				continue;
			  }
			games.push(game)
			message.channel.send(`the game ${json.data.names.international} has been successfully added to the runlist`);

		}
		await guild.addGames(games);


	}
};
