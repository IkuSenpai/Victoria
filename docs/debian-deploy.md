# Debian Deployment Notes

These notes are for deploying Victoria on a Debian server later.

Database commands are intentionally saved for last.

## Planned Server Path

/opt/victoria

## Basic Deployment Flow

1. Install Node.js 20 or newer.
2. Create a victoria Linux user.
3. Clone the repository into /opt/victoria.
4. Copy .env.example to .env.
5. Fill in Discord secrets inside .env.
6. Install dependencies.
7. Run project checks.
8. Register slash commands.
9. Start Victoria with systemd.

## Commands

Install production dependencies:

npm ci --omit=dev

Run checks:

npm run check

Register slash commands:

npm run deploy

Start manually for testing:

npm run start

## systemd

Use deploy/victoria.service.example as the starting service file.

The expected production location is:

/etc/systemd/system/victoria.service

After editing the service file:

sudo systemctl daemon-reload
sudo systemctl enable victoria
sudo systemctl start victoria
sudo systemctl status victoria

## Logs

View logs with:

journalctl -u victoria -f

## Environment File

The .env file must stay on the server only.

Never commit .env.

Required Discord values:

- DISCORD_TOKEN
- DISCORD_CLIENT_ID
- DISCORD_GUILD_ID

Database values are planned for later.
