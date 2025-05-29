import stats, { Rarities, ItemTypes } from "./stats.js";

export const DPS_VERSION = "1.6.2"; //TODO global version number??

export function estimatePrice(dTI: number, level: number, rarity: Rarities, type: ItemTypes): number | undefined {
    let basePrice = stats.filamentPrice[rarity];
    const value = (level - 1) * 3 * basePrice + basePrice;
    if (type !== "cpu" && type !== "firewall") basePrice /= 2; // AKA psu or gpu

    if (rarity < Rarities.mythic) {
        if (dTI < 7) return value;
        else if (dTI < 8) return value + (dTI - 7) * basePrice / 3;
        else if (dTI < 9) return value + (dTI - 8) * basePrice / 3 * 2 + basePrice / 3;
        else if (dTI < 9.9) return value + (dTI - 9) * basePrice + basePrice;
    } else if (rarity < Rarities.ethereal) {
        if (dTI < 5) return value;
        else if (dTI < 6) return value + (dTI - 5) * basePrice / 3;
        else if (dTI < 7) return value + (dTI - 6) * basePrice / 3 * 2 + basePrice / 3;
        else if (dTI < 8) return value + (dTI - 7) * basePrice + basePrice;
        else if (dTI < 9) return value + (dTI - 7) * basePrice * 5 / 3 + basePrice * 2;
        else if (dTI < 9.7) return value + (dTI - 7) * basePrice * 10 / 3 + basePrice * 11 / 3;
    } else if (dTI < 4) return value;
    else if (dTI < 5) return value + (dTI - 4) * basePrice / 6;
    else if (dTI < 6) return value + (dTI - 5) * basePrice / 3 + basePrice / 6;
    else if (dTI < 7) return value + (dTI - 6) * basePrice / 2 + basePrice / 2;
    else if (dTI < 8) return value + (dTI - 7) * basePrice + basePrice;
    else if (dTI < 9) return value + (dTI - 8) * basePrice * 2 + basePrice * 2;
    else if (dTI < 9.5) return value + (dTI - 8) * basePrice * 5 + basePrice * 4;
}

export default function dPS(
    dTI: number,
    level: number,
    rarity: Rarities,
    type: ItemTypes,
): string {
    const estimatedPrice = estimatePrice(dTI, level, rarity, type);
    // If there's no estimated price for it, chances are it's worth a lot
    if (!estimatedPrice) return "Invaluable";

    return `~${estimatedPrice.toFixed(4)} BTC`;
}