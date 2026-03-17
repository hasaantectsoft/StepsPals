import { spriteKeys } from "../CareActionSpriteKeys/CareActionSpriteKeys";

export const careMap = {
    clean: spriteKeys.find(x => x.id === 1)?.spritecomponent,
    treat: spriteKeys.find(x => x.id === 2)?.spritecomponent,
    feed: spriteKeys.find(x => x.id === 3)?.spritecomponent,
    drink: spriteKeys.find(x => x.id === 4)?.spritecomponent,
};
