const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const serverInfo = require(path.join(__dirname, '..', '..', 'data', 'server_info.json'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Generates the Discord server invite link.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Discord Invite')
      .setDescription(`Join the ${serverInfo.serverName} Discord server here:\n${serverInfo.inviteUrl}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
