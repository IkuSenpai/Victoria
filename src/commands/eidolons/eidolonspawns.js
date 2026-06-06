const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const eidolonSpawns = require(path.join(__dirname, '..', '..', 'data', 'eidolon_spawns.json'));

function getUniqueEidolons() {
  const names = new Set();

  for (const entry of eidolonSpawns.instances || []) {
    for (const eidolon of entry.eidolons || []) {
      names.add(eidolon);
    }
  }

  return [...names].sort();
}

function formatInstance(entry) {
  return [
    `**Instance:** ${entry.instance}`,
    `**Mode:** ${entry.mode}`,
    `**Eidolons:** ${(entry.eidolons || []).join(', ')}`,
  ].join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eidolonspawns')
    .setDescription('Shows Eidolon instance spawn information.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Search for a specific Eidolon.')
        .setRequired(false)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const choices = getUniqueEidolons();

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
    const entries = eidolonSpawns.instances || [];

    const filteredEntries = selectedName
      ? entries.filter((entry) =>
          (entry.eidolons || []).some(
            (eidolon) => eidolon.toLowerCase() === selectedName.toLowerCase()
          )
        )
      : entries;

    const embed = new EmbedBuilder()
      .setTitle(selectedName ? `Eidolon Spawns - ${selectedName}` : 'Eidolon Spawns')
      .setDescription(
        selectedName
          ? `Instances where **${selectedName}** can spawn.`
          : 'Instances with possible Eidolon spawns.'
      )
      .setTimestamp();

    if (filteredEntries.length === 0) {
      embed.addFields({
        name: 'No Eidolon Spawns Found',
        value: selectedName
          ? `No spawn information has been added for ${selectedName} yet.`
          : 'No Eidolon spawn information has been added yet.',
      });
    } else {
      embed.addFields(
        filteredEntries.map((entry, index) => ({
          name: `${index + 1}. ${entry.instance}`,
          value: formatInstance(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
