const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));

const quizSchedule = require(path.join(__dirname, '..', '..', 'data', 'quiz.json'));

function formatQuiz(entry) {
  return `**Time:** ${entry.time}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Shows Aura Kingdom Quiz schedule information.')
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
    const entries = quizSchedule.days[day] || [];

    const title = selectedDay
      ? `Aura Kingdom Quiz - ${day}`
      : `Current Aura Kingdom Quiz - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${quizSchedule.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Quiz Found',
        value: `No Aura Kingdom Quiz schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatQuiz(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
