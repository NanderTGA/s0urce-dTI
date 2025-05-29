export interface RankFunctionReturn {
    rating: number;
    version: string;
}

export enum Rarities {
    common,
    uncommon,
    rare,
    epic,
    legendary,
    mythic,
    ethereal,
}

export enum RaritiesLetters {
    ethereal = "SSS",
    mythic = "SS",
    legendary = "S",
    epic = "A",
    rare = "B",
    uncommon = "C",
    common = "D",
}

export enum RaritiesLettersReverse {
    SSS = "ethereal",
    SS = "mythic",
    S = "legendary",
    A = "epic",
    B = "rare",
    C = "uncommon",
    D = "common",
}

export interface ItemStat {
    primary: boolean;
    name: string;
    /**
     * User-friendly description of the stat.
     * Can contain $VAL%, which is replaced by the game with {@link ItemStat.value}.
     */
    description: string;
    value: number;
    starter_value: number;
    increasePerLevel: number;
    /** Developer-friendly description of the stat. */
    key: string;
    /** A stringified number. */
    quality: string;
}

export type ItemTypes = "avatar" | "namePlate" | "nameColor" | "psu" | "ascii" | "cpu" | "gpu" | "firewall";

/** How a s0urce item is represented under the hood. This is what bots see. */
export interface Item<ItemType extends ItemTypes = ItemTypes> {
    id: string;
    name: string;

    description: string;
    /** https://s0urce.io/items/${icon} */
    icon: string;
    /** https://s0urce.io/items/${iconSmall} */
    iconSmall: string;
    type: ItemType;
    /** Unique number for this item. This tells us that this item is the n-th one created. */
    mint: number;
    /** Name of the player who created the item. */
    creator: string;
    /** Can be passed into the `Date()` constructor to get a valid instance. */
    creationDate: string;
    rarity: RaritiesLetters;
    sellPrice: number;
    upgradePrice?: number;
    upgradeLevel?: number;
    stats?: ItemStat[];
    suffix?: string;
    premium?: boolean;
    color?: string;
}

export default {
    cpu: [
        { hack: [ 8, 18 ], trueDam: [ 0, 0 ], pen: [ 0, 0 ], chance: [ 0, 0 ], dam: [ 0, 0 ] },
        { hack: [ 18.5, 33.5 ], trueDam: [ 0, 10 ], pen: [ 0, 5 ], chance: [ 0, 2.5 ], dam: [ 1, 5 ] },
        { hack: [ 34, 54 ], trueDam: [ 0, 20 ], pen: [ 0, 15 ], chance: [ 2.5, 3.25 ], dam: [ 5, 7.5 ] },
        { hack: [ 55, 64.25 ], trueDam: [ 0, 30 ], pen: [ 0, 20 ], chance: [ 4, 6.25 ], dam: [ 8.25, 15 ] },
        { hack: [ 68.75, 84.75 ], trueDam: [ 0, 40 ], pen: [ 13, 25 ], chance: [ 6.5, 7.5 ], dam: [ 17, 25 ] },
        { hack: [ 91, 105 ], trueDam: [ 43, 50 ], pen: [ 19.5, 30 ], chance: [ 8.25, 10 ], dam: [ 19.5, 30 ] },
        { hack: [ 125.5, 135.5 ], trueDam: [ 55, 60 ], pen: [ 32.5, 35 ], chance: [ 11.25, 12.5 ], dam: [ 32.5, 35 ] },
    ],
    firewall: [
        { hp: [ 22, 62 ], rd: [ 0, 0 ], rg: [ 0, 0 ], medium: [ 0, 0 ], long: [ 0, 0 ] },
        { hp: [ 64, 114 ], rd: [ 0, 7.5 ], rg: [ 0, 2.5 ], medium: [ 0, 0 ], long: [ 0, 0 ] },
        { hp: [ 116, 166 ], rd: [ 0, 10 ], rg: [ 0, 5 ], medium: [ 0, 30 ], long: [ 0, 0 ] },
        { hp: [ 172, 217 ], rd: [ 0, 12.5 ], rg: [ 0, 7.5 ], medium: [ 22, 40 ], long: [ 0, 25 ] },
        { hp: [ 234, 269 ], rd: [ 0, 15 ], rg: [ 8, 10 ], medium: [ 34, 0 ], long: [ 22, 30 ] },
        { hp: [ 285, 320 ], rd: [ 11.5, 15 ], rg: [ 10.75, 12.5 ], medium: [ 65, 47.5 ], long: [ 28, 35 ] },
        { hp: [ 372, 397 ], rd: [ 16.25, 17.5 ], rg: [ 13.75, 15 ], medium: [ 70, 80 ], long: [ 37.5, 45 ] },
    ],
    gpu: [
        { idle: [ 0.000010, 0.000014 ], bart: [ 0, 0 ], crypto: [ 0, 0 ] },
        { idle: [ 0.000011, 0.000024 ], bart: [ 0, 10 ], crypto: [ 2.5, 10 ] },
        { idle: [ 0.000016, 0.000033 ], bart: [ 0, 12.5 ], crypto: [ 2.5, 12.5 ] },
        { idle: [ 0.0000223, 0.000043 ], bart: [ 0, 15 ], crypto: [ 6, 15 ] },
        { idle: [ 0.0000372, 0.000054 ], bart: [ 0, 20 ], crypto: [ 11.25, 20 ] },
        { idle: [ 0.0000644, 0.000074 ], bart: [ 21.25, 25 ], crypto: [ 21.25, 25 ] },
        { idle: [ 0.000077, 0.000094 ], bart: [ 22.5, 30 ], crypto: [ 22.5, 30 ] },
    ],
    psu: [
        { boost: [ 1, 5 ] },
        { boost: [ 5, 10 ] },
        { boost: [ 10, 15 ] },
        { boost: [ 16, 25 ] },
        { boost: [ 28, 35 ] },
        { boost: [ 38.5, 40 ] },
        { boost: [ 50, 55 ] },
    ],
    port: [
        { hp: 1000 + 3 * 60, rd: 0 },
        { hp: 1000 + 3 * 114, rd: 3 * 0.075 },
        { hp: 1000 + 3 * 166, rd: 3 * 0.1 },
        { hp: 1000 + 3 * 217, rd: 3 * 0.125 },
        { hp: 1000 + 3 * 269, rd: 3 * 0.15 },
        { hp: 1000 + 3 * 320, rd: 3 * 0.15 },
        { hp: 1000 + 3 * 397, rd: 3 * 0.175 },
    ],
    cpuTerm: [
        3,
        3.5,
        4,
        4.25,
        4.75,
        5,
        5.5,
    ],
    fireTerm: [
        12,
        14,
        16,
        17,
        19,
        20,
        22,
    ],
    gpuTerm: [
        0.0000042 * 0.6,
        0.0000042 * 0.7,
        0.0000042 * 0.8,
        0.0000042 * 0.85,
        0.0000042 * 0.95,
        0.0000042,
        0.0000042 * 1.1,
    ],
    psuTerm: [
        1.2,
        1.4,
        1.6,
        1.7,
        1.9,
        2,
        2.2,
    ],
    // Last updated as of 6/21/2024
    // these prices are the minimum, not the average 😫
    filamentPrice: [
        0.01,
        0.03,
        0.1,
        0.3,
        1.5,
        4.5,
        45,
    ],
};