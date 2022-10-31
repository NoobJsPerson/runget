module.exports = {
	async run(guild, Guild) {
		const leavingGuild = await Guild.findOne({
			where: {
				id: guild.id
			}
		});
		if(!leavingGuild) return;
		for (let game of (await leavingGuild.getGames())){
			if((await game.getGuilds()).length === 1) await game.destroy();
		}
		await leavingGuild.destroy();
	}
}