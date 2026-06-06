const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const archaeology = require(path.join(__dirname, '..', '..', 'data', 'archaeology.json'));

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

function formatArchaeology(entry) {
  const parts = [`**Location:** ${entry.location}`];

  if (entry.eidolonWish) {
    parts.push(`**Eidolon Wish:** ${entry.eidolonWish}`);
  }

  return parts.join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('archaeology')
    .setDescription('Shows Archaeology site information.')
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
    const entries = archaeology.days[day] || [];

    const title = selectedDay
      ? `Archaeology - ${day}`
      : `Current Archaeology - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${archaeology.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Archaeology Sites Found',
        value: `No Archaeology sites have been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatArchaeology(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
