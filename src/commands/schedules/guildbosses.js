const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));

const guildBosses = require(path.join(__dirname, '..', '..', 'data', 'guild_bosses.json'));

function formatGuildBoss(entry) {
  return `**Time:** ${entry.time}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guildbosses')
    .setDescription('Shows Guild Boss schedule information.')
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
    const entries = guildBosses.days[day] || [];

    const title = selectedDay
      ? `Guild Bosses - ${day}`
      : `Current Guild Bosses - ${day}`;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`Times shown in: ${guildBosses.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Guild Bosses Found',
        value: `No Guild Boss schedule has been added for ${day} yet.`,
      });
    } else {
      embed.addFields(
        entries.map((entry, index) => ({
          name: `${index + 1}. ${entry.name}`,
          value: formatGuildBoss(entry),
        }))
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
