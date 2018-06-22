import * as Discord from 'discord.js';
import * as request from 'request-promise';
import * as fs from 'fs'
import Logger from 'colorful-log-levels';
import { alertChannel, warframeWorldsstateURL, guildID, adminID } from './config';
import { warframeAlert } from './interfaces'

// This is the function that will handle getting the alerts on a set interval
export function initScheduler(client: Discord.Client, logger: Logger) {
    setInterval(() => {
        checkForAlertUpdates(client, logger);
    }, 20000);
}

export function checkForAlertUpdates(client: Discord.Client, logger: Logger) {
    request.get(warframeWorldsstateURL)
        .then((results: string) => {
            // Read the old alert dataSet
            let previousWFData = fs.readFileSync('wfData.json').toString();
            let previousWFJSON = JSON.parse(previousWFData);
            // Parse the string returned from the request.get
            let currentWFJSON = JSON.parse(results);

            // Shorthand for the worldstate data Alerts section
            let previousAlerts: warframeAlert[] = previousWFJSON.Alerts;
            let currentAlerts: warframeAlert[] = currentWFJSON.Alerts;

            for (let alerts of currentAlerts) {
                console.log(alerts.Activation.$date.$numberLong)

            }

            // TODO: find a better comparison method
            // Comparing the lengths since this is the easiest way to tell that data has changed
            if (previousAlerts.length !== currentAlerts.length) {
                logger.debug('Alerts have changed');
                let discordChannel: any = client.channels.get(alertChannel);
                discordChannel.send(`Manifest has a new alert entry!`);
            }

            // This gets written after a message is sent so current data -> previous file
            // for the next check
            fs.writeFileSync('wfData.json', results);
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