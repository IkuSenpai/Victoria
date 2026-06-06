# Data Format Guide

Static bot data lives in src/data.

Run this after editing JSON files:

npm run validate-data

## Schedule Files

These files use the same basic day-based format:

- fish_kings.json
- world_bosses.json
- guild_bosses.json
- card_rangers.json
- quiz.json
- raids.json
- dungeon_resets.json
- battlefields.json
- archaeology.json

Each schedule file should have:

- timezone
- days
- Sunday through Saturday

Example:

{
  "timezone": "Server local time",
  "days": {
    "Monday": [
      {
        "time": "12:00",
        "name": "Example Name"
      }
    ]
  }
}

## Eidolon Files

eidolons.json stores general Eidolon information.

eidolon_spawns.json stores instance spawn locations.

prayers.json stores Eidolon prayer stats and requirements.

## Server Info

server_info.json controls simple public server messages:

- serverName
- inviteUrl
- websiteUrl
- contactMessage

## Planned Database Files

No database files are required yet.

Database commands are being saved for last:

- /online
- /guilds
