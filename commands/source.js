module.exports = {
	name: 'source',
	description: 'sends a link to the github repo where the bot\'s code is from',
	execute(message){
	  message.channel.send({embed:{description:'[GitHub repository](https://github.com/NoobJsPerson/runget)'}});
	}
  };