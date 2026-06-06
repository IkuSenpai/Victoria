const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const prayerData = require(path.join(__dirname, '..', '..', 'data', 'prayers.json'));

function buildStatSummary() {
  const summary = new Map();

  for (const prayer of prayerData.prayers || []) {
    for (const stat of prayer.stats || []) {
      if (!summary.has(stat.name)) {
        summary.set(stat.name, []);
      }

      summary.get(stat.name).push(`${prayer.eidolon}: ${stat.value}`);
    }
  }

  return summary;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows stats from Eidolon prayers.'),

  async execute(interaction) {
    const summary = buildStatSummary();

    const embed = new EmbedBuilder()
      .setTitle('Prayer Stats')
      .setDescription('Stats currently available from Eidolon prayers.')
      .setTimestamp();

    if (summary.size === 0) {
      embed.addFields({
        name: 'No Stats Found',
        value: 'No prayer stats have been added yet.',
      });
    } else {
      embed.addFields(
        [...summary.entries()].slice(0, 25).map(([statName, values]) => ({
          name: statName,
          value: values.join('\n'),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
