'use strict';
// NPM package requires
import * as Discord from 'discord.js';
import Logger from 'colorful-log-levels';
import { logLevels } from 'colorful-log-levels/enums';

// Get the bot's config variables (As opposed to ENV variables)
import {
    ver, prod, debug,
    botToken, prefix,
    adminID, inviteURL
} from './config';

// Embed templates
import { createRichError } from './coomon/createRichError';
import { createRichEmbed } from './coomon/createRichEmbed';

// Bot compontents
import { initScheduler } from './scheduler';


// Create an instance of a Discord client
const client = new Discord.Client();
// create a logger instance
const logger = new Logger('../logs', logLevels.error, true);

/* 

Bot intention:


Notes:

Assumptions made:


*/
// Log the bot in
client.login(botToken);

client.on('ready', () => {
    // This event fires on being connected to the Discord 

    // On READY, we should set a scheduler to check for alerts
    initScheduler(client)

    logger.info(`Connected to Discord.\nLogged in as ${client.user.username} (${client.user.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildCreate', guild => {
    // This event triggers when the bot joins a guild.
    logger.info(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
    // TODO: send a message to a channel parse from the guild info about the bot and what it can do
});

client.on('guildDelete', guild => {
    // This event triggers when the bot is removed from a guild.
    logger.info(`Bot removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// This event will run on every single message received, from any channel or DM.
client.on('message', async message => {
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    if (message.author.bot) return;
    // Also good practice to ignore any message that does not start with the bot'ss prefix, 
    if (message.content.indexOf(prefix) !== 0) return;

    // Here we separate our 'command' name, and our 'arguments' for the command. 
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'help':
        // Send a help messages through commands/help
        case 'ping':
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m: any = await message.channel.send('Ping?');
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
            break;
        default:
            // If command character + unknown command is given we at least need to let the user know
            let errorEmbed = createRichError(`Uknown command: **${command}**`);
            return message.channel.send(errorEmbed);
    }
});

// Catch any general errors from the bot and at least log them, as well as sending a message
client.on('error', async error => {
    logger.error(error);
    client.user.sendMessage(JSON.stringify(error.message, null, 2), {
        reply: adminID
    });
});