const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('contact')
    .setDescription('Shows how to contact the server team.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Contact')
      .setDescription('Please use the Ticket System for support or staff contact. The ticket system has not been added yet.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
