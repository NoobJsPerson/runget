const fs = require ('fs');
module.exports = {
	async run(guild){
	const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);


        if(!storageObject[guild.id]) return;

delete storageObject[guild.id];

await fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));
	}
}