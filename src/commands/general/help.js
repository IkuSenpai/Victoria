const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows Victoria command help.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Victoria Help')
      .setDescription('Here are the currently available Victoria commands.')
      .addFields(
        {
          name: 'General',
          value: [
            '`/help` - Shows this help menu.',
            '`/botinfo` - Shows bot information.',
            '`/contact` - Shows how to contact staff.',
            '`/invite` - Shows the Discord invite link.',
            '`/website` - Shows the website link.',
          ].join('\n'),
        },
        {
          name: 'Coming Soon',
          value: [
            '`/online` - Shows online player count.',
            '`/guilds` - Shows guild information.',
            '`/fishkings` - Shows Fish King schedule.',
            '`/worldbosses` - Shows World Boss schedule.',
            '`/eidolons` - Shows Eidolon information.',
          ].join('\n'),
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
