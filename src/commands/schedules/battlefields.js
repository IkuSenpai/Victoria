const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const battlefields = require(path.join(__dirname, '..', '..', 'data', 'battlefields.json'));

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

function formatBattlefield(entry) {
  return `**Time:** ${entry.time}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('battlefields')
    .setDescription('Shows Battlefield schedule information.')
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
    const entries = battlefields.days[day] || [];

    const title = selectedDay
      ? `Battlefields - ${day}`
      : `Current Battlefields - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${battlefields.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Battlefields Found',
        value: `No Battlefield schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatBattlefield(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
