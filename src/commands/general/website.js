const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const serverInfo = require(path.join(__dirname, '..', '..', 'data', 'server_info.json'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('website')
    .setDescription('Generates the game website link.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Website')
      .setDescription(serverInfo.websiteUrl)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
