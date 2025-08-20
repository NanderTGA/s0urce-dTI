import statistics from "../stats.js";
import { Item, Rarities, ItemRankInfo, ItemToDti } from "../types.js";

import dCI from "./dCI.js";
import dFI from "./dFI.js";
import dGI from "./dGI.js";
import dPI from "./dPI.js";

export function getItemRank(item: Item, rarity: Rarities, level: number, dPMFlag = false): ItemRankInfo | undefined {
    if (!item.stats) return undefined;

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
            hackCriticalDamageBonus ?? 0
        );
    } else if (item.type === "firewall" || item.type === "router") {
        rank = dFI(
            rarity,
            !dPMFlag ? level : 1,
            !dPMFlag ? (firewallHealth ?? 0) : (firewallHealth ?? 0) - statistics.fireTerm[rarity] * (level - 1),
            firewallDamageReduction ?? 0,
            firewallRegeneration ?? 0,
            firewallAdvancedEncryption ?? 0,
            firewallMasterEncryption ?? 0
        );
    } else if (item.type === "gpu") {
        if (dPMFlag) {
            rank = (idleCryptoMining ?? 0) - statistics.gpuTerm[rarity] * (level - 1);
        } else {
            rank = dGI(
                rarity,
                level,
                idleCryptoMining ?? 0,
                moreCryptoReward ?? 0,
                betterBarter ?? 0
            );
        }
    } else if (item.type === "psu") {
        rank = dPI(
            rarity,
            !dPMFlag ? level : 1,
            !dPMFlag ? (cryptoMiningPower ?? 0) : (cryptoMiningPower ?? 0) - statistics.psuTerm[rarity] * (level - 1)
        );
    } else {
        return undefined;
    }

    return {
        name: ItemToDti[item.type],
        rating: Number((rank as number).toFixed(4))
    };
}
