import { Theme } from "../../libs";

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export const retro=Theme.typography.Retro.fontFamily
export const careDurations = {
    feed: (7 / 8) * 1500,
    drink: (29 / 12) * 1000,
    clean: (36 / 12) * 1000,
    treat: (78 / 12) * 1000,
};
