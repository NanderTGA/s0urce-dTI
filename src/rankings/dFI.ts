import stats from "../stats.js";
import { Rarities } from "../types.js";

import { hackPower } from "./dCI.js";

export function firewallEncryption(hp: number, rd: number, regeneration: number, medium: number, long: number): [ number, number, number, number ] {
    rd /= 100;
    const shortComplexity = [ 3.7027, 100 ];
    const mediumComplexity = [ 8.2857, medium * 3 ];
    const longComplexity = [ 13.421, long * 3 ];
    return [
        1000 + hp * 3,
        rd * 3,
        regeneration * 3 * 0.3,
        (shortComplexity[0] * shortComplexity[1] + mediumComplexity[0] * mediumComplexity[1] + longComplexity[0] * longComplexity[1]) / (shortComplexity[1] + mediumComplexity[1] + longComplexity[1]),
    ];
}

export function penTest(port: number[], cpu: number[], aTPH: number): number {
    let t = 0;
    const damage = cpu[0] * (1 + cpu[1] - port[1]) + cpu[2];

    while (port[0] - damage + port[2] * aTPH > 0) {
        port[0] -= damage;
        port[0] += port[2] * aTPH;
        t += aTPH;
    }
    return t + aTPH * (port[0] + port[2] * aTPH) / damage;
}

export function rank(hp: number, rd: number, rg: number, enc: number, level: number, rarity: Rarities): number {
    const item = stats.firewall[rarity];
    const cpu = stats.cpu[rarity];
    const cpuV = hackPower(cpu.hack[1] + stats.cpuTerm[rarity] * (level - 1), cpu.trueDam[1], cpu.pen[1], cpu.chance[1], cpu.dam[1]);
    const cpsAverage = 5;
    const bestPort = firewallEncryption(item.hp[1] + stats.fireTerm[rarity] * (level - 1), item.rd[1], item.rg[1], item.medium[1], item.long[1]);
    const worstPort = firewallEncryption(item.hp[0] + stats.fireTerm[rarity] * (level - 1), item.rd[0], item.rg[0], item.medium[0], item.long[0]);
    const bestHoldout = penTest(bestPort, cpuV, bestPort[3] / cpsAverage + 0.3);
    const worstHoldout = penTest(worstPort, cpuV, worstPort[3] / cpsAverage + 0.3);
    const actualHoldout = penTest([ hp, rd, rg ], cpuV, enc / cpsAverage + 0.3);
    const qualityRange = worstHoldout - bestHoldout;
    const qualityActually = worstHoldout - actualHoldout;
    const fireRank = 1 + (qualityActually / qualityRange * 9);
    if (fireRank < 1) return 1;
    return fireRank;
}

export default function dFI(
    rarity: Rarities,
    level: number,
    health: number,
    damageReduction: number,
    regeneration: number,
    advancedEncryption: number,
    masterEncryption: number,
): number {
    const [ hp, rd, rg, encryption ] = firewallEncryption(health, damageReduction, regeneration, advancedEncryption, masterEncryption);
    const rating = rank(hp, rd, rg, encryption, level, rarity);
    return rating;
}