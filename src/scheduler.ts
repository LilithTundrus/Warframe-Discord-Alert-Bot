// NPM packages/built in node.js packages that are needed
import * as Discord from 'discord.js';
import * as request from 'request-promise';
import Logger from 'colorful-log-levels';
import * as fs from 'fs';

// Custom/local config and function imports
import { alertChannel, warframeWorldsstateURL, guildID, adminID } from './config';
import { warframeAlert, cleanedAlert } from './interfaces';
import {
    resolveFactionType, resolveMissionType,
    resolveSolNode, cleanCountedAlerts,
    cleanAlertItems
} from './alertFunctions';

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
                    discordChannel.send(`Manifest has a new alert entry: ${JSON.stringify(formattedAlert, null, 2)}`);
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
    let cleanedAlert = <cleanedAlert>{};
    cleanedAlert.rewards = '';

    console.log(baseAlert.MissionInfo);
    let startDate = prettyDate(baseAlert.Activation.$date.$numberLong)
    let newDate = formatDate(startDate);

    // cleanedAlert.start = newDate

    // let expireDate = convertToDate(baseAlert.Expiry.$date.$numberLong);
    // console.log(expireDate)
    // console.log(new Date().getTime())
    // var seconds = (expireDate.getTime() - new Date().getTime()) / 1000;
    // console.log(seconds.toString())

    // Get the location string for the Alert
    let location = resolveSolNode(baseAlert.MissionInfo.location);
    // Assign the cleaned object location property a readable value
    if (location !== null) cleanedAlert.location = location;
    // Else, just leave it alone
    else cleanedAlert.location = baseAlert.MissionInfo.location;

    // Get the mission type string
    let missionType = resolveMissionType(baseAlert.MissionInfo.missionType);
    // Assign the cleaned object missionType property a readable value
    if (missionType !== null) cleanedAlert.missionType = missionType;
    // Else, just leave the missionType as-is so something is still returned
    else cleanedAlert.missionType = baseAlert.MissionInfo.missionType;

    // get the faction type string
    let factionType = resolveFactionType(baseAlert.MissionInfo.faction);
    // Assign the cleaned object factionType property a readable value
    if (missionType !== null) cleanedAlert.faction = factionType;
    // Else, just leave the missionType as-is so something is still returned
    else cleanedAlert.missionType = baseAlert.MissionInfo.faction;

    // Set the enemy level range properly
    cleanedAlert.enemyLevelRange = `${baseAlert.MissionInfo.minEnemyLevel}-${baseAlert.MissionInfo.maxEnemyLevel}`;

    // Set the credit count
    cleanedAlert.credits = baseAlert.MissionInfo.missionReward.credits.toString();

    // Get and set the counted rewards
    if (baseAlert.MissionInfo.missionReward.countedItems) {
        cleanedAlert.rewards = cleanCountedAlerts(baseAlert.MissionInfo.missionReward.countedItems);
    }

    // Get and set the rewards
    if (baseAlert.MissionInfo.missionReward.items) {
        cleanedAlert.rewards = cleanedAlert.rewards + cleanAlertItems(baseAlert.MissionInfo.missionReward.items);
    }

    // Make sure we mark the alert as Arhcwing if needed
    if (baseAlert.MissionInfo.archwing) {
        cleanedAlert.archwing = 'Yes';
    }

    // Mark the alert as nightmare if the base alert has it
    if (baseAlert.MissionInfo.nightmare) {
        cleanedAlert.nightmare = 'Yes';
    }

    // cleanedAlert.timeRemaining = convertToDate(timeLeft);

    return cleanedAlert;
}

// Convert unix long dates to hours + minutes + seconds
// function msToTime(milliseconds) {
//     let date = new Date(milliseconds);

//     let h = date.getHours();
//     let m = date.getMinutes();
//     let s = date.getSeconds();

//     return `${h} hrs: ${m} mins: ${s} seconds`;
// };

function convertToDate(unixLong) {
    unixLong = parseInt(unixLong);

    if (isNaN(unixLong)) {
        return null;
    } else {
        if (unixLong <= 9999999999) {
            unixLong *= 1000;
        }
        var date = new Date(unixLong);
        return date;
    }
}

function prettyDate(time) {
    var date = new Date(parseInt(time));
    var localeSpecificTime = date.toLocaleTimeString();
    return localeSpecificTime.replace(/:\d+ /, ' ');
}

function formatDate(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m: any = d.getMinutes();
    var s: any = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    m = m < 10 ? "0" + m : m;

    s = s < 10 ? "0" + s : s;

    /* if you want 2 digit hours:
    h = h<10?"0"+h:h; */

    var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

    var replacement = h + ":" + m;
    /* if you want to add seconds
    replacement += ":"+s;  */
    replacement += " " + dd;

    return date.replace(pattern, replacement);
}