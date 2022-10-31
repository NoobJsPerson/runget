const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder().setName('gamelist')
		.setDescription('displays the list of games that its runs will be sent'),
  async execute(interaction, Guild, _Game) {
    function underify(array) {
      if (`•${array.join('\n•')}`.length <= 2048) return [array];
      let total = [], secondarray = [];
      while (`•${array.join('\n•')}`.length > 2048) secondarray.push(array.shift());

      if ('•' + secondarray.join('\n•').length <= 2048) {
        total.push(secondarray);
      } else {
        total.push(...underify(secondarray));
      }
      total.push(array);
      return total;

    }
    const guild = await Guild.findOne({
      where: {
        id: interaction.guild ? interaction.guild.id : interaction.user.id
      }
    });
    if(!guild) return interaction.reply(`the gamelist is currently empty add games to it using /addgame`);
    const list = await guild.getGames();
    if (!list.length) return interaction.reply(`the gamelist is currently empty add games to it using /addgame`);
    const sorted = list.map(x => x.name).sort(),
      lists = underify(sorted);

    lists.forEach(x => {
      interaction.channel.send({
        embeds: [{
          title: `${interaction.guild ? interaction.guild.name : interaction.author.username}'s gamelist`,
          color: 'RANDOM',
          description: '•' + x.join('\n•')
        }]
      });
    });
	await interaction.reply('\u200B');
  }
};
