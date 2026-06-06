const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const prayerData = require(path.join(__dirname, '..', '..', 'data', 'prayers.json'));

function formatPrayer(entry) {
  const stats = (entry.stats || [])
    .map((stat) => `${stat.name} ${stat.value}`)
    .join(', ');

  return `**Stats:** ${stats || 'None added yet.'}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prayers')
    .setDescription('Shows Eidolon prayer information.'),

  async execute(interaction) {
    const entries = prayerData.prayers || [];

    const embed = new EmbedBuilder()
      .setTitle('Eidolon Prayers')
      .setDescription('List of Eidolon prayer stats.')
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Prayers Found',
        value: 'No Eidolon prayer information has been added yet.',
      });
    } else {
      embed.addFields(
        entries.slice(0, 25).map((entry, index) => ({
          name: `${index + 1}. ${entry.eidolon}`,
          value: formatPrayer(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
