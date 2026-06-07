# Victoria

Victoria is a Discord bot for the Aura Kingdom server.

## Current Status

Victoria currently supports static/server-managed information through Discord slash commands.

Database-related commands are intentionally being saved for last.

## Requirements

- Node.js 20 or newer
- npm
- Discord bot application
- Discord server with bot and applications.commands scopes

## Setup

Install dependencies:

npm install

Create a local environment file:

Copy-Item ".env.example" ".env"

Fill in DISCORD_TOKEN, DISCORD_CLIENT_ID, and DISCORD_GUILD_ID.

Do not commit .env.

## Commands

General: /help, /botinfo, /contact, /invite, /website

Schedules: /fishkings, /worldbosses, /guildbosses, /cardrangers, /quiz, /raids, /resets, /battlefields, /archaeology

Server: /paragon, /stats

Eidolons: /eidolonspawns, /eidolons, /eidolon, /prayers, /prayer

## Planned Database Commands

- /online
- /guilds

## Register Slash Commands

npm run deploy

## Start the Bot

npm run start

## Development

npm run dev

## Data Files

Static data is stored in src/data.

## Deployment Notes

Victoria is intended to run on Debian 13 or newer with Node.js 20 or newer.

## Validate Data Files

Run this before committing changes to JSON data files:

npm run validate-data

This checks every JSON file in src/data and fails if one has broken JSON formatting.

## Documentation

- docs/data-format.md - Explains the static JSON data structure.
- docs/debian-deploy.md - Notes for deploying Victoria on Debian.
- deploy/victoria.service.example - Example systemd service file.

## Fish Kings

The `/fishkings` command has been upgraded from placeholder data to real Fish King schedule data.

Current Fish Kings support:

- Real schedule data from `src/data/fish_kings.json`
- Optional `day` argument
- Grouped spawn times per Fish King
- Next spawn countdown using Discord timestamps
- 30-minute active duration display
- Local thumbnail assets from `assets/fish_kings/thumbnails`
- Local image assets stored in `assets/fish_kings/images` for future detailed views
- Blank-safe fields for bait, Eidolon Wishes, notes, images, and thumbnails

Examples:

/fishkings
/fishkings day:Monday

Large Fish King images are intentionally not shown in the daily schedule list because they make the command too large. Daily schedule embeds use thumbnails only.

## Planned Commands

- `/fishking name:<fish>` - Shows a specific Fish King with full details, large image, bait, Eidolon Wish, location, notes, and spawn times.
- `/online` - Shows online players from the game database.
- `/guilds` - Shows in-game guilds from the game database.
