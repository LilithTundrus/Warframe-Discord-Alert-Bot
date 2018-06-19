import * as Discord from 'discord.js';
import * as request from 'request-promise';
import { alertChannel, warframeWorldsstateURL, guildID, adminID } from './config';

// This is the function that will handle getting the alerts on an interval
export function initScheduler(client: Discord.Client, ) {
    setInterval(() => {
        // request.get(warframeWorldsstateURL)
        request.get('ahfjal')
            .then((results: string) => {
                let discordChannel: any = client.channels.get(alertChannel);
                discordChannel.send(`Warframe manifest is ${results.length} bytes`);
            })
            .catch((err) => {
                // Get the guild to retrive the user for
                let guild = client.guilds.get(guildID);
                // Get the user object by ID
                let admin = guild.members.get(adminID);
                // Message the admin that something went wrong
                let discordChannel: any = client.channels.get(alertChannel);
                discordChannel.send(`Hey ${admin}, something went wrong: ${err}`);
            })
    }, 10000)
}