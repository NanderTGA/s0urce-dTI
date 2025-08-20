import stats from "./stats.js";
import { Rarities, ItemTypes } from "./types.js";

export type DPSPriceEstimationInfo = [ number, number ] | [ null, number ] | [ number, null ] | undefined

export function estimatePrice(dPM: number, rarity: Rarities, value: number, basePrice: number, diff: number): DPSPriceEstimationInfo {
    switch (rarity) {
        case Rarities.mythic:
            if (dPM > 1) return [
                Math.max(
                    (value + basePrice * 3 - 1.928 * (dPM - 1) ** (1 / 2)) / 1.5 * diff,
                    value,
                ),
                Math.max(
                    (value * 2 + basePrice + basePrice * 2 * 4 - 3 * (dPM - 1) ** (2 / 3)) / 2 * diff,
                    value * 1.5,
                ),
            ]
            else if (dPM > 0) return [
                (value * 2 + basePrice * 3) * diff,
                null,
            ]
            break;
        case Rarities.ethereal:
            if (dPM === 100) return [
                null,
                value,
            ];
            else if (dPM > 50) return [
                Math.max(
                    (value + basePrice * 0.5 + 0.5 - 1.7 * (dPM - 50) ** (2 / 3)) * diff,
                    value,
                ),
                value * 1.5,
            ]
            else if (dPM > 1) return [
                Math.max(
                    (value + basePrice * 3 - 16 * (dPM - 1) ** (1 / 2)) * diff,
                    value,
                ),
                Math.max(
                    (value / 45 * 68 + basePrice / 45 * 68 * 4 - 20.3 * (dPM - 1) ** (2 / 3)) * diff,
                    value * 1.5,
                ),
            ]
            else if (dPM > 0) return [
                null,
                (value / 45 * 68 + basePrice / 45 * 68 * 4 - 20.3 * (dPM - 1) ** (2 / 3)) * diff,
            ];
            break;
        default:
            if (dPM > 30) return [
                value,
                value * 1.5,
            ]
            else if (dPM > 1) return [
                Math.max(
                    (value + basePrice - 4.3 * basePrice / 30 * (dPM - 1) ** (1 / 2)) * diff,
                    value,
                ),
                Math.max(
                    (value * 2 + basePrice * 2 - 4.3 * basePrice / 30 * (dPM - 1) ** (2 / 3)) * diff,
                    value * 1.5,
                ),
            ];
            else if (dPM > 0) return [
                ((value * 2 + basePrice * 2 - 4.3 * basePrice / 30 * (dPM - 1) ** (2 / 3)) * diff),
                null,
            ]
            break;
    }
}

export function dPS(dPM: number, level: number, rarity: Rarities, type: ItemTypes, stringify?: true): string
export function dPS(dPM: number, level: number, rarity: Rarities, type: ItemTypes, stringify: false): DPSPriceEstimationInfo
export default function dPS(dPM: number, level: number, rarity: Rarities, type: ItemTypes, stringify = true): string | DPSPriceEstimationInfo {
    const basePrice = stats.filamentPrice[rarity];
    const value = (level - 1) * 3 * basePrice + basePrice;
    let diff = type === "cpu" ? stats.cpu_dPD[rarity] :
        type === "gpu" ? stats.gpu_dPD[rarity] :
            type === "psu" ? stats.psu_dPD[rarity] :
                (type === "router" || type === "firewall") ? stats.fire_dPD[rarity] : value;
    diff = (diff + 1) / 2;

    const estimatedPrice = estimatePrice(dPM, rarity, value, basePrice, diff);
    if (!stringify) return estimatedPrice;

    // If there's no estimated price for it, chances are it's worth a lot
    if (!estimatedPrice) return "Invaluable";

    const [ min, max ] = estimatedPrice;
    if (min) {
        // [ number, null ] --> "69.42+"
        if (!max) return min.toFixed(2) + "+";

        // [ number, number ] --> "42~69"
        return min.toFixed(2) + "~" + max.toFixed(2);
    }

    if (!max) return "Invaluable";
    // [ null, number ] --> "69.42"
    return max.toFixed(2);
}