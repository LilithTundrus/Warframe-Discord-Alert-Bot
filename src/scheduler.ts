import * as Discord from 'discord.js';
import * as request from 'request-promise';
import * as fs from 'fs'
import Logger from 'colorful-log-levels';
import { alertChannel, warframeWorldsstateURL, guildID, adminID } from './config';

// This is the function that will handle getting the alerts on an interval
export function initScheduler(client: Discord.Client, logger: Logger) {
    setInterval(() => {
        checkForAlertUpdates(client, logger);
    }, 10000);
}

export function checkForAlertUpdates(client: Discord.Client, logger: Logger) {
    request.get(warframeWorldsstateURL)
        .then((results: string) => {
            let discordChannel: any = client.channels.get(alertChannel);
            let warframeJSON = JSON.parse(results);
            // console.log(warframeJSON);
            // JSON.stringify(warframeJSON, null, 2)
            fs.writeFileSync('wfData.json', results);
            discordChannel.send(`Wrote the file as 'wfData.json`);
        })
        .catch((err) => {
            logger.error(err);
            // Get the guild to retrive the user for
            let guild = client.guilds.get(guildID);
            // Get the user object by ID
            let admin = guild.members.get(adminID);
            // Message the admin that something went wrong
            let discordChannel: any = client.channels.get(alertChannel);
            discordChannel.send(`${admin}, something went wrong: ${err}`);
        })
}
