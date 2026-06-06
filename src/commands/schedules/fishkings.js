const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));

const fishKings = require(path.join(__dirname, '..', '..', 'data', 'fish_kings.json'));

function formatFishKing(entry) {
  const parts = [
    `**Time:** ${entry.time}`,
    `**Location:** ${entry.location}`,
  ];

  if (entry.eidolonWish) {
    parts.push(`**Eidolon Wish:** ${entry.eidolonWish}`);
  }

  return parts.join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fishkings')
    .setDescription('Shows Fish King schedule information.')
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
    const entries = fishKings.days[day] || [];

    const title = selectedDay
      ? `Fish Kings - ${day}`
      : `Current Fish Kings - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${fishKings.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Fish Kings Found',
        value: `No Fish King schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatFishKing(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
