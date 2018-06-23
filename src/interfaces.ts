export interface warframeAlert {
    _id: { '$oid': string },
    Activation: { '$date': alertTimeObject },
    Expiry: { '$date': alertTimeObject },
    MissionInfo:
    {
        missionType: string,
        faction: string,
        location: string,
        levelOverride: string,
        enemySpec: string,
        minEnemyLevel: number,
        maxEnemyLevel: number,
        difficulty: number,
        seed: number,
        maxWaveNum: number,
        missionReward: missionReward,
        nightmare?: string
        archwing?: string
    }
}

export interface missionReward {
    credits: number,
    items?: string[],
    countedItems?: itemReward[]
}

export interface itemReward {
    ItemType: string,
    ItemCount: number
}

export interface alertTimeObject {
    '$numberLong': any
}

export interface cleanedAlert {
    start: string,
    end: string,
    timeRemaining: string,
    missionType: string,
    location: string,
    faction: string,
    enemyLevelRange: string,
    credits: string,
    rewards: string,
    nightmare?: string
    archwing?: string
}