import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { adultcatsprites } from '../../../../../assets/Sprites/Pets/Cat';

const { width: SW } = Dimensions.get('window');
const PADDING_X = 2;
const PADDING_Y = 2;

const SAMPLING = { filter: 0, mipmap: 0 };

/** Unity: HealthyAdultCatFeeding — Anim_Cat3, frames 45–62 */
const FEEDING_HEALTHY = {
  spriteSheet: adultcatsprites.catmain,
  frameWidth: 48,
  frameHeight: 42,
  frameStart: 45,
  frameCount: 18,
};

/** Unity: SickAdultCatFeeding — Anim_Cat3_Sick1 */
const FEEDING_SICK = {
  spriteSheet: adultcatsprites.catsick,
  frameWidth: 48,
  frameHeight: 42,
  frameStart: 23,
  frameCount: 18,
};

/** Unity: VerySickAdultCatFeeding — Anim_Cat3_Sick2 */
const FEEDING_VERY_SICK = {
  spriteSheet: adultcatsprites.catverysick,
  frameWidth: 50,
  frameHeight: 42,
  frameStart: 23,
  frameCount: 18,
};

function CatAdultSprite_FeedingBase({
  spriteSheet,
  frameWidth,
  frameHeight,
  frameStart,
  frameCount,
  fps = 12,
  spriteScale = 4,
  canvasWidth = SW,
  canvasHeight,
  offsetX,
  offsetY = 0,
  style,
}) {
  const resolvedCanvasHeight = canvasHeight ?? frameHeight * spriteScale + 20;
  const resolvedOffsetX = offsetX ?? (SW - frameWidth * spriteScale) / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(frameCount, { duration: (frameCount / fps) * 1000, easing: Easing.linear }),
      -1,
    );
    return () => cancelAnimation(progress);
  }, [fps, frameCount]);

  const image = useImage(spriteSheet);

  const sprites = useRectBuffer(1, (rect) => {
    'worklet';
    const f = frameStart + Math.floor(progress.value % frameCount);
    rect.setXYWH(PADDING_X + f * frameWidth, PADDING_Y, frameWidth, frameHeight);
  });

  const transforms = [Skia.RSXform(spriteScale, 0, resolvedOffsetX, offsetY)];

  if (!image) return null;

  return (
    <Canvas style={[{ width: canvasWidth, height: resolvedCanvasHeight }, styles.canvas, style]}>
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={SAMPLING} />
    </Canvas>
  );
}

/** Default: healthy adult feeding (catmain) */
export function CatAdultSprite_Feeding(props) {
  return <CatAdultSprite_FeedingBase {...FEEDING_HEALTHY} {...props} />;
}

export function CatAdultSprite_Feeding_sick(props) {
  return <CatAdultSprite_FeedingBase {...FEEDING_SICK} {...props} />;
}

export function CatAdultSprite_Feeding_verysick(props) {
  return <CatAdultSprite_FeedingBase {...FEEDING_VERY_SICK} {...props} />;
}