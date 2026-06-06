const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function formatUptime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Shows information about Victoria.'),

  async execute(interaction) {
    const client = interaction.client;
    const serverCount = client.guilds.cache.size || (interaction.guild ? 1 : 0);
    const serverName = interaction.guild ? interaction.guild.name : 'Direct Message / Unknown';

    const embed = new EmbedBuilder()
      .setTitle('Victoria Bot Information')
      .setDescription('Victoria is the Aura Kingdom server assistant bot.')
      .addFields(
        {
          name: 'Bot',
          value: client.user ? `${client.user.tag}` : 'Unknown',
          inline: true,
        },
        {
          name: 'Ping',
          value: `${Math.round(client.ws.ping)}ms`,
          inline: true,
        },
        {
          name: 'Uptime',
          value: formatUptime(process.uptime()),
          inline: true,
        },
        {
          name: 'Current Server',
          value: serverName,
          inline: true,
        },
        {
          name: 'Known Servers',
          value: `${serverCount}`,
          inline: true,
        },
        {
          name: 'Runtime',
          value: `Node.js ${process.version}`,
          inline: true,
        },
        {
          name: 'Library',
          value: 'discord.js v14',
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
