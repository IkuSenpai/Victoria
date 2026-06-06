const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const prayerData = require(path.join(__dirname, '..', '..', 'data', 'prayers.json'));

function getEidolonNames() {
  return (prayerData.prayers || [])
    .map((entry) => entry.eidolon)
    .sort();
}

function formatPrayer(entry) {
  const stats = (entry.stats || [])
    .map((stat) => `**${stat.name}:** ${stat.value}`)
    .join('\n');

  const requirements = (entry.requirements || [])
    .map((requirement) => `- ${requirement}`)
    .join('\n');

  return [
    stats || '**Stats:** None added yet.',
    '',
    '**Requirements:**',
    requirements || 'None added yet.',
  ].join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prayer')
    .setDescription('Shows specific Eidolon prayer information.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Choose an Eidolon.')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const choices = getEidolonNames();

    const filtered = choices
      .filter((name) => name.toLowerCase().includes(focusedValue))
      .slice(0, 25);

    await interaction.respond(
      filtered.map((name) => ({
        name,
        value: name,
      }))
    );
  },

  async execute(interaction) {
    const selectedName = interaction.options.getString('name');

    const entry = (prayerData.prayers || []).find(
      (prayer) => prayer.eidolon.toLowerCase() === selectedName.toLowerCase()
    );

    const embed = new EmbedBuilder()
      .setTitle(entry ? `Prayer - ${entry.eidolon}` : 'Prayer Not Found')
      .setTimestamp();

    if (!entry) {
      embed.setDescription(`No prayer information has been added for **${selectedName}** yet.`);
    } else {
      embed.setDescription(formatPrayer(entry));
    }

    await interaction.reply({ embeds: [embed] });
  },
};
