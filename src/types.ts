import { DPSPriceEstimationInfo } from "./dPS.js";

export enum Rarities {
    common,
    uncommon,
    rare,
    epic,
    legendary,
    mythic,
    ethereal
}

export enum RaritiesLetters {
    ethereal = "SSS",
    mythic = "SS",
    legendary = "S",
    epic = "A",
    rare = "B",
    uncommon = "C",
    common = "D"
}

export enum RaritiesLettersReverse {
    SSS = "ethereal",
    SS = "mythic",
    S = "legendary",
    A = "epic",
    B = "rare",
    C = "uncommon",
    D = "common"
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

export type ItemTypes = "avatar" | "namePlate" | "nameColor" | "psu" | "ascii" | "cpu" | "gpu" | "firewall" | "router";
/**
 * How a s0urce item is represented under the hood.
 * This is what bots see.
 * The only difference is that here you can use router instead of firewall as the item type too.
 */

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

export enum ItemToDti {
    cpu = "dCI",
    gpu = "dGI",
    psu = "dPI",
    firewall = "dFI",
    router = "dFI"
}

export interface ItemRankInfo {
    rank: number;
    name: string;
}

export interface ItemGradeInfo {
    rank?: number;
    version: string;
    dTIName?: string;
    percentile?: number;
    estimatedPrice: DPSPriceEstimationInfo;
}

