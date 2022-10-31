require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, TOKEN } = process.env;
const rest = new REST({ version: '9' }).setToken(TOKEN);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    if(!command.data) continue;
	commands.push(command.data.toJSON());
}
rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);