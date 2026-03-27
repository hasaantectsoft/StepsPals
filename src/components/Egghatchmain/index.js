import { Animated, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import { images } from "../../assets/images";
import { cracks, eggsvg } from "../../assets/Cracks";
import { congratulationsound, playEggCrackSound } from "../../utils/SoundManager/SoundManager";
import { PuffMainSprite } from "../PetSprites/puff";
import { getPetSpriteComponent } from "../PetSprites/petSpriteMap";
import { getFixedBabySpriteScale } from "../PetSprites/ActivePetSprite";
import { style as styles } from "./styles";
const TAP_CRACK1 = 3;
const TAP_CRACK2 = 6;
const TAP_HATCH = 9;
const PUFF_FRAMES = 17;
const PUFF_FPS = 12;
const PUFF_DURATION_MS = Math.ceil((PUFF_FRAMES / PUFF_FPS) * 1000) + 80;

const EGG_XML = { "1": eggsvg.dogegg, "2": eggsvg.categg, "3": eggsvg.dinogg };
const BABY_FRAME = { "1": { w: 37, h: 32 }, "2": { w: 31, h: 32 }, "3": { w: 36, h: 33 } };
export default function EggHatch({ onProceedAfterHatch }) {
  const petkey = useSelector((s) => s.petReducer?.petkey ?? "");
  const key = String(petkey || "").trim() || "3";

  const [tapcount, setTapcount] = useState(0);
  const [crackLevel, setCrackLevel] = useState(0);
  const [hatched, setHatched] = useState(false);
  const [showPuff, setShowPuff] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const eggXml = EGG_XML[key] ?? EGG_XML["3"];
  const BabySprite = useMemo(() => getPetSpriteComponent(key, "baby", "Healthy"), [key]);
  const frame = BABY_FRAME[key] ?? BABY_FRAME["3"];

  const spriteCanvasW = moderateScale(120);
  const babyScale = getFixedBabySpriteScale();
  const puffScale = babyScale;
  const babyOffsetX = (spriteCanvasW - frame.w * babyScale) / 2;
  const puffOffsetX = (spriteCanvasW - 56 * puffScale) / 2;
  const spriteCanvasH = Math.max(moderateScale(120), Math.ceil(frame.h * babyScale + moderateScale(28)));
  const puffOffsetY = moderateScale(-18);

  useEffect(() => {
    if (!hatched) return;
    const t = setTimeout(() => {
      setShowPuff(false);
      onProceedAfterHatch?.();
    }, PUFF_DURATION_MS);
    return () => clearTimeout(t);
  }, [hatched, onProceedAfterHatch]);

  const animateCrack = () => {
    shakeAnim.setValue(0);
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6, duration: 20, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 20, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.06, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const onEggTap = () => {
    const newTap = tapcount + 1;
    setTapcount(newTap);
    if (newTap === TAP_CRACK1) {
      setCrackLevel(1);
      playEggCrackSound();
    } else if (newTap === TAP_CRACK2) {
      setCrackLevel(2);
      playEggCrackSound();
    } else if (newTap === TAP_HATCH) {
      setHatched(true);
      setShowPuff(true);
      congratulationsound();
      return;
    }
    animateCrack();
  };

  const onPress = () => {
    if (hatched) return;
    onEggTap();
  };

  const crackSource = crackLevel === 1 ? cracks.c1 : crackLevel === 2 ? cracks.c2 : null;
  const subText = tapcount === 0 ? "Tap the egg to hatch it!" : "Keep tapping!!";

  return (
    <ImageBackground source={images.EggBreak} style={styles.container}>
      <View style={styles.layerFill}>
        <Text style={styles.heading}>Mystery Egg</Text>
        <Text style={styles.sub}>{subText}</Text>
       

        <Pressable onPress={onPress}>
          {!hatched ? (
            <Animated.View
              style={[styles.petSlot, { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }]}
            >
              <View style={styles.eggInner}>
                <SvgXml width={moderateScale(100)} height={moderateScale(100)} xml={eggXml} />
                {crackSource && (
                  <Image
                    source={crackSource}
                    resizeMode="contain"
                    style={crackLevel === 1 ? styles.crack1 : styles.crack2}
                  />
                )}
              </View>
            </Animated.View>
          ) : (
            <View style={[styles.petSlot, styles.hatchStack]}>
              <BabySprite
                canvasWidth={spriteCanvasW}
                canvasHeight={spriteCanvasH}
                spriteScale={babyScale}
                offsetX={babyOffsetX}
              />
              {showPuff && (
                <View style={styles.puffOverlay} pointerEvents="none">
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
      </View>
    </ImageBackground>
  );
}
