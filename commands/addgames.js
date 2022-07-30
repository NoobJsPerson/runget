const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
	name: 'addgames',
	aliases: ['ags'],
	usage: '<website-name|id>',
	description: 'adds the games (seperated by "|") you want to see their runs to the gamelist',
	async execute(message, args, Guild, Game) {
		if (message.guild && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('only staff can change game');
		let argz = args.join(' ').split('|');
		argz = argz.map(x => x.replace(' ', '%20'));
		const [guild,] = await Guild.findOrCreate({
			where: {
			  id: message.guild ? message.guild.id : message.author.id
			},
			defaults: {
			  channel: message.guild && message.guild.channels.cache.find(x => x.name == "new-runs")?.id || null,
			  isUser: !message.guild
			}
		});
		let games = [];
		for (let x of argz) {
			x = x.trim();
			const errormsg = `are you sure https://www.speedrun.com/${x} exists\n||if it didn't work try deleting unnecessary spaces||`;
			const res = await fetch(`https://www.speedrun.com/api/v1/games/${x}`);
			let json = await res.json();
			if (!json.data) {
				const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${x}`);
				let ajson = await ares.json();
				if (!ajson.data) {
					message.reply(errormsg);
					continue;
				}
				if (ajson.data[0]) {
					json.data = ajson.data.find(y => y.names.international == x.replace('%20', ' '))
					if (!json.data) {
						message.reply(errormsg);
						continue;
					}
				} else {
					json = ajson;
					if (!json.data.id) {
						message.reply(errormsg);
						continue;
					}
				}
			}
			const [game,] = await Game.findOrCreate({
				where: {
				  id: json.data.id
				},
				defaults: {
				  name: json.data.names.international,
				  url: json.data.assets['cover-large'].uri
				}
			  }),
			  isGameInGuild = await guild?.hasGame(game);
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
