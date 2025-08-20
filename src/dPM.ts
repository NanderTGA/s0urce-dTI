import stats from "./stats.js";
import { ItemTypes, Rarities } from "./types.js";

export function percentile(query: number, distribution: number[]): number {
    let p = 100;
    for (let i = 0; i < distribution.length; i++) {
        if (query <= distribution[i + 1]) break;
        p--;
    }

    return p
}

export const percentileDistributions: Partial<Record<ItemTypes, number[][]>> = {
    cpu: stats.cpu_dPM,
    gpu: stats.gpu_dPM,
    psu: [ stats.psu_dPM, stats.psu_dPM, stats.psu_dPM, stats.psu_dPM, stats.psu_dPM, stats.psu_dPM, stats.psu_dPM ],
    firewall: stats.fire_dPM,
    router: stats.fire_dPM,
}

export default function dPM(
    type: ItemTypes,
    rarity: Rarities,
    grade: number,
): number | undefined {
    const distribution = percentileDistributions[type];
    if (!distribution) return undefined;
    return percentile(grade, distribution[rarity]);
}