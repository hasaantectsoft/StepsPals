import { Theme } from "../../libs";

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export const retro=Theme.typography.Retro.fontFamily