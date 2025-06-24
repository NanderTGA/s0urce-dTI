import stats, { Rarities } from "./stats.js";

export function estimatePrice(type: string, rarity: Rarities, mint: number, premium: boolean): string {
    let value = stats.filamentPrice[rarity];

    if (!type) {
        return mint > 3
            ? Math.max(Number(((50 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 100)).toFixed(2)), Number(value.toFixed(2))) + "~" + Math.max(Number(((100 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 400)).toFixed(2)), Number((2 * value).toFixed(2)))
            : (mint == 3 ? (66 * value).toFixed(2) + "+"
                : (mint == 2 ? (110 * value).toFixed(2) + "+"
                    : (400 * value).toFixed(2) + "+"));
    } else if (type == "skxll" || type == "navin" || type == "zenko" || type == "xenia" || type == "shadowpriestess" || type == "valenia") {
        value *= type == "skxll" || type == "navin"
            ? 1.5
            : type == "zenko" || type == "xenia" || "shadowpriestess"
                ? 2
                : 3; // valenia
    } else if (type == "pepehacker") {
        value *= 3;
    }
    if (type.includes("name_")) {
        return mint > 1
            ? Math.max(Number(((12.5 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 50)).toFixed(2)), Number(value.toFixed(2))) + "~" + Math.max(Number(((25 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 200)).toFixed(2)), Number((2 * value).toFixed(2)))
            : (25 * value).toFixed(2) + "+";
    } else if (premium) {
        return mint > 3
            ? Math.max(Number(((50 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 10)).toFixed(2)), Number(value.toFixed(2))) + "~" + Math.max(Number(((100 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 20)).toFixed(2)), Number((2 * value).toFixed(2)))
            : (mint == 3 ? (25 * value).toFixed(2) + "+"
                : (mint == 2 ? (50 * value).toFixed(2) + "+"
                    : (100 * value).toFixed(2) + "+"));
    }
    return mint > 3
        ? Math.max(Number(((50 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 100)).toFixed(2)), Number(value.toFixed(2))) + "~" + Math.max(Number(((100 * value) ** (1 / (1 + Math.log10(mint))) - (mint / 400)).toFixed(2)), Number((2 * value).toFixed(2)))
        : (mint == 3 ? (50 * value).toFixed(2) + "+"
            : (mint == 2 ? (100 * value).toFixed(2) + "+"
                : (200 * value).toFixed(2) + "+"));
}

export function dCPS(name: string, rarity: Rarities, mint: number, premium: boolean, stringify?: false): { priceEstimation: number, limitReached: boolean }
export function dCPS(name: string, rarity: Rarities, mint: number, premium: boolean, stringify: true): string
export default function dCPS(
    name: string,
    rarity: Rarities,
    mint: number,
    premium: boolean,
    stringify = false,
): string | { priceEstimation: number, limitReached: boolean } {
    const priceEstimation = estimatePrice(name.toLowerCase(), rarity, mint, premium);
    if (stringify) return priceEstimation;
    return {
        priceEstimation: Number(priceEstimation.replaceAll("~", "").replaceAll("+", "")),
        limitReached   : priceEstimation.endsWith("+"),
    };
}