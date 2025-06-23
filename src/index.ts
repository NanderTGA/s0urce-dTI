import { RankFunctionReturn, Rarities, Item, RaritiesLettersReverse } from "./stats.js";

import dCI from "./dCI.js";
import dFI from "./dFI.js";
import dGI from "./dGI.js";
import dPI from "./dPI.js";
import dPS, { estimatePrice } from "./dPS.js";

export enum ItemToDti {
    cpu = "dCI",
    gpu = "dGI",
    psu = "dPI",
    firewall = "dFI",
    router = "dFI"
}

export default function getItemGrade(item: Item, stringify?: true): string | undefined;
export default function getItemGrade(item: Item, stringify: false): { rank: RankFunctionReturn, dTIName: string, estimatedPrice: number } | undefined;
export default function getItemGrade(item: Item, stringify = true): string | { rank: RankFunctionReturn, dTIName: string, estimatedPrice: number } | undefined {
    if (!item.stats) return undefined;

    const rarity = Rarities[RaritiesLettersReverse[item.rarity]];
    const upgradeLevel = item.upgradeLevel ?? 1;
    const statsArrays = Object.groupBy(item.stats, stat => stat.key);
    const stats = Object.create(null) as Partial<Record<string, number>>;
    for (const stat in statsArrays) {
        const statInfo = statsArrays[stat];
        if (!statInfo) continue;
        stats[stat] = statInfo[0].value;
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
    } = stats;

    let rank: RankFunctionReturn | undefined;

    if (item.type === "cpu") {
        rank = dCI(
            rarity,
            upgradeLevel,
            hackDamage ?? 0,
            hackTrueDamage ?? 0,
            hackArmorPenetration ?? 0,
            hackCriticalDamageChance ?? 0,
            hackCriticalDamageBonus ?? 0,
        );
    } else if (item.type === "firewall" || item.type === "router") {
        rank = dFI(
            rarity,
            upgradeLevel,
            firewallHealth ?? 0,
            firewallDamageReduction ?? 0,
            firewallRegeneration ?? 0,
            firewallAdvancedEncryption ?? 0,
            firewallMasterEncryption ?? 0,
        );
    } else if (item.type === "gpu") {
        rank = dGI(
            rarity,
            upgradeLevel,
            idleCryptoMining ?? 0,
            moreCryptoReward ?? 0,
            betterBarter ?? 0,
        );
    } else if (item.type === "psu") {
        rank = dPI(
            rarity,
            upgradeLevel,
            cryptoMiningPower ?? 0,
        );
    } else {
        return undefined;
    }

    const dTIName = ItemToDti[item.type];
    const estimatedPrice = (stringify ? dPS : estimatePrice)(rank.rating, upgradeLevel, rarity, item.type);
    rank.rating = Number(rank.rating.toFixed(4));

    if (!stringify) return { rank, dTIName, estimatedPrice: estimatedPrice as number };

    // 5.6842/10.0000 dCI (~69 BTC) v1.6.2
    return `${rank.rating}/10.0000 ${dTIName} (${estimatedPrice}) v${rank.version}`;
}