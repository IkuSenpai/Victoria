require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token) {
  console.error('Missing DISCORD_TOKEN in .env');
  process.exit(1);
}

if (!clientId) {
  console.error('Missing DISCORD_CLIENT_ID in .env');
  process.exit(1);
}

if (!guildId) {
  console.error('Missing DISCORD_GUILD_ID in .env');
  process.exit(1);
}

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[WARNING] ${filePath} is missing "data" or "execute".`);
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application command(s).`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application command(s).`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
