const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('setchannel')
		.setDescription('sets the channel where runs should be sent (in case theres no channel called #new-runs)')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('the channel you want the bot to send runs in')),
	async execute(interaction, Guild) {
		if (!interaction.guild) return interaction.reply("there's no channels in dms idiot");
		if (!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply('only staff can change game');
		const channel = (interaction.options.getChannel('channel') || interaction.channel).id
		const [guild, created] = await Guild.findOrCreate({
			where: {
				id: interaction.guild ? interaction.guild.id : interaction.user.id
			},
			defaults: {
				channel,
				isUser: false
			}
		});
		if (!created) {
			guild.channel = channel;
			await guild.save();
		}
		interaction.reply(`Successfully set channel to <#${channel}>`);
	}
};