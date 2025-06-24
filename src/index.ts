import statistics, { Rarities, Item, RaritiesLettersReverse } from "./stats.js";
import packageJSON from "../package.json" with { type: "json" }
const { version } = packageJSON;

import dCI from "./dCI.js";
import dFI from "./dFI.js";
import dGI from "./dGI.js";
import dPI from "./dPI.js";
import dPS, { DPSPriceEstimationInfo, estimatePrice } from "./dPS.js";

export enum ItemToDti {
    cpu = "dCI",
    gpu = "dGI",
    psu = "dPI",
    firewall = "dFI",
    router = "dFI"
}

export interface ItemGradeInfo {
    rank: number;
    version: string;
    dTIName: string;
    estimatedPrice: DPSPriceEstimationInfo;
}

export default function getItemGrade(item: Item, stringify?: true, dPMFlag?: boolean): string | undefined;
export default function getItemGrade(item: Item, stringify: false, dPMFlag?: boolean): ItemGradeInfo | undefined;
export default function getItemGrade(item: Item, stringify = true, dPMFlag = false): string | ItemGradeInfo | undefined {
    if (!item.stats) return undefined;

    const rarity = Rarities[RaritiesLettersReverse[item.rarity]];
    const level = item.upgradeLevel ?? 1;
    const statsArrays = Object.groupBy(item.stats, stat => stat.key);
    const itemStats = Object.create(null) as Partial<Record<string, number>>;
    for (const stat in statsArrays) {
        const statInfo = statsArrays[stat];
        if (!statInfo) continue;
        itemStats[stat] = statInfo[0].value;
    }

    const {
        hackDamage,
        hackTrueDamage,
        hackCriticalDamageChance,
        hackCriticalDamageBonus,
        hackArmorPenetration,
        firewallHealth,
        firewallRegeneration,
        firewallDamageReduction,
        firewallMasterEncryption,
        firewallAdvancedEncryption,
        idleCryptoMining,
        moreCryptoReward,
        betterBarter,
        cryptoMiningPower,
    } = itemStats;

    let rank: number | undefined;

    if (item.type === "cpu") {
        rank = dCI(
            rarity,
            !dPMFlag ? level : 1,
            !dPMFlag ? (hackDamage ?? 0) : (hackDamage ?? 0) - statistics.cpuTerm[rarity] * (level - 1),
            hackTrueDamage ?? 0,
            hackArmorPenetration ?? 0,
            hackCriticalDamageChance ?? 0,
            hackCriticalDamageBonus ?? 0,
        );
    } else if (item.type === "firewall" || item.type === "router") {
        rank = dFI(
            rarity,
            !dPMFlag ? level : 1,
            !dPMFlag ? (firewallHealth ?? 0) : (firewallHealth ?? 0) - statistics.fireTerm[rarity] * (level - 1),
            firewallDamageReduction ?? 0,
            firewallRegeneration ?? 0,
            firewallAdvancedEncryption ?? 0,
            firewallMasterEncryption ?? 0,
        );
    } else if (item.type === "gpu") {
        rank = dGI(
            rarity,
            level,
            idleCryptoMining ?? 0,
            moreCryptoReward ?? 0,
            betterBarter ?? 0,
        );
    } else if (item.type === "psu") {
        rank = dPI(
            rarity,
            !dPMFlag ? level : 1,
            !dPMFlag ? (cryptoMiningPower ?? 0) : (cryptoMiningPower ?? 0) - statistics.psuTerm[rarity] * (level - 1),
        );
    } else {
        return undefined;
    }

    const dTIName = ItemToDti[item.type];
    const estimatedPrice = (stringify ? dPS : estimatePrice)(rank, level, rarity, item.type);
    rank = Number(rank.toFixed(4));

    if (!stringify) return { rank, version, dTIName, estimatedPrice: estimatedPrice as DPSPriceEstimationInfo };

    // 5.6842/10.0000 dCI (~69 BTC) v1.6.2
    return `${rank}/10.0000 ${dTIName} (${estimatedPrice}) v${version}`;
}