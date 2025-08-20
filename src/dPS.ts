import stats from "./stats.js";
import { Rarities, ItemTypes } from "./types.js";

export function estimatePrice(dPM: number, level: number, rarity: Rarities, type: ItemTypes): string {
    const basePrice = stats.filamentPrice[rarity];
    const value = (level - 1) * 3 * basePrice + basePrice;
    let diff = type == "cpu" ? stats.cpu_dPD[rarity] :
        type == "gpu" ? stats.gpu_dPD[rarity] :
            type == "psu" ? stats.psu_dPD[rarity] :
                type == "router" ? stats.fire_dPD[rarity] : value;
    diff = (diff + 1) / 2;

    switch (rarity) {
        case 5:
            if (dPM > 1) return Math.max((value + basePrice * 3 - 1.928 * (dPM - 1) ** (1 / 2)) / 1.5 * diff, value).toFixed(2) + "~" + Math.max((value * 2 + basePrice + basePrice * 2 * 4 - 3 * (dPM - 1) ** (2 / 3)) / 2 * diff, value * 1.5).toFixed(2);
            else if (dPM > 0) return ((value * 2 + basePrice * 3) * diff).toFixed(2) + "+";
            break;
        case 6:
            if (dPM == 100) return (value).toFixed(4);
            else if (dPM > 50) return Math.max((value + basePrice * 0.5 + 0.5 - 1.7 * (dPM - 50) ** (2 / 3)) * diff, value).toFixed(2) + "~" + (value * 1.5).toFixed(2);
            else if (dPM > 1) return Math.max((value + basePrice * 3 - 16 * (dPM - 1) ** (1 / 2)) * diff, value).toFixed(2) + "~" + Math.max((value / 45 * 68 + basePrice / 45 * 68 * 4 - 20.3 * (dPM - 1) ** (2 / 3)) * diff, value * 1.5).toFixed(2);
            else if (dPM > 0) return ((value / 45 * 68 + basePrice / 45 * 68 * 4 - 20.3 * (dPM - 1) ** (2 / 3)) * diff).toFixed(2);
            break;
        default:
            if (dPM > 30) return (value).toFixed(4) + "~" + (value * 1.5).toFixed(4);
            else if (dPM > 1) return Math.max((value + basePrice - 4.3 * basePrice / 30 * (dPM - 1) ** (1 / 2)) * diff, value).toFixed(4) + "~" + Math.max((value * 2 + basePrice * 2 - 4.3 * basePrice / 30 * (dPM - 1) ** (2 / 3)) * diff, value * 1.5).toFixed(4);
            else if (dPM > 0) return ((value * 2 + basePrice * 2 - 4.3 * basePrice / 30 * (dPM - 1) ** (2 / 3)) * diff).toFixed(4) + "+";
            break;
    }
    // If there's no estimated price for it, chances are it's worth a lot
    return "Invaluable"
}

export interface DPSPriceEstimationInfo {
    priceEstimation: number | [ minimum: number, maximum: number];
    limitReached: boolean;
}

export function dPS(dTI: number, level: number, rarity: Rarities, type: ItemTypes, stringify?: false): DPSPriceEstimationInfo
export function dPS(dTI: number, level: number, rarity: Rarities, type: ItemTypes, stringify: true): string

export default function dPS(
    dTI: number,
    level: number,
    rarity: Rarities,
    type: ItemTypes,
    stringify = false,
): string | DPSPriceEstimationInfo {
    const priceEstimation = estimatePrice(dTI, level, rarity, type);
    if (stringify) return priceEstimation;

    if (priceEstimation === "Invaluable") return {
        priceEstimation: Infinity,
        limitReached   : true,
    }

    if (priceEstimation.endsWith("+")) return {
        priceEstimation: Number(priceEstimation.replace("+", "")),
        limitReached   : false,
    }

    const estimationParts = priceEstimation.split("~");
    if (estimationParts.length > 1) {
        const [ minimumAsString, maximumAsString ] = estimationParts;
        const minimum = Number(minimumAsString);
        const maximum = Number(maximumAsString);
        return {
            priceEstimation: [ minimum, maximum ],
            limitReached   : false,
        }
    }

    return {
        priceEstimation: Number(priceEstimation),
        limitReached   : false,
    }
}