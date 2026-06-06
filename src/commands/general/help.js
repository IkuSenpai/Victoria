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
          name: 'Schedules',
          value: [
            '`/fishkings` - Shows Fish King schedule information.',
            '`/worldbosses` - Shows World Boss schedule information.',
            '`/guildbosses` - Shows Guild Boss schedule information.',
            '`/cardrangers` - Shows Card Ranger schedule information.',
            '`/quiz` - Shows Aura Kingdom Quiz schedule information.',
            '`/raids` - Shows raid schedule information.',
            '`/resets` - Shows dungeon reset schedule information.',
            '`/battlefields` - Shows Battlefield schedule information.',
            '`/archaeology` - Shows Archaeology site information.',
          ].join('\n'),
        },
        {
          name: 'Server',
          value: [
            '`/paragon` - Shows the currently active Paragon.',
            '`/stats` - Shows stats from Eidolon prayers.',
          ].join('\n'),
        },
        {
          name: 'Eidolons',
          value: [
            '`/eidolonspawns` - Shows Eidolon instance spawn information.',
            '`/eidolons` - Shows all available Eidolons.',
            '`/eidolon` - Shows specific Eidolon information.',
            '`/prayers` - Shows Eidolon prayer information.',
            '`/prayer` - Shows specific Eidolon prayer information.',
          ].join('\n'),
        },
        {
          name: 'Database Commands Coming Later',
          value: [
            '`/online` - Shows online players.',
            '`/guilds` - Shows in-game guilds.',
          ].join('\n'),
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
