module.exports = {
	async run(guild, Guild) {
		const leavingGuild = await Guild.findOne({
			where: {
				id: guild.id
			}
		});
		if(leavingGuild) await leavingGuild.destroy();
	}
}