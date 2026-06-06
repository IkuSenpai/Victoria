const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));

const dungeonResets = require(path.join(__dirname, '..', '..', 'data', 'dungeon_resets.json'));

function formatDungeonReset(entry) {
  return [
    `**Time:** ${entry.time}`,
    `**Version:** ${entry.version}`,
  ].join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resets')
    .setDescription('Shows dungeon reset schedule information.')
    .addStringOption((option) =>
      option
        .setName('day')
        .setDescription('Choose a specific day.')
        .setRequired(false)
        .addChoices(...dayChoices)
    ),

  async execute(interaction) {
    const selectedDay = interaction.options.getString('day');
    const day = selectedDay || getTodayName();
    const entries = dungeonResets.days[day] || [];

    const title = selectedDay
      ? `Dungeon Resets - ${day}`
      : `Current Dungeon Resets - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${dungeonResets.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Dungeon Resets Found',
        value: `No dungeon reset schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatDungeonReset(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
