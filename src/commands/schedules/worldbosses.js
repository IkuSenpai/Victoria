const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const worldBosses = require(path.join(__dirname, '..', '..', 'data', 'world_bosses.json'));

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

function formatWorldBoss(entry) {
  return [
    `**Time:** ${entry.time}`,
    `**Location:** ${entry.location}`,
  ].join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('worldbosses')
    .setDescription('Shows World Boss schedule information.')
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
    const entries = worldBosses.days[day] || [];

    const title = selectedDay
      ? `World Bosses - ${day}`
      : `Current World Bosses - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${worldBosses.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No World Bosses Found',
        value: `No World Boss schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatWorldBoss(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
