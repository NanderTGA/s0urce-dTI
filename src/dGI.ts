import stats, { Rarities } from "./stats.js";

export function netBtcPerHour(idle: number, barter: number, crypto: number): number {
    const npcsPerHour = 27.69;
    // Based on 1 Hour of Grinding returns
    idle *= 3600;
    // Maximum bartering benefit is selling uncommons, assuming it is used:
    barter /= 100;
    barter = ((1 + barter) * 0.00864000 - 0.00864000) * npcsPerHour;
    // Hack bonus, similar to bartering
    crypto /= 100;
    crypto = ((1 + crypto) * 0.00180000 - 0.00180000) * npcsPerHour;
    return idle + barter + crypto;
}

export function rank(idle: number, barter: number, crypto: number, level: number, rarity: Rarities): number {
    const item = stats.gpu[rarity];
    const bestGPU = netBtcPerHour(item.idle[1] + stats.gpuTerm[rarity] * level, item.bart[1], item.crypto[1]);
    const worstGPU = netBtcPerHour(item.idle[0] + stats.gpuTerm[rarity] * level, item.bart[0], item.crypto[0]);
    const actualGPU = netBtcPerHour(idle, barter, crypto);
    const qualityRange = bestGPU - worstGPU;
    const actualRange = actualGPU - worstGPU;
    const gpuRank = 1 + ((actualRange / qualityRange) * 9);
    if (gpuRank < 1) return 1;
    return gpuRank;
}

export default function dGI(
    rarity: Rarities,
    level: number,
    idleCryptoMining: number,
    moreCryptoReward: number,
    betterBarter: number,
): number {
    const rating = rank(idleCryptoMining, betterBarter, moreCryptoReward, level, rarity);
    return rating;
}