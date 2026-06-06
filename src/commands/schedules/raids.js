const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));

const raids = require(path.join(__dirname, '..', '..', 'data', 'raids.json'));

function formatRaid(entry) {
  return [
    `**Time:** ${entry.time}`,
    `**Type:** ${entry.type}`,
  ].join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raids')
    .setDescription('Shows raid schedule information.')
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
    const entries = raids.days[day] || [];

    const title = selectedDay
      ? `Raids - ${day}`
      : `Current Raids - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${raids.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Raids Found',
        value: `No raid schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatRaid(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
