const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const paragon = require(path.join(__dirname, '..', '..', 'data', 'paragon.json'));

function formatParagon(entry) {
  const parts = [
    `**Starts:** ${entry.starts}`,
    `**Ends:** ${entry.ends}`,
  ];

  if (entry.notes) {
    parts.push(`**Notes:** ${entry.notes}`);
  }

  return parts.join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('paragon')
    .setDescription('Shows the currently active Paragon.'),

  async execute(interaction) {
    const entries = paragon.active || [];

    const embed = new EmbedBuilder()
      .setTitle('Current Paragon')
      .setDescription(`Times shown in: ${paragon.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Active Paragon',
        value: 'No active Paragon has been added yet.',
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatParagon(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
