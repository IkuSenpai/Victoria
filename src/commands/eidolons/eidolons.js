const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const eidolonData = require(path.join(__dirname, '..', '..', 'data', 'eidolons.json'));

function formatEidolon(entry) {
  return [
    `**Element:** ${entry.element}`,
    `**Type:** ${entry.type}`,
    `**Source:** ${entry.source}`,
  ].join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eidolons')
    .setDescription('Shows all available Eidolons.'),

  async execute(interaction) {
    const entries = eidolonData.eidolons || [];

    const embed = new EmbedBuilder()
      .setTitle('Available Eidolons')
      .setDescription('List of available Eidolons on the server.')
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Eidolons Found',
        value: 'No Eidolon information has been added yet.',
      });
    } else {
      embed.addFields(
        entries.slice(0, 25).map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatEidolon(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
