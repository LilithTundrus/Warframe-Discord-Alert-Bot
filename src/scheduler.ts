import * as Discord from 'discord.js';
import * as request from 'request-promise';
import * as fs from 'fs'
import Logger from 'colorful-log-levels';
import { alertChannel, warframeWorldsstateURL, guildID, adminID } from './config';
import { warframeAlert, cleanedAlert } from './interfaces'

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

            // Check the previous array for the IDs of each entry
            // If a match is not found the item is new
            for (let alert of currentAlerts) {
                let matchedAlert = checkPreviousWarframeAlertsForGivenID(alert._id.$oid, previousAlerts);
                if (!matchedAlert) {
                    // The alert is new since the last check
                    let formattedAlert = cleanAlertData(alert);
                    // Start crafting a message
                    logger.debug('Alerts have changed');
                    let discordChannel: any = client.channels.get(alertChannel);
                    discordChannel.send(`Manifest has a new alert entry: ${formattedAlert.timeRemaining}`);
                }
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

// Check if a warframe alert ID is in the passed array of alerts
function checkPreviousWarframeAlertsForGivenID(alertID: string, alertsToCheck: warframeAlert[]) {
    return alertsToCheck.find(alert => {
        return alert._id.$oid == alertID;
    });
}

// Clean the alert data to a more easily workable function
function cleanAlertData(baseAlert: warframeAlert) {
    // Base variable to fill in and return
    let cleanedAlert: cleanedAlert = {
        start: 'READABLE DATE',
        end: 'READABLE DATE',
        timeRemaining: 'Time from now until end',
        missionType: 'Actual Mission Name',
        location: 'resolvedName',
        faction: 'Proper faction Name',
        enemyLevelRange: 'X-X',
        credits: 'credit count',
        rewards: 'resolved rewards',
        nightmare: 'yes/no',
        archwing: 'yes/no',
    };
    let timeLeft = baseAlert.Activation.$date.$numberLong - baseAlert.Expiry.$date.$numberLong
    cleanedAlert.timeRemaining = msToTime(timeLeft);

    return cleanedAlert;
}

function msToTime(duration: any) {
    let parsedDuration = parseInt(duration);
    let milliseconds = (parsedDuration % 1000) / 100;

    let seconds: any = (parsedDuration / 1000) % 60
    let minutes: any = (parsedDuration / (1000 * 60)) % 60
    let hours: any = (parsedDuration / (1000 * 60 * 60)) % 24;

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + " hrs: " + minutes + " mins: " + seconds + "." + milliseconds + ' seconds';
}