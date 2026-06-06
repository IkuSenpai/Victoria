const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('website')
    .setDescription('Generates the game website link.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Website')
      .setDescription('Website link coming soon.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
