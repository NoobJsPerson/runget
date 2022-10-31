const { Collection, MessageEmbed } = require('discord.js'),
	attempt = require('../attempt.js'),
	{ Op } = require("sequelize");
module.exports = {
	name: 'ready',
	once: true,
	async run(client, Guild, Game) {
		console.log('bot ready!');
		client.user.setActivity('SpeedrunsLive', { type: 'PLAYING' });
		let er = new Collection();
		setInterval(async () => {
			console.log("cycle started!")
			const runs = await fetch('https://www.speedrun.com/api/v1/runs?status=verified&orderby=verify-date&direction=desc&max=200').catch(console.error);
			if (!runs) return;
			const runsjson = await runs.json().catch();
			const runsdata = runsjson.data;
			//fetching newly verified runs
			runsdata.forEach(run => client.runs.set(run.id, run))
			//adding runs to client.runs collection
			client.runs = client.runs.filter(x => runsdata.find(z => x.id == z.id));
			// deleting old unnecessary runs from client.runs
			let newruns = client.runs.filter(x => !er.has(x.id));
			// let the newruns be the runs that existing runs collection doesn't have
			const gameIds = newruns.map(x => x.game);
			if (!gameIds.length) return;
			const games = await Game.findAll({
				where: {
					id: {
						[Op.in]: gameIds
					}
				}
			});
			newruns = newruns.filter(x => games.find(y => y.id == x.game));
			// remove all the new runs that belong to a game thats not in the database
			if (newruns.first()) {
				newruns.forEach(async newrun => {
					console.log("new run found")
					let level = '',
						lvlid, top = 'N/A',
						game, cover, user = '';
					const gameObj = games.find(x => x.id == newrun.game);
					game = gameObj.name;
					cover = gameObj.url;
					console.log(__line);
					for (let player of newrun.players) {
						const userres = await fetch(`https://speedrun.com/api/v1/users/${player.id}`).catch(console.error);
						if (!userres) continue;
						const userjson = await userres.json();
						const i = newrun.players.findIndex(x => x.id == player.id)
						user += (user ? i == newruns.players?.length - 1 ? ' and ' : ', ' : '') + userjson.data.names.international

					}
					// fetching user data
					const categoryres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}`).catch(console.error);
					if (!categoryres) return;
					const categoryjson = await categoryres.json();
					const category = categoryjson.data.name;
					// fetching category data
					const variablesres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}/variables`).catch(console.error);
					if (!variablesres) return;
					const variablesjson = await variablesres.json();
					const runVariables = Object.entries(newrun.values);
					let subcategoryName = '',
						subcategoryQuery = '';
					runVariables.forEach(v => {
						const foundVariable = variablesjson.data.find(c => c.id === v[0]);
						if (foundVariable['is-subcategory'] === true) {
							subcategoryName += !subcategoryName ? foundVariable.values.values[v[1]].label : ', ' + foundVariable.values.values[v[1]].label;
							subcategoryQuery += !subcategoryQuery ? '?var-' + v[0] + '=' + v[1] : '&var-' + v[0] + '=' + v[1];

						}
					});
					// fetching subcategory data if found
					if (newrun.level) {
						const lvlres = await fetch(`https://speedrun.com/api/v1/levels/${newrun.level}`).catch(console.error);
						if (!lvlres) return;
						const lvljson = await lvlres.json();
						level = lvljson.data.name
						lvlid = lvljson.data.id
						// fetching level data if found
					}
					const leaderres = await fetch(`https://speedrun.com/api/v1/leaderboards/${newrun.game}/${level ? `level/${lvlid}` : 'category'}/${categoryjson.data.id}${subcategoryQuery}`).catch(console.error);
					if (!leaderres) return;
					const leadertext = await leaderres.text();
					const leaderjson = await attempt(JSON.parse, leadertext);
					const topobj = leaderjson?.data.runs.find(rundata => rundata.run.id == newrun.id);
					if (topobj) top = topobj.place;
					// fetching place in leaderboards
					const embed = new MessageEmbed()
						.setTitle(`${game}:${level} ${category} ${subcategoryName}`)
						.setColor('RANDOM')
						.setDescription(`**${newrun.times.primary.replace('PT', '').replace('H', ' hours ').replace('M', ' minutes ').replace('S', ' seconds')} by ${user}**`)
						.setURL(newrun.weblink)
						.addFields({
							name: 'Verified at:',
							value: '`' + newrun.status['verify-date'].replace('T', ' ').replace('Z', '') + '`',
							inline: true
						},
							{
								name: 'Place in leaderboards',
								value: `${top}`,
								inline: true
							})
						.setThumbnail(cover);
					// constructing the run embed
					const guilds = await Guild.findAll({
						include: {
							model: Game,
							where: {
								id: newrun.game
							}
						},
						where: {
							[Op.or]: [{
								channel: {
									[Op.not]: null
								}
							}, {
								isUser: true
							}]
						}
					});
					if (!guilds.length) return
					for (let guild of guilds) {
						if (guild.isUser) client.users.cache.get(guild.id)?.send({ embeds: [embed] });
						else client.channels.cache.get(guild.channel)?.send({ embeds: [embed] })
					}

				})
			}
			client.runs.forEach(run => er.set(run.id, run));
			//setting new runs to existing to not get detected as new next time

			er = er.filter(x => client.runs.has(x.id));
			// deleting unnecessary old runs
		}, 75000);
		// using setInterval to repeat the process every four minute
	}
}
