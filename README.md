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
