// Node imports 
import * as fs from 'fs';

// Custom imports
import { itemReward, cleanedAlert } from './interfaces';

// Global files that contain solNode and mission-type data

const solNodes = fs.readFileSync('./data/solNode.json', 'utf-8');
const solNodeJSON = JSON.parse(solNodes);

const missionTypes = fs.readFileSync('./data/missionTypes.json', 'utf-8');
const missionTypeJSON = JSON.parse(missionTypes);

const factionTypes = fs.readFileSync('./data/factions.json', 'utf-8');
const factionTypeJSON = JSON.parse(factionTypes);


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
        // No solNode could be found
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
        // No solNode could be found
        return null;
    }
}

export function cleanCountedAlerts(countedAlertItems: itemReward[]) {
    let rewardString: string = '';
    countedAlertItems.forEach(reward => {
        let rewardType: string;

        // Clean the name
        if (reward.ItemType.includes('VoidTearDrop')) {
            rewardType = 'Void Traces';
        } else if (reward.ItemType.includes('ArgonCrystal')) {
            rewardType = 'Argon Crytsal';
        } else if (reward.ItemType.includes('Neurode')) {
            rewardType = 'Neurodes';
        } else if (reward.ItemType.includes('Alertium')) {
            rewardType = 'Nitain';
        } else if (reward.ItemType.includes('OxiumAlloy')) {
            rewardType = 'Oxium';
        } else if (reward.ItemType.includes('Tellurium')) {
            rewardType = 'Tellurium';
        } else if (reward.ItemType.includes('NeuralSensor')) {
            rewardType = 'Neural Sensor';
        } else if (reward.ItemType.includes('Ferrite')) {
            rewardType = 'Ferrite';
        } else if (reward.ItemType.includes('ControlModule')) {
            rewardType = 'Control Module';
        } else {
            // An item type we haven't yet handled
            let rewardNameStartIndex = reward.ItemType.lastIndexOf('/') + 1;
            rewardType = reward.ItemType.substring(rewardNameStartIndex);
        }

        rewardString = rewardString + `${reward.ItemCount} ${rewardType}\n`;
    });
    // Return the string of alert items
    return rewardString;
}

export function cleanAlertItems(alertItems: string[]) {
    let rewardString: string = '';
    alertItems.forEach(reward => {
        // Get rid of the extra parts of the string

        // Warframe item data looks like this: '/Lotus/StoreItems/Upgrades/Mods/FusionBundles/AlertFusionBundleSmall'
        // and we only want the last part of that
        let rewardNameStartIndex = reward.lastIndexOf('/') + 1;
        let parsedReward = reward.substring(rewardNameStartIndex);
        // Add spaces in betwen the capital letters
        let cleanedReward = parsedReward.replace(/([A-Z])/g, ' $1').trim();
        // Eventually we'll handle more edge cases here
        if (cleanedReward.includes('Bundle Small')) {
            cleanedReward = 'Endo - Small';
        } else if (cleanedReward.includes('Bundle Medium')) {
            cleanedReward = 'Endo - Medium';
        } else if (cleanedReward.includes('Bundle Large')) {
            cleanedReward = 'Endo - Large';
        }
        rewardString = rewardString + cleanedReward;
    });

    // Return the string of alert items
    return rewardString;
}

// Function to determine who the bot should @ for certain alerts
export function determineAlertRoleMention(cleanedAlert: cleanedAlert) {

    

}