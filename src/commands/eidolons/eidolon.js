const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const eidolonData = require(path.join(__dirname, '..', '..', 'data', 'eidolons.json'));

function getEidolonNames() {
  return (eidolonData.eidolons || [])
    .map((entry) => entry.name)
    .sort();
}

function formatEidolon(entry) {
  const parts = [
    `**Element:** ${entry.element}`,
    `**Type:** ${entry.type}`,
    `**Source:** ${entry.source}`,
  ];

  if (entry.description) {
    parts.push(`**Description:** ${entry.description}`);
  }

  return parts.join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eidolon')
    .setDescription('Shows specific Eidolon information.')
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

    const entry = (eidolonData.eidolons || []).find(
      (eidolon) => eidolon.name.toLowerCase() === selectedName.toLowerCase()
    );

    const embed = new EmbedBuilder()
      .setTitle(entry ? `Eidolon - ${entry.name}` : 'Eidolon Not Found')
      .setTimestamp();

    if (!entry) {
      embed.setDescription(`No Eidolon information has been added for **${selectedName}** yet.`);
    } else {
      embed.setDescription(formatEidolon(entry));
    }

    await interaction.reply({ embeds: [embed] });
  },
};
