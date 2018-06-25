import * as fs from 'fs';
import { itemReward } from './interfaces';

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

export function cleanCountedAlerts(alertItems: itemReward[]) {
    let rewardString: string;
    alertItems.forEach(reward => {
        let rewardType: string;
        // Clean the name
        switch (reward.ItemType) {
            case 'VoidTearDrop':
                rewardType = 'Void Traces';
                break;
            case 'ArgonCrystal':
                rewardType = 'Argon Crystal';
                break;

            default:

                break;
        }
    });
}