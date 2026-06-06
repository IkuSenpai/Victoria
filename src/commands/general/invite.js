const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Generates the Discord server invite link.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Discord Invite')
      .setDescription('Join the Aura Kingdom Discord server here:\nhttps://discord.gg/X9cKApK8HT')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
