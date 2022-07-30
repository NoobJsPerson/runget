module.exports = {
	name: 'invite',
	description: 'sends the invite link of the bot',
	execute(message){
	  message.channel.send({embed:{description:'[Invite](https://discord.com/api/oauth2/authorize?client_id=754827405813743676&permissions=52224&scope=bot)'}});
	}
  };