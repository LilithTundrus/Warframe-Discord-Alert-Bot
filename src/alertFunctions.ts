// Node/NPM imports 
import * as fs from 'fs';
const Items = require('warframe-items')

// Custom imports
import {
    guildRoleIDNitainAlert, guildRoleIDCatalyst,
    guildRoleIDReactor, guildRoleIDForma
} from './config';
import { itemReward, cleanedAlert } from './interfaces';

// Global files that contain solNode and mission-type data

const solNodes = fs.readFileSync('./data/solNode.json', 'utf-8');
const solNodeJSON = JSON.parse(solNodes);

const missionTypes = fs.readFileSync('./data/missionTypes.json', 'utf-8');
const missionTypeJSON = JSON.parse(missionTypes);

const factionTypes = fs.readFileSync('./data/factions.json', 'utf-8');
const factionTypeJSON = JSON.parse(factionTypes);

// Create an instance of the warframe items array
const items = new Items();

/** Resolve a Warframe solNode value by solNode ID
 * @param {string} solNode String to match the global solNode JSON set to
 * @returns string | null
 */
export function resolveSolNode(solNode: string) {
    if (solNodeJSON[solNode]) {
        // Return the readable value
        return solNodeJSON[solNode].value;
    } else {
        // No solNode could be found
        return null;
    }
}

/** Resolve a Warframe mission type by its raw mission string
 * @param {string} rawMission The raw mission string pulled from the worlState
 * @returns string | null
 */
export function resolveMissionType(rawMission: string) {
    if (missionTypeJSON[rawMission]) {
        // Return the readable value
        return missionTypeJSON[rawMission].value;
    } else {
        // No Mission type could be found
        return null;
    }
}

/** Resolve a Warframe faction type by its raw faction string
 * @param {string} rawFaction The raw faction string pulled from the worlState
 * @returns string | null
 */
export function resolveFactionType(rawFaction: string) {
    if (factionTypeJSON[rawFaction]) {
        // Return the readable value
        return factionTypeJSON[rawFaction].value;
    } else {
        // No faction type could be found
        return null;
    }
}

export function cleanCountedAlerts(countedAlertItems: itemReward[]) {
    let rewardString: string = '';

    countedAlertItems.forEach(reward => {
        let rewardType: string;
        // Clean the name
        let matchedItem = findWarframeItem(reward.ItemType);

        if (matchedItem !== undefined) {
            rewardType = matchedItem.name;
        } else {
            // An item type not yet handled, use default parsing
            let rewardNameStartIndex = reward.ItemType.lastIndexOf('/') + 1;
            rewardType = reward.ItemType.substring(rewardNameStartIndex);
        }
        // Add the item to the reward string (as opposed to returning an array)
        rewardString = rewardString + `${reward.ItemCount} ${rewardType}\n`;
    });

    // Return the string of alert items
    return rewardString;
}

export function cleanAlertItems(alertItems: string[]) {
    let rewardString: string = '';

    alertItems.forEach(reward => {
        // Find the item to get the 'cleaned' name
        let matchedItem = findWarframeItem(reward);

        if (matchedItem !== undefined) {
            let cleanedReward = matchedItem.name;
            rewardString = rewardString + cleanedReward;
        } else {
            // Do a default trim in case something isn't found
            let rewardNameStartIndex = reward.lastIndexOf('/') + 1;
            let parsedReward = reward.substring(rewardNameStartIndex);
            // Add spaces in betwen the capital letters
            let cleanedReward = parsedReward.replace(/([A-Z])/g, ' $1').trim();
            rewardString = rewardString + cleanedReward;
        }
    });

    // Return the string of alert items
    return rewardString;
}

// Function to determine who the bot should @ for certain alerts
export function determineAlertRoleMention(cleanedAlert: cleanedAlert) {
    if (cleanedAlert.rewards.includes('Orokin Catalyst')) {
        return guildRoleIDCatalyst;
    } else if (cleanedAlert.rewards.includes('Orokin Reactor')) {
        return guildRoleIDReactor;
    } else if (cleanedAlert.rewards.includes('Nitain')) {
        return guildRoleIDNitainAlert;
    } else if (cleanedAlert.rewards.includes('Forma')) {
        return guildRoleIDForma;
    }
    // TODO add orokin cells (maybe)
}

/** Find a Warframe's data by unique ID
 * @param {string} itemID ID of the item to find
 * @returns Warframe item object
 */
function findWarframeItem(itemID: string) {
    return items.find(entry => {
        return entry.uniqueName == itemID;
    });
}