import { Animated, Dimensions, Image, ImageBackground, Pressable, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import { setNewUser } from "../../../redux/slices/tutorialslice"
import { images } from "../../../assets/images"
import { style } from "./styles"
import { moderateScale } from "react-native-size-matters"
import { SvgXml } from "react-native-svg"
import { cracks, eggsvg } from "../../../assets/Cracks"
import { congratulationsound, playEggCrackSound } from "../../../utils/SoundManager/SoundManager"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { PuffMainSprite } from "../../../components/PetSprites/puff"
import { getPetSpriteComponent } from "../../../components/PetSprites/petSpriteMap"
import { getFixedBabySpriteScale } from "../../../components/PetSprites/ActivePetSprite"
import { tutorial9svg, totorial10svg } from "../../../assets/svgs"

const TAP_CRACK1 = 2
const TAP_CRACK2 = 6
const TAP_HATCH = 9
const PUFF_FRAMES = 17
const PUFF_FPS = 12
const PUFF_DURATION_MS = Math.ceil((PUFF_FRAMES / PUFF_FPS) * 1000) + 80

const EGG_XML = { "1": eggsvg.dogegg, "2": eggsvg.categg, "3": eggsvg.dinogg }
const MEET_LABEL = { "1": "Meet your Puppy!", "2": "Meet your Kitten!", "3": "Meet your Dino!" }
const BABY_FRAME = { "1": { w: 37, h: 32 }, "2": { w: 31, h: 32 }, "3": { w: 36, h: 33 } }

const SLIDE_TUTORIAL9 = 6
const SLIDE_TUTORIAL10 = 7

const POST_HATCH_TUTORIALS = [
    images.tutorial3,
    images.tutorial4,
    images.tutorial5,
    images.tutorial6,
    images.tutorial7,
    images.tutorial8,
    images.tutorial9,
    images.tutorial10,
]

export default () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const petkey = useSelector((s) => s.petReducer?.petkey ?? "")
    const pendingEggHatch = useSelector((s) => s.startoverpetslice?.pendingEggHatch)
    const key = String(petkey || "").trim() || "3"

    const [tapcount, setTapcount] = useState(0)
    const [crackLevel, setCrackLevel] = useState(0)
    const [hatched, setHatched] = useState(false)
    /** null = meet screen; 0..7 = tutorial3..tutorial10 */
    const [postTutorialSlide, setPostTutorialSlide] = useState(null)
    const [showPuff, setShowPuff] = useState(false)
    const shakeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(1)).current

    const eggXml = EGG_XML[key] ?? EGG_XML["3"]
    const meetLine = MEET_LABEL[key] ?? MEET_LABEL["3"]
    const BabySprite = useMemo(() => getPetSpriteComponent(key, "baby", "Healthy"), [key])
    const frame = BABY_FRAME[key] ?? BABY_FRAME["3"]

    const spriteCanvasW = moderateScale(120)
    const babyScale = getFixedBabySpriteScale()
    const puffScale = babyScale
    const babyOffsetX = (spriteCanvasW - frame.w * babyScale) / 2
    const puffOffsetX = (spriteCanvasW - 56 * puffScale) / 2
    const spriteCanvasH = Math.max(moderateScale(120), Math.ceil(frame.h * babyScale + moderateScale(28)))
    const puffOffsetY = moderateScale(-18)

    useEffect(() => {
        if (!showPuff) return
        const t = setTimeout(() => setShowPuff(false), PUFF_DURATION_MS)
        return () => clearTimeout(t)
    }, [showPuff])

    useLayoutEffect(() => {
        if (!pendingEggHatch) return
        setHatched(true)
        setPostTutorialSlide(0)
    }, [pendingEggHatch])

    const animateCrack = () => {
        shakeAnim.setValue(0)
        scaleAnim.setValue(1)
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 6, duration: 20, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 20, useNativeDriver: true }),
        ]).start()
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.06, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start()
    }

    const onEggTap = () => {
        const newTap = tapcount + 1
        setTapcount(newTap)
        if (newTap === TAP_CRACK1) {
            setCrackLevel(1)
            playEggCrackSound()
        } else if (newTap === TAP_CRACK2) {
            setCrackLevel(2)
            playEggCrackSound()
        } else if (newTap === TAP_HATCH) {
            setHatched(true)
            setShowPuff(true)
            congratulationsound()
            return
        }
        animateCrack()
    }

    const onPress = () => {
        if (postTutorialSlide !== null) {
            if (postTutorialSlide < POST_HATCH_TUTORIALS.length - 1) {
                setPostTutorialSlide((s) => s + 1)
                return
            }
            dispatch(setNewUser(false))
            navigation.navigate("Main")
            return
        }
        if (hatched) {
            setPostTutorialSlide(0)
            return
        }
        onEggTap()
    }

    const crackSource = crackLevel === 1 ? cracks.c1 : crackLevel === 2 ? cracks.c2 : null

    const subText = tapcount === 0 ? "Tap the egg to hatch it!" : "Keep tapping!!"
    const boxText = hatched
        ? meetLine
        : tapcount === 0
          ? "Tap the egg to hatch it!"
          : "Keep tapping!!"

    const bgSource =
        postTutorialSlide !== null
            ? POST_HATCH_TUTORIALS[postTutorialSlide]
            : hatched
              ? images.tutorial2
              : images.NewTutorial

    const { width: screenW } = Dimensions.get("window")
    const svgOverlayW = Math.min(screenW - moderateScale(24), moderateScale(360))
    const tutorial9SvgH = svgOverlayW * (431 / 1079)
    const tutorial10SvgH = svgOverlayW * (360 / 1057)

    return (
        <ImageBackground source={bgSource} style={style.container}>
            <View style={style.layerFill}>
                {postTutorialSlide !== null ? (
                    <View pointerEvents="none" style={style.headerHidden}>
                        <View>
                            <Text style={style.heading}>Mystery Egg</Text>
                            <Text style={style.sub}>{subText}</Text>
                        </View>
                        <ImageBackground source={images.messageboxtutoial} style={style.image}>
                            <Text style={style.messabeboxtext}>{boxText}</Text>
                        </ImageBackground>
                    </View>
                ) : (
                    <>
                        <View style={hatched ? style.headerHidden : null}>
                            <Text style={style.heading}>Mystery Egg</Text>
                            <Text style={style.sub}>{subText}</Text>
                        </View>
                        <ImageBackground source={images.messageboxtutoial} style={style.image}>
                            <Text style={style.messabeboxtext}>{boxText}</Text>
                        </ImageBackground>
                    </>
                )}

                <Pressable onPress={onPress}>
                    {!hatched ? (
                        <Animated.View
                            style={[
                                style.petSlot,
                                { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] },
                            ]}
                        >
                            <View style={style.eggInner}>
                                <SvgXml width={moderateScale(100)} height={moderateScale(100)} xml={eggXml} />
                                {crackSource && (
                                    <Image
                                        source={crackSource}
                                        resizeMode="contain"
                                        style={crackLevel === 1 ? style.crack1 : style.crack2}
                                    />
                                )}
                            </View>
                        </Animated.View>
                    ) : (
                        <View style={[style.petSlot, style.hatchStack]}>
                            <BabySprite
                                canvasWidth={spriteCanvasW}
                                canvasHeight={spriteCanvasH}
                                spriteScale={babyScale}
                                offsetX={babyOffsetX}
                            />
                            {showPuff && (
                                <View style={style.puffOverlay} pointerEvents="none">
                                    <PuffMainSprite
                                        loop={false}
                                        canvasWidth={spriteCanvasW}
                                        canvasHeight={spriteCanvasH}
                                        spriteScale={puffScale}
                                        offsetX={puffOffsetX}
                                        offsetY={puffOffsetY}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </Pressable>

                {postTutorialSlide === SLIDE_TUTORIAL9 && (
                    <View style={style.tutorialSvgOverlay} pointerEvents="none">
                        <SvgXml xml={tutorial9svg} width={svgOverlayW} height={tutorial9SvgH} />
                    </View>
                )}
                {postTutorialSlide === SLIDE_TUTORIAL10 && (
                    <View style={style.tutorialSvgOverlay9} pointerEvents="none">
                        <SvgXml xml={totorial10svg} width={svgOverlayW} height={tutorial10SvgH} />
                    </View>
                )}
            </View>
        </ImageBackground>
    )
}
