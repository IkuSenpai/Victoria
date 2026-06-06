const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));

const worldBosses = require(path.join(__dirname, '..', '..', 'data', 'world_bosses.json'));

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
