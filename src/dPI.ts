import stats, { RankFunctionReturn, Rarities } from "./stats.js";

export const DPI_VERSION = "1.6.2";

export function boostBtcPerHour(boost: number, rarity: Rarities): number {
    let idle = stats.gpu[rarity].idle[1] + stats.gpuTerm[rarity];
    idle *= 3600;
    boost /= 100;
    return idle * (1 + boost) - idle;
}

export function rank(boost: number, level: number, rarity: Rarities): number {
    const item = stats.psu[rarity];
    const bestPSU = boostBtcPerHour(item.boost[1] + stats.psuTerm[rarity] * level, rarity);
    const worstPSU = boostBtcPerHour(item.boost[0] + stats.psuTerm[rarity] * level, rarity);
    const actualPSU = boostBtcPerHour(boost, rarity);
    const qualityRange = bestPSU - worstPSU;
    const actualRange = actualPSU - worstPSU;
    const psuRank = 1 + ((actualRange / qualityRange) * 9);
    if (psuRank < 1) return 1;
    return psuRank;
}

export default function dPI(
    rarity: Rarities,
    level: number,
    cryptoMiningPower: number,
): RankFunctionReturn {
    const rating = rank(cryptoMiningPower, level, rarity);
    return { rating, version: DPI_VERSION };
}