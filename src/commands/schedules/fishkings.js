const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fishKings = require(path.join(__dirname, '..', '..', 'data', 'fish_kings.json'));

function getTodayName() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(new Date());
}

function formatFishKing(entry) {
  const parts = [
    `**${entry.time}** - ${entry.name}`,
    `Location: ${entry.location}`,
  ];

  if (entry.eidolonWish) {
    parts.push(`Eidolon Wish: ${entry.eidolonWish}`);
  }

  return parts.join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fishkings')
    .setDescription('Shows the current day Fish King schedule.'),

  async execute(interaction) {
    const today = getTodayName();
    const entries = fishKings.days[today] || [];

    const embed = new EmbedBuilder()
      .setTitle(`Fish Kings - ${today}`)
      .setDescription(`Times shown in: ${fishKings.timezone}`)
      .setTimestamp();

    if (entries.length === 0) {
      embed.addFields({
        name: 'No Fish Kings Found',
        value: 'No Fish King schedule has been added for today yet.',
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
