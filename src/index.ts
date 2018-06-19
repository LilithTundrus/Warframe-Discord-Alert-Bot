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


// Create an instance of a Discord client
const client = new Discord.Client();
// create a logger instance
const logger = new Logger('../logs', logLevels.error, true);

/* 

Bot intention:


Notes:

Assumptions made:


*/

client.on('ready', () => {
    // This event fires on being connected to the Discord 
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

