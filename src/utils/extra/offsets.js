import { scale } from "react-native-size-matters";

/** Extra shift from pet anchor (pet uses offsetX/Y in Home) so bowl/water/etc sit on the pet. */
export const careOnPetNudge = {
    feed: { x: scale(18), y: scale(50) },
    drink: { x: scale(25), y: scale(45) },
    clean: { x: scale(-10), y: scale(40) },
    treat: { x: scale(-10), y: scale(45) },
};
