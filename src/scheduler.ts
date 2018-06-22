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
            let previousWFData = fs.readFileSync('wfData.json').toString();
            let previousWFJSON = JSON.parse(previousWFData)
            
            let discordChannel: any = client.channels.get(alertChannel);
            let currentWFJSON = JSON.parse(results);
            // Write something so we always have something to read moving forward
            // fs.writeFileSync('wfData.json', results);


            // Compare the alerts
            let previousAlerts = previousWFJSON.Alerts;
            let currentAllerts = currentWFJSON.Alerts;

            console.log(previousAlerts)
            console.log('\n\n\n\n\n')
            console.log(currentAllerts)

            discordChannel.send(`Refreshed the JSON manifest`);
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
        });
}
