const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const serverInfo = require(path.join(__dirname, '..', '..', 'data', 'server_info.json'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('contact')
    .setDescription('Shows how to contact the server team.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Contact')
      .setDescription(serverInfo.contactMessage)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
