import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { adultdinosprites } from '../../../../../assets/Sprites/Pets/Dino';
const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function DinoAdultSprite({
  spriteSheet,
  frameWidth,
  frameHeight,
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
    const f = Math.floor(progress.value % frameCount);
    rect.setXYWH(f * frameWidth, 0, frameWidth, frameHeight);
  });

  const transforms = [Skia.RSXform(spriteScale, 0, resolvedOffsetX, offsetY)];

  if (!image) return null;

  return (
    <Canvas style={[{ width: canvasWidth, height: resolvedCanvasHeight }, styles.canvas, style]}>
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={{ B: 0, C: 0 }} />
    </Canvas>
  );
}
export function DinoAdultSprite_main(props) {
  return (
    <DinoAdultSprite
      spriteSheet={adultdinosprites.dinomain}
      frameWidth={50}
      frameHeight={44}
      frameCount={33}
      fps={12}
      {...props}
    />
  );
}

export function DinoAdultSprite_dead(props) {
  return (
    <DinoAdultSprite
      spriteSheet={adultdinosprites.dino_dead}
      frameWidth={39}
      frameHeight={36}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function DinoAdultSprite_sick(props) {
  return (
    <DinoAdultSprite
      spriteSheet={adultdinosprites.dinosick}
      frameWidth={48}
      frameHeight={43}
      frameCount={26}
      fps={12}
      {...props}
    />
  );
}

export function DinoAdultSprite_verysick(props) {
  return (
    <DinoAdultSprite
      spriteSheet={adultdinosprites.dinoverysick}
      frameWidth={48}
      frameHeight={43}
      frameCount={25}
      fps={12}
      {...props}
    />
  );
}

export function DinoAdultSprite_feeding(props) {
  return (
    <DinoAdultSprite
      spriteSheet={adultdinosprites.dinofeeding}
      frameWidth={50}
      frameHeight={44}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DinoAdultSprite_sickfeeding(props) {
  return (
    <DinoAdultSprite
      spriteSheet={adultdinosprites.dinosickfeeding}
      frameWidth={48}
      frameHeight={43}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DinoAdultSprite_verysickfeeding(props) {
  return (
    <DinoAdultSprite
      spriteSheet={adultdinosprites.dinoverysickfeeding}
      frameWidth={48}
      frameHeight={43}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}