const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));

const cardRangers = require(path.join(__dirname, '..', '..', 'data', 'card_rangers.json'));

function formatCardRanger(entry) {
  return [
    `**Time:** ${entry.time}`,
    `**Location:** ${entry.location}`,
  ].join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cardrangers')
    .setDescription('Shows Card Ranger schedule information.')
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
    const entries = cardRangers.days[day] || [];

    const title = selectedDay
      ? `Card Rangers - ${day}`
      : `Current Card Rangers - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${cardRangers.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Card Rangers Found',
        value: `No Card Ranger schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatCardRanger(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
