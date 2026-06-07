const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { dayChoices, getTodayName } = require(path.join(__dirname, '..', '..', 'services', 'dateService'));
const { getNextWeeklyTimestamp, formatDiscordCountdown } = require(path.join(__dirname, '..', '..', 'services', 'timeService'));

const fishKings = require(path.join(__dirname, '..', '..', 'data', 'fish_kings.json'));

const projectRoot = path.join(__dirname, '..', '..', '..');
const fishKingThumbnailDir = path.join(projectRoot, 'assets', 'fish_kings', 'thumbnails');

const ACTIVE_DURATION_MINUTES = 30;

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getScheduleTimeZone() {
  return fishKings.timeZone || fishKings.timezone || 'America/Los_Angeles';
}

function getDisplayTimeZone() {
  return fishKings.timezone || fishKings.timeZone || 'Server time';
}

function getFileNameFromUrl(url) {
  if (!hasText(url)) {
    return null;
  }

  try {
    const parsed = new URL(url);
    return path.basename(parsed.pathname);
  } catch {
    return path.basename(url);
  }
}

function getLocalAssetPath(entry, fileField, urlField, assetDirectory) {
  if (hasText(entry[fileField])) {
    const explicitPath = path.join(projectRoot, 'assets', entry[fileField]);

    if (fs.existsSync(explicitPath)) {
      return explicitPath;
    }
  }

  const fileName = getFileNameFromUrl(entry[urlField]);

  if (!fileName) {
    return null;
  }

  const localPath = path.join(assetDirectory, fileName);

  if (fs.existsSync(localPath)) {
    return localPath;
  }

  return null;
}

function getSafeAttachmentName(prefix, index, filePath) {
  const extension = path.extname(filePath);
  const baseName = path
    .basename(filePath, extension)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 60);

  return `${prefix}-${index}-${baseName}${extension}`;
}

function getGroupingKey(entry) {
  return [
    entry.name || '',
    entry.location || '',
    entry.bait || '',
    entry.eidolonWish || '',
    entry.notes || '',
    entry.thumbnailUrl || '',
    entry.thumbnailFile || '',
  ].join('|');
}

function groupEntries(entries) {
  const groups = new Map();

  for (const entry of entries) {
    const key = getGroupingKey(entry);

    if (!groups.has(key)) {
      groups.set(key, {
        ...entry,
        times: [],
      });
    }

    if (hasText(entry.time)) {
      groups.get(key).times.push(entry.time);
    }
  }

  return [...groups.values()].map((group) => ({
    ...group,
    times: [...new Set(group.times)].sort(),
  }));
}

function getNextSpawnForGroup(day, times) {
  const candidates = times
    .map((time) => ({
      time,
      timestamp: getNextWeeklyTimestamp(day, time, getScheduleTimeZone()),
    }))
    .filter((candidate) => candidate.timestamp);

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => a.timestamp - b.timestamp);
  return candidates[0];
}

function getActiveWindowForGroup(day, times) {
  const now = Math.floor(Date.now() / 1000);
  const weekSeconds = 7 * 24 * 60 * 60;
  const durationSeconds = ACTIVE_DURATION_MINUTES * 60;

  for (const time of times) {
    const nextTimestamp = getNextWeeklyTimestamp(day, time, getScheduleTimeZone());

    if (!nextTimestamp) {
      continue;
    }

    const previousTimestamp = nextTimestamp - weekSeconds;
    const endTimestamp = previousTimestamp + durationSeconds;

    if (now >= previousTimestamp && now <= endTimestamp) {
      return {
        start: previousTimestamp,
        end: endTimestamp,
      };
    }
  }

  return null;
}

function buildEmbedDescription(group, day) {
  const parts = [];

  if (group.times.length > 0) {
    parts.push(`**Times:** ${group.times.join(', ')}`);
  }

  const activeWindow = getActiveWindowForGroup(day, group.times);

  if (activeWindow) {
    parts.push(`**Status:** Active now, ends <t:${activeWindow.end}:R> (<t:${activeWindow.end}:t>)`);
  } else {
    const nextSpawn = getNextSpawnForGroup(day, group.times);
    const countdown = nextSpawn ? formatDiscordCountdown(nextSpawn.timestamp) : null;

    if (countdown) {
      parts.push(`**Next Spawn:** ${countdown}`);
    }
  }

  parts.push(`**Active Duration:** ${ACTIVE_DURATION_MINUTES} minutes`);

  if (hasText(group.location)) {
    parts.push(`**Location:** ${group.location}`);
  }

  if (hasText(group.bait)) {
    parts.push(`**Bait:** ${group.bait}`);
  }

  if (hasText(group.eidolonWish)) {
    parts.push(`**Eidolon Wish:** ${group.eidolonWish}`);
  }

  if (hasText(group.notes)) {
    parts.push(`**Notes:** ${group.notes}`);
  }

  return parts.join('\n');
}

function buildEmbedForGroup(group, day, index, total) {
  const embed = new EmbedBuilder()
    .setTitle(`${group.name} - ${day}`)
    .setDescription(buildEmbedDescription(group, day))
    .setFooter({ text: `Fish King ${index + 1} of ${total} • Times shown in: ${getDisplayTimeZone()}` })
    .setTimestamp();

  let file = null;

  const thumbnailPath = getLocalAssetPath(
    group,
    'thumbnailFile',
    'thumbnailUrl',
    fishKingThumbnailDir
  );

  if (thumbnailPath) {
    const attachmentName = getSafeAttachmentName('thumb', index + 1, thumbnailPath);
    file = new AttachmentBuilder(thumbnailPath, { name: attachmentName });
    embed.setThumbnail(`attachment://${attachmentName}`);
  } else if (hasText(group.thumbnailUrl)) {
    embed.setThumbnail(group.thumbnailUrl);
  }

  return { embed, file };
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
    const groups = groupEntries(entries);

    if (groups.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle(selectedDay ? `Fish Kings - ${day}` : `Current Fish Kings - ${day}`)
        .setDescription(`Times shown in: ${getDisplayTimeZone()}`)
        .addFields({
          name: 'No Fish Kings Found',
          value: `No Fish King schedule has been added for ${day} yet.`,
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const embeds = [];
    const files = [];

    for (const [index, group] of groups.slice(0, 10).entries()) {
      const { embed, file } = buildEmbedForGroup(group, day, index, groups.length);
      embeds.push(embed);

      if (file) {
        files.push(file);
      }
    }

    await interaction.reply({ embeds, files });
  },
};
