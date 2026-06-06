const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const dungeonResets = require(path.join(__dirname, '..', '..', 'data', 'dungeon_resets.json'));

const dayChoices = [
  { name: 'Sunday', value: 'Sunday' },
  { name: 'Monday', value: 'Monday' },
  { name: 'Tuesday', value: 'Tuesday' },
  { name: 'Wednesday', value: 'Wednesday' },
  { name: 'Thursday', value: 'Thursday' },
  { name: 'Friday', value: 'Friday' },
  { name: 'Saturday', value: 'Saturday' },
];

function getTodayName() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(new Date());
}

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
