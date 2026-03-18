import { scale } from "react-native-size-matters";
import { images } from "../../assets/images";
import { Theme } from "../../libs";
import { Retro } from "../../utils/extra/retro";
import UpgradePetModal from "../UpgradePetModal/upgradepetmodal";
import { rank } from "../../assets/rankbg";
import { trophy } from "../../assets/trophy";

export const LegendRankingModal = ({ steps, isVisible, onClose }) => {
    return <UpgradePetModal isVisible={isVisible} okPressed={onClose} subtitle={"Legend League"} bottomtext={`Total score last week:${steps} steps`} title={'Weekly Results'} backImg={rank.Legend}
        subtitleStyle={{ color: Theme.colors.yellodimranklegend, fontFamily: Retro, fontSize: scale(10) }}
        cup={trophy.Legend} btn={false} showPet={false} />
}
export const PlatinumRankingModal = ({ steps, isVisible, onClose }) => {
    return <UpgradePetModal isVisible={isVisible} onokPressedClose={onClose} subtitle={"Platinum  League"} bottomtext={`Total score last week:${steps} steps`} title={'Weekly Results'} backImg={rank.Platinum}
        subtitleStyle={{ color: Theme.colors.platinumranklegend, fontFamily: Retro, fontSize: scale(10) }}
        cup={trophy.Platinum} btn={false} showPet={false} />
}
export const GoldRankingModal = ({ steps, isVisible, onClose }) => {
    return <UpgradePetModal isVisible={isVisible} okPressed={onClose} subtitle={"Gold  League"} bottomtext={`Total score last week:${steps} steps`} title={'Weekly Results'} backImg={rank.Gold}
        subtitleStyle={{ color: Theme.colors.goldranklegend, fontFamily: Retro, fontSize: scale(10) }}
        cup={trophy.Gold} btn={false} showPet={false} />
}
export const SilverRankingModal = ({ steps, isVisible, onClose }) => {
    return <UpgradePetModal isVisible={isVisible} okPressed={onClose} subtitle={"Silver  League"} bottomtext={`Total score last week:${steps} steps`} title={'Weekly Results'} backImg={rank.Silver}
        subtitleStyle={{ color: Theme.colors.silverraked, fontFamily: Retro, fontSize: scale(10) }}
        cup={trophy.Silver} btn={false} showPet={false} />
}
export const BronzeRankingModal = ({ steps, isVisible, onClose }) => {
    return <UpgradePetModal isVisible={isVisible} okPressed={onClose} subtitle={"Bronze  League"} bottomtext={`Total score last week:${steps} steps`} title={'Weekly Results'} backImg={rank.Bronze}
        subtitleStyle={{ color: Theme.colors.bronzeraked, fontFamily: Retro, fontSize: scale(10) }}
        cup={trophy.Bronze} btn={false} showPet={false} />
}
export const UnrankedRankingModal = ({ steps, isVisible, onClose }) => {
    return <UpgradePetModal
    isVisible={isVisible} okPressed={onClose} subtitle={"Out of League"} 
    bottomtext={`You didn’t walk enough to get on last week’s leaderboard —but this week is a fresh start! Let’s go!`} title={'Weekly Results'} backImg={rank.unranked}
    btxstyle={{ fontFamily: Retro, fontSize: scale(7) ,marginHorizontal: scale(8) }}
    subtitleStyle={{ color: Theme.colors.unrankedranklegend, fontFamily: Retro, fontSize: scale(10) }}
        cup={images.star} btn={false} showPet={false} /> }