import { Rarities, Item, RaritiesLettersReverse, ItemGradeInfo, ItemRankInfo } from "./types.js";

import packageJSON from "../package.json" with { type: "json" }
const { version } = packageJSON;

import { getItemRank } from "./rankings/getItemRank.js";
import dPM from "./dPM.js";
import dPS, { DPSPriceEstimationInfo } from "./dPS.js";

export default function getItemGrade(item: Item, stringify?: true): string | undefined;
export default function getItemGrade(item: Item, stringify: false): ItemGradeInfo | undefined;
export default function getItemGrade(item: Item, stringify = true): string | ItemGradeInfo | undefined {
    const rarity = Rarities[RaritiesLettersReverse[item.rarity]];
    const level = item.upgradeLevel ?? 1;

    const rank = getItemRank(item, rarity, level);

    let percentile: number | undefined;
    if (rank) {
        const standardGrade = getItemRank(item, rarity, level, true) as ItemRankInfo
        percentile = dPM(item.type, rarity, standardGrade.rating);
    }

    const estimatedPrice = percentile ? dPS(percentile, level, rarity, item.type) : undefined;

    if (!stringify) return { rank, version, percentile, estimatedPrice: estimatedPrice as DPSPriceEstimationInfo };


    // 5.6842 / 10 dCI 12p (~69 BTC) v1.6.2
    const stringParts = []

    if (rank) stringParts.push(`${rank.rating} / 10 ${rank.name}`)
    if (percentile) stringParts.push(`${percentile}p`)
    if (estimatedPrice) stringParts.push(`(${estimatedPrice as string})`)
    stringParts.push(`v${version}`)

    return stringParts.join(" ")
}