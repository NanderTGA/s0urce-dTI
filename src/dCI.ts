import stats, { RankFunctionReturn, Rarities } from "./stats.js";

export const DCI_VERSION = "1.6.2";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns [ raw, pen, trueDmg ]
 */
export function hackPower(hack: number, trueDmg: number, pen: number, chance: number, dam: number): [ number, number, number ] {
    pen /= 100;
    chance /= 100;
    dam /= 100;
    return [
        (100 + hack) + (.05 + chance) * (100 + hack) * (.3 + dam),
        pen,
        trueDmg,
    ];
}

export function rank(raw: number, pen: number, trueDam: number, level: number, rarity: number): number {
    const item = stats.cpu[rarity];
    const port = stats.port[rarity];
    const bestHackPower = hackPower(item.hack[1] + stats.cpuTerm[rarity] * (level - 1), item.trueDam[1], item.pen[1], item.chance[1], item.dam[1]);
    const worstHackPower = hackPower(item.hack[0] + stats.cpuTerm[rarity] * (level - 1), item.trueDam[0], item.pen[0], item.chance[0], item.dam[0]);
    const best = port.hp / (bestHackPower[0] * (1 + bestHackPower[1] - port.rd) + bestHackPower[2]);
    const worst = port.hp / (worstHackPower[0] * (1 + worstHackPower[1] - port.rd) + worstHackPower[2]);
    const actual = port.hp / (raw * (1 + pen - port.rd) + trueDam);
    const qualityRange = worst - best;
    const qualityActually = worst - actual;
    const cpuRank = 1 + ((qualityActually / qualityRange) * 9);
    if (cpuRank < 1) return 1;
    return cpuRank;
}

export default function dCI(
    rarity: Rarities,
    level: number,
    hackDamage: number,
    trueDamage: number,
    armorPenetration: number,
    criticalChance: number,
    criticalDamage: number,
): RankFunctionReturn {
    const [ raw, pen, trueDmg ] = hackPower(hackDamage, trueDamage, armorPenetration, criticalChance, criticalDamage);
    const rating = rank(raw, pen, trueDmg, level, rarity);
    return { rating, version: DCI_VERSION };
}